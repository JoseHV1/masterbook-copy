import { AfterViewInit, Component } from '@angular/core';
import { finalize } from 'rxjs';
import { RequestsService } from 'src/app/shared/services/requests.service';
import { UiService } from 'src/app/shared/services/ui.service';
import { FilterWrapperModel } from 'src/app/shared/models/filters.model';
import { UrlService } from 'src/app/shared/services/url.service';
import { FilteredTable } from 'src/app/shared/classes/filtered-table-base/filtered-table.base';
import { PopulatedRequestModel } from 'src/app/shared/interfaces/models/request.model';
import { PaginatedResponse } from 'src/app/shared/interfaces/models/paginated-response.model';
import { requestTutor } from '../../../../shared/tutors/request-tutor';
import { TutorService } from '@app/shared/services/tutor.service';
import { TutorsSlugsEnum } from '@app/shared/enums/tutors-slugs.enum';
import { AuthService } from '@app/shared/services/auth.service';
import { AuthModel } from '@app/shared/interfaces/models/auth.model';

@Component({
  selector: 'app-requests-list',
  templateUrl: './requests-list.component.html',
  styleUrls: ['./requests-list.component.scss'],
})
export class RequestsListComponent
  extends FilteredTable<PopulatedRequestModel>
  implements AfterViewInit
{
  filterConfig!: FilterWrapperModel;

  data: PaginatedResponse<PopulatedRequestModel[]> = {
    records: [],
    page: 0,
    limit: 10,
    total_records: 0,
  };

  constructor(
    private _requests: RequestsService,
    private _ui: UiService,
    public _url: UrlService,
    private _tutor: TutorService,
    private _auth: AuthService
  ) {
    super();
    const currentUser = this._auth.getAuth() as AuthModel;
    this.filterConfig = this._requests.getRequestsListFilters(
      currentUser.user.role as string
    );
    this._fetchData(this.data.page, this.data.limit);
  }

  ngAfterViewInit(): void {
    if (!this._tutor.isCompleted(TutorsSlugsEnum.CREATE_REQUEST))
      this.showTutor();
  }

  _fetchData(page: number, limit?: number): void {
    const hits = limit ?? this.data.limit;
    this._ui.showLoader();
    this._requests
      .getRequests(page, hits, this.filterText)
      .pipe(finalize(() => this._ui.hideLoader()))
      .subscribe(resp => {
        this.data = resp;
      });
  }

  refresh(): void {
    this._fetchData(this.data.page - 1, this.data.limit);
  }

  showTutor() {
    requestTutor(this._tutor).drive();
  }
}
