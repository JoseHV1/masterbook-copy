import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler } from '@angular/common/http';
import { RegionService } from '../services/region.service';

@Injectable()
export class RegionInterceptor implements HttpInterceptor {
  constructor(private regionService: RegionService) {}

  intercept(req: HttpRequest<unknown>, next: HttpHandler) {
    const regionReq = req.clone({
      setHeaders: { 'X-Region': this.regionService.getRegion() },
    });
    return next.handle(regionReq);
  }
}
