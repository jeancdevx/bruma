export function mountManifesto(root: HTMLElement) {
  const words = [...root.querySelectorAll<HTMLElement>('[data-word]')];
  const heading = root.querySelector('h2');
  if (!heading || !words.length) return;
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
  let visible = false;
  let pendingFrame: number | undefined;
  let readCount = 0;

  const render = () => {
    pendingFrame = undefined;
    if (reduced.matches) return;
    const rect = heading.getBoundingClientRect();
    const progress = Math.min(1, Math.max(0, (window.innerHeight * .8 - rect.top) / (rect.height + window.innerHeight * .3)));
    readCount = Math.max(readCount, Math.ceil(progress * words.length));
    words.forEach((word, index) => { if (index < readCount) word.setAttribute('data-read', ''); });
  };
  const schedule = () => {
    if (visible && !reduced.matches && pendingFrame === undefined) pendingFrame = requestAnimationFrame(render);
  };
  const configure = () => {
    root.toggleAttribute('data-word-reveal', !reduced.matches);
    if (reduced.matches && pendingFrame !== undefined) { cancelAnimationFrame(pendingFrame); pendingFrame = undefined; }
    if (!reduced.matches) render();
  };
  const observer = new IntersectionObserver(entries => {
    visible = entries.some(entry => entry.isIntersecting);
    if (!reduced.matches) render();
  });
  observer.observe(root);
  window.addEventListener('scroll', schedule, { passive: true });
  window.addEventListener('resize', schedule, { passive: true });
  reduced.addEventListener('change', configure);
  configure();
}
