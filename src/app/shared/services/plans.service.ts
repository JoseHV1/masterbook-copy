import { Injectable } from '@angular/core';
import { ProductModel } from '../models/product.model';

@Injectable({
  providedIn: 'root',
})
export class PlansService {
  constructor() {}

  getPlans(): ProductModel[] {
    return [
      {
        crmPermits: [
          {
            id: 'holas',
            name: 'holas',
            status: 'holas',
          },
        ],
        description: 'plan',
        id: 'jk12',
        idStripe: 'jkas123',
        name: 'plan uno',
        quantity: 10,
        status: 'Active',
        timeQuantity: 60,
        timeType: 'mucho',
        type: 'plan',
      },
      {
        crmPermits: [
          {
            id: 'holas2',
            name: 'holas2',
            status: 'hola2',
          },
        ],
        description: 'plan dos',
        id: 'jas1',
        idStripe: 'kja1',
        name: 'plan dos',
        quantity: 20,
        status: 'Active',
        timeQuantity: 90,
        timeType: 'poco',
        type: 'plan',
      },
    ];
  }
}
