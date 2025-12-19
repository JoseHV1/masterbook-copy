import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root', // Makes the service globally available
})
export class UrlService {
  constructor(private router: Router) {}

  /**
   * Constructs a URL based on a base path, an optional parameter, and an optional suffix.
   * @param basePath - The base path of the URL (e.g., "portal/accounts").
   * @param param - A single parameter to append (e.g., "123").
   * @param suffix - An optional string to append to the URL (e.g., "edit").
   * @returns The constructed URL as a string.
   */
  buildUrl(basePath: string, param?: string | number, suffix?: string): string {
    let url = basePath;

    // Append the parameter if provided
    if (param) {
      url += `/${param}`;
    }

    // Append the suffix if provided
    if (suffix) {
      url += `/${suffix}`;
    }

    return url;
  }

  /**
   * Navigates to a constructed URL.
   * @param basePath - The base path of the URL (e.g., "portal/accounts").
   * @param param - A single parameter to append (e.g., "123").
   * @param suffix - An optional string to append to the URL (e.g., "edit").
   */
  navigateTo(basePath: string, param?: string | number, suffix?: string): void {
    const segments = [basePath];
    if (param !== undefined) segments.push(String(param));
    if (suffix) segments.push(suffix);

    this.router.navigate(segments);
  }
}
