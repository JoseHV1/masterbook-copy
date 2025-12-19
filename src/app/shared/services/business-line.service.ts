import { Injectable } from '@angular/core';
import { BusinessLineModel } from '../models/business-line';

@Injectable({
  providedIn: 'root',
})
export class BusinessLineService {
  constructor() {}

  getBusinessLine(): BusinessLineModel[] {
    return [
      {
        name: 'ACA',
        description: 'descripcion de ACA',
      },
      {
        name: 'Suplementary',
        description: 'descripcion suplementary',
      },
      {
        name: 'Medicare',
        description: 'descripcion medicare',
      },
    ];
  }
}
