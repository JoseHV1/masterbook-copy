import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class SearchService {
  constructor(private _http: HttpClient) {}

  /**
   * Performs a search request for any entity.
   * @param entity - The entity name (e.g., "policy", "account").
   * @param query - The search query string.
   * @param filterBy - The filter parameter key.
   * @param pageNumber - The page number for pagination (default: 1).
   * @param docsPerPage - The number of items per page (default: 10).
   * @returns An Observable of the search result.
   */
  filter<T>(
    entity: string,
    filters: { [key: string]: string | number },
    pageNumber: number = 1,
    docsPerPage: number = 10
  ): Observable<T> {
    const url = `${environment.apiUrl}${entity}`;
    const params = new URLSearchParams({
      page: String(pageNumber),
      limit: String(docsPerPage),
    });

    // Append all filters dynamically
    Object.entries(filters).forEach(([key, value]) => {
      params.append(key, String(value));
    });

    // console.log(url + '?' + params.toString());

    return this._http.get<T>(`${url}?${params.toString()}`);
  }

  /**
   * Fetches a paginated list of any entity.
   * @param entity - The entity name (e.g., "account", "policy").
   * @param pageIndex - The page index (zero-based).
   * @param pageSize - The number of items per page.
   * @returns An Observable of the paginated list.
   */
  getList<T>(
    entity: string,
    pageIndex: number,
    pageSize: number
  ): Observable<T> {
    // Increment page index for one-based pagination.
    const url = `${environment.apiUrl}${entity}?page=${
      pageIndex + 1
    }&limit=${pageSize}`;
    // console.log(url);
    return this._http
      .get<{ data: T }>(url)
      .pipe(map(response => response.data));
  }
}
