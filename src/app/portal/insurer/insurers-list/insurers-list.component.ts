import { Component, OnDestroy, OnInit } from '@angular/core';
import { finalize, Subject, switchMap, take, takeUntil } from 'rxjs';

import { UiService } from 'src/app/shared/services/ui.service';
import { FilteredTable } from 'src/app/shared/classes/filtered-table-base/filtered-table.base';
import { InsurerModel } from 'src/app/shared/interfaces/models/insurer.model';
import { FilterWrapperModel } from 'src/app/shared/models/filters.model';
import { PaginatedResponse } from 'src/app/shared/interfaces/models/paginated-response.model';
import { InsurerConfigService } from 'src/app/shared/services/insurer-config.service';
import { ActivatedRoute } from '@angular/router';
import { UiModalTypeEnum } from '@app/shared/enums/ui-modal-type.enum';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-insurers-list',
  templateUrl: './insurers-list.component.html',
  styleUrls: ['./insurers-list.component.scss'],
})
export class InsurersListComponent
  extends FilteredTable<InsurerModel>
  implements OnInit, OnDestroy
{
  filterConfig!: FilterWrapperModel;
  data: PaginatedResponse<InsurerModel[]> = {
    records: [],
    page: 0,
    limit: 10,
    total_records: 0,
  };
  private destroy$ = new Subject<void>();

  constructor(
    private activateRoute: ActivatedRoute,
    private _insurer: InsurerConfigService,
    private _ui: UiService,
    private _t: TranslateService
  ) {
    super();
    this.filterConfig = this._insurer.getInsurerListFilters();
    this._fetchData(this.data.page, this.data.limit);
  }

  ngOnInit(): void {
    this.activateRoute.queryParams.pipe(takeUntil(this.destroy$)).subscribe({
      next: params => {
        const notInsurers = params['not_insurers'];
        if (notInsurers === 'true') {
          this._ui
            .showInformationModal({
              text: this._t.instant('PORTAL.INSURER.COMMISSION_RATES_TEXT'),
              title: this._t.instant('PORTAL.INSURER.COMMISSION_RATES_TITLE'),
              type: UiModalTypeEnum.WARNING,
            })
            .subscribe();
        }
      },
      error: err => {
        console.error('Error al obtener los parámetros de la URL', err);
      },
    });
  }

  _fetchData(page: number, hitsPerPage?: number): void {
    const hits = hitsPerPage ?? this.data.limit;
    this._ui.showLoader();
    this._insurer
      .getInsurers(page, hits, this.filterText)
      .pipe(finalize(() => this._ui.hideLoader()))
      .subscribe(resp => {
        this.data = resp;
      });
  }

  refresh(): void {
    this._fetchData(this.data.page - 1, this.data.limit);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
