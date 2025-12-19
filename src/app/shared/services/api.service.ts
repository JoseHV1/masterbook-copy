import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  // Normalize base URL (remove trailing slashes)
  private readonly baseUrl: string;

  constructor(private http: HttpClient) {
    const rawBase = environment.apiUrl ?? '';
    const trimmed = rawBase.replace(/\/+$/, ''); // trim trailing slashes

    // Validate the base as an absolute URL if possible
    try {
      // Throws if not a valid absolute URL
      new URL(trimmed);
    } catch {
      // eslint-disable-next-line no-console
      console.warn(
        `[ApiService] environment.apiUrl seems invalid or relative: "${rawBase}".` +
          ' Ensure it is an absolute URL like "https://api.example.com".'
      );
    }

    this.baseUrl = trimmed;
  }

  /** GET */
  get<T>(
    endpoint: string,
    params?: HttpParams | Record<string, any>,
    headers?: HttpHeaders | Record<string, string>
  ): Observable<T> {
    const url = this.buildUrl(endpoint);
    // console.log('[HTTP GET]', url, params); // ⬅️ uncomment to debug
    return this.http.get<T>(url, {
      params: this.toHttpParams(params),
      headers: this.toHttpHeaders(headers),
    });
  }

  /** POST */
  post<T>(
    endpoint: string,
    body: any,
    headers?: HttpHeaders | Record<string, string>,
    params?: HttpParams | Record<string, any>
  ): Observable<T> {
    const url = this.buildUrl(endpoint);
    // console.log('[HTTP POST]', url); // ⬅️ uncomment to debug
    return this.http.post<T>(url, body, {
      headers: this.toHttpHeaders(headers),
      params: this.toHttpParams(params),
    });
  }

  /** PUT */
  put<T>(
    endpoint: string,
    body: any,
    headers?: HttpHeaders | Record<string, string>,
    params?: HttpParams | Record<string, any>
  ): Observable<T> {
    const url = this.buildUrl(endpoint);
    // console.log('[HTTP PUT]', url); //
    return this.http.put<T>(url, body, {
      headers: this.toHttpHeaders(headers),
      params: this.toHttpParams(params),
    });
  }

  /** PATCH */
  patch<T>(
    endpoint: string,
    body: any,
    headers?: HttpHeaders | Record<string, string>,
    params?: HttpParams | Record<string, any>
  ): Observable<T> {
    const url = this.buildUrl(endpoint);
    return this.http.patch<T>(url, body, {
      headers: this.toHttpHeaders(headers),
      params: this.toHttpParams(params),
    });
  }

  /** DELETE */
  delete<T>(
    endpoint: string,
    headers?: HttpHeaders | Record<string, string>,
    params?: HttpParams | Record<string, any>
  ): Observable<T> {
    const url = this.buildUrl(endpoint);
    // console.log('[HTTP DELETE]', url); //
    return this.http.delete<T>(url, {
      headers: this.toHttpHeaders(headers),
      params: this.toHttpParams(params),
    });
  }

  /** If your backend expects page/limit */
  pagination(page = 1, limit = 10): HttpParams {
    return new HttpParams()
      .set('page', String(page))
      .set('limit', String(limit));
  }

  /** If your backend expects page_number/docs_per_page (legacy) */
  private defaultPagination(page = 1, size = 10): HttpParams {
    return new HttpParams()
      .set('page_number', String(page))
      .set('docs_per_page', String(size));
  }

  /**
   * Build a safe URL from base + endpoint.
   * Accepts endpoints with or without a leading slash ("/invoices" or "invoices").
   */
  private buildUrl(endpoint: string): string {
    if (typeof endpoint !== 'string' || !endpoint.trim()) {
      throw new Error(`ApiService: invalid endpoint "${endpoint}"`);
    }

    // Trim leading slashes on endpoint so we can safely join with a single slash
    const cleanEndpoint = endpoint.replace(/^\/+/, '');

    // If baseUrl is empty (relative usage), just return endpoint as-is
    if (!this.baseUrl) {
      return `/${cleanEndpoint}`;
    }

    const url = `${this.baseUrl}/${cleanEndpoint}`;

    // Best-effort validation (will pass for absolute bases; harmless for relative)
    try {
      new URL(url);
    } catch {
      // eslint-disable-next-line no-console
      console.warn(`[ApiService] Built URL appears invalid: "${url}"`);
    }

    return url;
  }

  /** Convert plain objects/arrays/booleans into HttpParams */
  private toHttpParams(
    params?: HttpParams | Record<string, any>
  ): HttpParams | undefined {
    if (!params) return undefined;
    if (params instanceof HttpParams) return params;

    let hp = new HttpParams();

    Object.entries(params)
      .filter(([, v]) => v !== undefined && v !== null)
      .forEach(([key, value]) => {
        if (Array.isArray(value)) {
          value.forEach(
            v =>
              v !== undefined && v !== null && (hp = hp.append(key, String(v)))
          );
        } else if (typeof value === 'object') {
          // shallow-flatten objects like { range: { from: 1, to: 2 } } -> range[from]=1&range[to]=2
          Object.entries(value as Record<string, any>)
            .filter(([, v]) => v !== undefined && v !== null)
            .forEach(([k, v]) => {
              hp = hp.append(`${key}[${k}]`, String(v));
            });
        } else {
          hp = hp.set(key, String(value));
        }
      });

    return hp;
  }

  /** Normalize headers: accept HttpHeaders or a simple key-value map */
  private toHttpHeaders(
    headers?: HttpHeaders | Record<string, string>
  ): HttpHeaders | undefined {
    if (!headers) return undefined;
    if (headers instanceof HttpHeaders) return headers;

    return Object.entries(headers).reduce((acc, [k, v]) => {
      return acc.set(k, v);
    }, new HttpHeaders());
  }
}
