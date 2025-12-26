import { getElement } from './get-element';

export function tutorWaitExistsAndDo(selector: string, fn: () => void): void {
  getElement('.driver-popover-next-btn').disabled = true;
  getElement('.driver-popover-prev-btn').disabled = true;

  const interval = setInterval(() => {
    const element = getElement(selector);

    if (element) {
      clearInterval(interval);
      fn();
    }
  }, 50);
}
