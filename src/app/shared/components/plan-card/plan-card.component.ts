import { Component, Input } from '@angular/core';
import { ProductModel } from 'src/business-logic/product/port/models/product.model';

@Component({
  selector: 'app-plan-card',
  templateUrl: './plan-card.component.html',
  styleUrls: ['./plan-card.component.scss'],
})
export class PlanCardComponent {
  @Input() plan!: ProductModel;
  @Input() color?: string = '#049DD9';
}
