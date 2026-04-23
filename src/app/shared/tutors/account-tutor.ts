import { driver } from 'driver.js';
import { getElement } from '../helpers/get-element';
import { tutorWaitExistsAndDo } from '../helpers/tutor-wait-exists-and-do';
import { TutorService } from '../services/tutor.service';
import { TutorsSlugsEnum } from '../enums/tutors-slugs.enum';

export const accountTutor = (service: TutorService) => {
  const tutor = driver({
    popoverClass: 'driverjs-theme',
    steps: [
      {
        element: '#accounts-item',
        popover: {
          title: 'Accounts Section',
          description: 'See your customer information in Account.',
          align: 'start',
          showButtons: ['next'],
        },
      },
      {
        element: '#create-account-tutor',
        popover: {
          title: 'Create Account',
          description: 'Create your new customer account',
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
          title: 'Create Account',
          description: 'Create your account',
          align: 'center',
          showButtons: ['next', 'previous'],
          side: 'bottom',
          onPrevClick: () => {
            tutor.destroy();
            const button = getElement('#accounts-item');
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
          title: 'Upload Account Files',
          description:
            'Download Template for Account Upload and then Upload the file.',
          align: 'center',
          side: 'bottom',
        },
      },
      {
        element: '.mat-mdc-tab:nth-child(3)',
        popover: {
          title: 'Accounts Uploaded Table Files',
          description: 'See your accounts uploaded',
          align: 'center',
          side: 'bottom',
          onNextClick: () => {
            service.markAsCompleted(TutorsSlugsEnum.CREATE_ACCOUNT);
            const button = getElement('#accounts-item');
            button.click();
            tutor?.destroy();
          },
        },
      },
    ],
    onDestroyed: () => {
      service.markAsCompleted(TutorsSlugsEnum.CREATE_ACCOUNT);
      const button = getElement('#accounts-item');
      button.click();
      tutor?.destroy();
    },
  });
  return tutor;
};
