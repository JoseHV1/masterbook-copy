import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-default-empty-state',
  templateUrl: './default-empty-state.component.html',
  styleUrls: ['./default-empty-state.component.scss'],
})
export class DefaultEmptyStateComponent {
  @Input() url!: string;
  @Input() customText?: string | null = null;

  constructor(private _router: Router) {}

  navigate(): void {
    this._router.navigateByUrl(this.url ?? '');
  }
}
