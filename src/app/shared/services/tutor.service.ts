import { Injectable } from '@angular/core';
import { LocalStorageService } from './local-storage.service';
import { BehaviorSubject, Observable } from 'rxjs';
import { TutorsSlugsEnum } from '../enums/tutors-slugs.enum';

@Injectable({
  providedIn: 'root',
})
export class TutorService {
  private tutors: BehaviorSubject<TutorsSlugsEnum[]>;
  public readonly tutors$: Observable<TutorsSlugsEnum[]>;

  constructor(private _storage: LocalStorageService) {
    const rawTutors = this._storage.getItem('MASTERBOOK_TUTORS');
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
    const newTutors = this.getCompletedTutors();
    newTutors.push(slug);
    this._storage.setItem('MASTERBOOK_TUTORS', newTutors);
    this.tutors.next(newTutors);
  }
}
