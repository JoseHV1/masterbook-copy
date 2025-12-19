import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ProductModel } from '../../models/product.model';

@Component({
  selector: 'app-plan-card',
  templateUrl: './plan-card.component.html',
  styleUrls: ['./plan-card.component.scss'],
})
export class PlanCardComponent {
  @Input() plan!: ProductModel;
  @Input() color?: string = '#049DD9';
  @Input() colorButton?: string;
  @Input() textButton?: string = 'Read more';
  @Output() selectPlan: EventEmitter<ProductModel> =
    new EventEmitter<ProductModel>();
}
