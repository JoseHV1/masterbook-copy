import { Alignment, driver, DriveStep } from 'driver.js';
import { getElement } from '../helpers/get-element';
import { tutorWaitExistsAndDo } from '../helpers/tutor-wait-exists-and-do';
import { TutorService } from '../services/tutor.service';
import { TutorsSlugsEnum } from '../enums/tutors-slugs.enum';
import { RolesEnum } from '../enums/roles.enum';
import { brokerRolesDataset } from '../datatsets/roles.datasets';

export const requestTutor = (
  service: TutorService,
  userRole: RolesEnum,
  hasRequests: boolean
) => {
  const isBroker = brokerRolesDataset.includes(userRole);

  const stepBroker: DriveStep = {
    element: '#create-request-button',
    popover: {
      title: 'Create a new request',
      description:
        'Create Customer Request for Insurance or see what your customer has created in their portal.',
      align: 'start',
      showButtons: ['next'],
    },
  };

  const steps: DriveStep[] = [
    {
      element: '#status-request-table',
      popover: {
        title: 'Request Status',
        description:
          'Review the Request for Documents and Application required',
        align: 'start' as const,
        onNextClick: () => {
          const button = getElement('.request-id:nth-child(1)');
          button.click();
          tutorWaitExistsAndDo('#request-personal-info-details', () => {
            setTimeout(() => {
              tutor?.moveNext();
            }, 0);
          });
        },
      },
    },
    {
      element: '#request-personal-info-details',
      popover: {
        title: 'Personal Information',
        description: 'Personal Information details',
        align: 'start',
        showButtons: ['next'],
      },
    },
    {
      element: '#request-info-template',
      popover: {
        title: 'Request Information',
        description: 'Request Information details',
        align: 'start',
        showButtons: ['next', 'previous'],
      },
    },
    {
      element: '#request-quotes-info',
      popover: {
        title: 'Available Quotes',
        description: 'Available Quotes Details',
        align: 'start',
        showButtons: ['next', 'previous'],
      },
    },
  ];

  const stepsFiltered = [];
  if (isBroker) stepsFiltered.push(stepBroker);
  if (hasRequests) stepsFiltered.push(...steps);

  const tutor = driver({
    popoverClass: 'driverjs-theme',
    steps: stepsFiltered,
    onDestroyed: () => {
      !service.isCompleted(TutorsSlugsEnum.CREATE_REQUEST) &&
        service.markAsCompleted(TutorsSlugsEnum.CREATE_REQUEST);
      tutor?.destroy();
    },
  });

  return tutor;
};
