import { driver } from 'driver.js';
import { getElement } from '../helpers/get-element';
import { tutorWaitExistsAndDo } from '../helpers/tutor-wait-exists-and-do';
import { TutorService } from '../services/tutor.service';
import { TutorsSlugsEnum } from '../enums/tutors-slugs.enum';

export const requestTutor = (service: TutorService) => {
  const tutor = driver({
    popoverClass: 'driverjs-theme',
    steps: [
      {
        element: '#create-request-button',
        popover: {
          title: 'Create a new request',
          description:
            'Create Customer Request for Insurance or see what your customer has created in their portal.',
          align: 'start',
          showButtons: ['next'],
        },
      },
      {
        element: '#status-request-table',
        popover: {
          title: 'Request Status',
          description:
            'Review the Request for Doicuments and Application required',
          align: 'start',
          onNextClick: () => {
            const button = getElement('.request-id:nth-child(1)');
            button.click();
            tutorWaitExistsAndDo('#request-file-upload', () => {
              tutor?.moveNext();
            });
          },
        },
      },
      {
        element: '#request-file-upload',
        popover: {
          title: 'Upload Quote Button',
          description: 'Upolad Quotes',
          align: 'start',
          showButtons: ['next'],
          onNextClick: () => {
            service.markAsCompleted(TutorsSlugsEnum.CREATE_REQUEST);
            tutor?.destroy();
          },
        },
      },
    ],
    onDestroyed: () => {
      service.markAsCompleted(TutorsSlugsEnum.CREATE_REQUEST);
      tutor?.destroy();
    },
  });

  return tutor;
};
