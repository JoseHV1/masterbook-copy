import { Component } from '@angular/core';
import {
  HOME_CLIENT_FEATURES,
  HomeClientFeatureModel,
} from './home-client-content.data';

@Component({
  selector: 'app-home-client',
  templateUrl: './home-client.component.html',
  styleUrls: ['./home-client.component.scss'],
})
export class HomeClientComponent {
  features: HomeClientFeatureModel[] = HOME_CLIENT_FEATURES;
}
