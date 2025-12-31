import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, map, take } from 'rxjs';
import { TutorsSlugsEnum } from '../enums/tutors-slugs.enum';
import { AuthService } from './auth.service';
import { HttpClient } from '@angular/common/http';
import { ApiResponseModel } from '../interfaces/models/api-response.model';
import { UserModel } from '../interfaces/models/user.model';
import { environment } from '@env/environment';

@Injectable({
  providedIn: 'root',
})
export class TutorService {
  private tutors: BehaviorSubject<TutorsSlugsEnum[]>;
  public readonly tutors$: Observable<TutorsSlugsEnum[]>;

  constructor(private _auth: AuthService, private _http: HttpClient) {
    const rawTutors = this._auth.getAuth()?.user?.complete_tutors ?? [];
    this.tutors = new BehaviorSubject<TutorsSlugsEnum[]>(
      (rawTutors as TutorsSlugsEnum[]) ?? []
    );
    this.tutors$ = this.tutors.asObservable();
  }

  getCompletedTutors(): TutorsSlugsEnum[] {
    return this.tutors.getValue();
  }

  isCompleted(slug: TutorsSlugsEnum): boolean {
    return this.getCompletedTutors().includes(slug);
  }

  markAsCompleted(slug: TutorsSlugsEnum): void {
    const currentTutors = this.getCompletedTutors();
    currentTutors.push(slug);
    this._updateTutors(currentTutors)
      .pipe(take(1))
      .subscribe(() => this.tutors.next(currentTutors));
  }

  private _updateTutors(complete_tutors: TutorsSlugsEnum[]) {
    return this._http
      .patch<ApiResponseModel<UserModel>>(
        `${environment.apiUrl}auth/update-tutor`,
        {
          complete_tutors,
        }
      )
      .pipe(map(resp => resp.data));
  }
}
