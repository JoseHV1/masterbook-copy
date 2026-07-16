import { driver } from 'driver.js';
import { TranslateService } from '@ngx-translate/core';
import { getElement } from '../helpers/get-element';
import { tutorWaitExistsAndDo } from '../helpers/tutor-wait-exists-and-do';
import { TutorService } from '../services/tutor.service';
import { TutorsSlugsEnum } from '../enums/tutors-slugs.enum';

export const accountTutor = (
  service: TutorService,
  translate: TranslateService
) => {
  const t = (key: string) => translate.instant(key);

  const tutor = driver({
    popoverClass: 'driverjs-theme',
    nextBtnText: t('TUTORS.COMMON.NEXT_BTN'),
    prevBtnText: t('TUTORS.COMMON.PREVIOUS_BTN'),
    doneBtnText: t('TUTORS.COMMON.DONE_BTN'),
    steps: [
      {
        element: '#nav-accounts-item',
        popover: {
          title: t('TUTORS.ACCOUNT.STEP_SECTION_TITLE'),
          description: t('TUTORS.ACCOUNT.STEP_SECTION_DESC'),
          align: 'start',
          showButtons: ['next'],
        },
      },
      {
        element: '#create-account-tutor',
        popover: {
          title: t('TUTORS.ACCOUNT.STEP_CREATE_TITLE'),
          description: t('TUTORS.ACCOUNT.STEP_CREATE_DESC'),
          align: 'start',
          showButtons: ['next'],
          onNextClick: () => {
            const button = getElement('#create-account-tutor');
            button.click();
            tutorWaitExistsAndDo('.mat-mdc-tab:nth-child(1)', () => {
              tutor?.moveNext();
            });
          },
        },
      },
      {
        element: '.mat-mdc-tab:nth-child(1)',
        popover: {
          title: t('TUTORS.ACCOUNT.STEP_CREATE_TITLE'),
          description: t('TUTORS.ACCOUNT.STEP_CREATE_FORM_DESC'),
          align: 'center',
          showButtons: ['next', 'previous'],
          side: 'bottom',
          onPrevClick: () => {
            tutor.destroy();
            const button = getElement('#nav-accounts-item');
            button.click();
            setTimeout(() => {
              tutor?.movePrevious();
              tutor.drive(1);
            }, 100);
          },
        },
      },
      {
        element: '.mat-mdc-tab:nth-child(2)',
        popover: {
          title: t('TUTORS.ACCOUNT.STEP_UPLOAD_TITLE'),
          description: t('TUTORS.ACCOUNT.STEP_UPLOAD_DESC'),
          align: 'center',
          side: 'bottom',
        },
      },
      {
        element: '.mat-mdc-tab:nth-child(3)',
        popover: {
          title: t('TUTORS.ACCOUNT.STEP_TABLE_TITLE'),
          description: t('TUTORS.ACCOUNT.STEP_TABLE_DESC'),
          align: 'center',
          side: 'bottom',
          onNextClick: () => {
            const button = getElement('#nav-accounts-item');
            button.click();
            tutor?.destroy();
          },
        },
      },
    ],
    onDestroyed: () => {
      if (!service.isCompleted(TutorsSlugsEnum.CREATE_ACCOUNT)) {
        service.markAsCompleted(TutorsSlugsEnum.CREATE_ACCOUNT);
      }
      const button = getElement('#nav-accounts-item');
      button.click();
      tutor?.destroy();
    },
  });
  return tutor;
};
