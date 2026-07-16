import { driver, DriveStep } from 'driver.js';
import { TranslateService } from '@ngx-translate/core';
import { getElement } from '../helpers/get-element';
import { tutorWaitExistsAndDo } from '../helpers/tutor-wait-exists-and-do';
import { TutorService } from '../services/tutor.service';
import { TutorsSlugsEnum } from '../enums/tutors-slugs.enum';
import { RolesEnum } from '../enums/roles.enum';
import { brokerRolesDataset } from '../datatsets/roles.datasets';

export const requestTutor = (
  service: TutorService,
  userRole: RolesEnum,
  hasRequests: boolean,
  translate: TranslateService
) => {
  const t = (key: string) => translate.instant(key);
  const isBroker = brokerRolesDataset.includes(userRole);

  const stepBroker: DriveStep = {
    element: '#create-request-button',
    popover: {
      title: t('TUTORS.REQUEST.STEP_CREATE_TITLE'),
      description: t('TUTORS.REQUEST.STEP_CREATE_DESC'),
      align: 'start',
      showButtons: ['next'],
    },
  };

  const steps: DriveStep[] = [
    {
      element: '#status-request-table',
      popover: {
        title: t('TUTORS.REQUEST.STEP_STATUS_TITLE'),
        description: t('TUTORS.REQUEST.STEP_STATUS_DESC'),
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
        title: t('TUTORS.REQUEST.STEP_PERSONAL_INFO_TITLE'),
        description: t('TUTORS.REQUEST.STEP_PERSONAL_INFO_DESC'),
        align: 'start',
        showButtons: ['next'],
      },
    },
    {
      element: '#request-info-template',
      popover: {
        title: t('TUTORS.REQUEST.STEP_INFO_TITLE'),
        description: t('TUTORS.REQUEST.STEP_INFO_DESC'),
        align: 'start',
        showButtons: ['next', 'previous'],
      },
    },
    {
      element: '#request-quotes-info',
      popover: {
        title: t('TUTORS.REQUEST.STEP_QUOTES_TITLE'),
        description: t('TUTORS.REQUEST.STEP_QUOTES_DESC'),
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
    nextBtnText: t('TUTORS.COMMON.NEXT_BTN'),
    prevBtnText: t('TUTORS.COMMON.PREVIOUS_BTN'),
    doneBtnText: t('TUTORS.COMMON.DONE_BTN'),
    steps: stepsFiltered,
    onDestroyed: () => {
      !service.isCompleted(TutorsSlugsEnum.CREATE_REQUEST) &&
        service.markAsCompleted(TutorsSlugsEnum.CREATE_REQUEST);
      tutor?.destroy();
    },
  });

  return tutor;
};
