export function centerScrollTo(selector: string) {
  document.querySelector(selector)?.scrollIntoView({
    behavior: 'smooth',
    block: 'center',
  });
}
