export function getElement(
  selector: string,
  parent?: HTMLButtonElement
): HTMLButtonElement {
  return (
    parent ? parent.querySelector(selector) : document.querySelector(selector)
  ) as HTMLButtonElement;
}
