import { Component } from '@angular/core';
import { ProductModel } from 'src/business-logic/product/port/models/product.model';
import { ProductPort } from 'src/business-logic/product/port/product.port';
import { HOME_FEATURES, HomeFeatureModel } from './home-content.data';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent {
  plans: ProductModel[] = [];
  features: HomeFeatureModel[] = HOME_FEATURES;

  constructor(private productPort: ProductPort) {
    this.productPort.getProducts().then(products => {
      this.plans = products.concat(products);
      console.log(this.plans);
    });
  }
}
