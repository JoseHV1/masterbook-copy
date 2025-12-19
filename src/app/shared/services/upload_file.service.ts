import { Injectable } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { UploadFileRequest } from '../interfaces/requests/upload-file/upload-file.request';
import { HttpClient } from '@angular/common/http';
import { map, Observable, of } from 'rxjs';
import { environment } from 'src/environments/environment';
import { ApiResponseModel } from '../interfaces/models/api-response.model';
import { UploadFileModel } from '../interfaces/models/upload-file.model';
import { PaginatedResponse } from '../interfaces/models/paginated-response.model';
import { FilterWrapperModel } from '../models/filters.model';
import { FilterTypeEnum } from '../enums/filter-type.enum';
import { enumToDropDown } from '../helpers/enum-to-dropdown.helper';
import { UploadFileStatusEnum } from '../enums/upload-file-status.enum';

@Injectable({
  providedIn: 'root',
})
export class UploadFileService {
  constructor(private _http: HttpClient) {}

  createNewUploadFileForm(): FormGroup {
    return new FormGroup({
      file_base64: new FormControl(null, [Validators.required]),
      file_name: new FormControl(null, [Validators.required]),
    });
  }

  createUploadFile(req: UploadFileRequest): Observable<any> {
    return this._http
      .post<any>(`${environment.apiUrl}upload-file`, req)
      .pipe(map(resp => resp.data));
  }

  getUploadsFiles(
    pageIndex: number,
    pageSize: number,
    entity: string,
    filters?: string
  ): Observable<PaginatedResponse<UploadFileModel[]>> {
    pageIndex++;
    return this._http
      .get<ApiResponseModel<PaginatedResponse<UploadFileModel[]>>>(
        `${
          environment.apiUrl
        }upload-file/${entity}?page=${pageIndex}&limit=${pageSize}${
          filters ?? ''
        }`
      )
      .pipe(map(resp => resp.data));
  }

  getUploadFileListFilters(): FilterWrapperModel {
    return {
      filters: [
        {
          label: 'Upload At',
          name: 'created_at_date',
          type: FilterTypeEnum.DATE_RANGE,
        },
        {
          label: 'Status',
          name: 'status',
          type: FilterTypeEnum.SELECT,
          options: of(enumToDropDown(UploadFileStatusEnum)),
        },
      ],
    };
  }
}
