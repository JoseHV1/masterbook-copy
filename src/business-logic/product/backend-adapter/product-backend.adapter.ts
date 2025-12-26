import { Injectable } from '@angular/core';
import { ProductPort } from '../port/product.port';
import { HttpClient } from '@angular/common/http';
import { ProductModel } from '../port/models/product.model';
import { ProductBackendEntity } from './entities/product-backend.entity';
import { firstValueFrom, map } from 'rxjs';
import { ProductBackendDTO } from './DTO/product-backend.dto';
import { ResponseModel } from 'src/business-logic/base/response.model';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ProductBackendAdapter extends ProductPort {
  constructor(private httpClient: HttpClient) {
    super();
  }

  getProducts(type: string = 'plan'): Promise<ProductModel[]> {
    return firstValueFrom(
      this.httpClient
        .get<ResponseModel<ProductBackendEntity[]>>(
          environment.apiUrl + 'products?type=' + type
        )
        .pipe(
          map(resp =>
            resp.data.map(product => ProductBackendDTO.toDomain(product))
          )
        )
    );
  }
}
