/** Still-image adaptation of scroll-world: native scroll, cached geometry, one rAF per update. */
export function mountScrollStory(root: HTMLElement) {
  const steps = [...root.querySelectorAll<HTMLElement>('[data-story-step]')];
  const visual = root.querySelector<HTMLElement>('[data-story-frames]');
  const progressBar = root.querySelector<HTMLElement>('[data-stage-progress]');
  const route = [...root.querySelectorAll<HTMLAnchorElement>('[data-route-index]')];
  if (!visual || !steps.length || root.dataset.storyReady) return;
  root.dataset.storyReady = 'true';

  const frames = steps.map(step => {
    const original = step.querySelector<HTMLElement>('[data-scene-image]');
    const frame = original?.cloneNode(true) as HTMLElement | undefined;
    if (!frame) return null;
    frame.classList.add('visual-frame');
    frame.removeAttribute('data-scene-image');
    frame.setAttribute('aria-hidden', 'true');
    frame.querySelector('figcaption')?.remove();
    frame.querySelector('img')?.setAttribute('alt', '');
    visual.append(frame);
    return frame;
  });
  frames[0]?.style.setProperty('opacity', '1');

  const desktop = window.matchMedia('(min-width: 1024px)');
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
  let centers: number[] = [];
  let viewportHeight = window.innerHeight;
  let pendingFrame: number | undefined;
  let enabled = false;

  const render = () => {
    pendingFrame = undefined;
    if (!enabled || !centers.length) return;
    const point = window.scrollY + viewportHeight / 2;
    let position = 0;
    for (let index = 0; index < centers.length - 1; index++) {
      if (point >= centers[index]!) {
        const distance = centers[index + 1]! - centers[index]!;
        position = index + Math.min(1, Math.max(0, (point - centers[index]!) / distance));
      }
    }
    const whole = Math.floor(position);
    const blend = Math.min(1, Math.max(0, (position - whole - .35) / .3));
    const visualPosition = whole + blend;
    const active = Math.round(visualPosition);
    frames.forEach((frame, index) => {
      if (!frame) return;
      const distance = position - index;
      frame.style.opacity = String(Math.max(0, 1 - Math.abs(visualPosition - index)));
      frame.style.transform = `translateY(${distance * -16}px) scale(${1 + Math.min(1, Math.max(-1, distance)) * .035})`;
    });
    root.dataset.storyActive = String(active);
    visual.setAttribute('aria-label', steps[active]?.dataset.sceneLabel ?? 'El mundo de Bruma');
    route.forEach((link, index) => {
      if (index === active) link.setAttribute('aria-current', 'step');
      else link.removeAttribute('aria-current');
    });
    progressBar?.style.setProperty('transform', `scaleX(${(position + 1) / steps.length})`);
  };

  const schedule = () => {
    if (enabled && pendingFrame === undefined) pendingFrame = window.requestAnimationFrame(render);
  };
  const measure = () => {
    viewportHeight = window.innerHeight;
    centers = steps.map(step => {
      const rect = step.getBoundingClientRect();
      return window.scrollY + rect.top + rect.height / 2;
    });
    schedule();
  };
  const configure = () => {
    enabled = desktop.matches && !reduced.matches;
    root.toggleAttribute('data-enhanced', enabled);
    if (!enabled && pendingFrame !== undefined) {
      window.cancelAnimationFrame(pendingFrame);
      pendingFrame = undefined;
    }
    measure();
  };

  window.addEventListener('scroll', schedule, { passive: true });
  window.addEventListener('resize', measure, { passive: true });
  desktop.addEventListener('change', configure);
  reduced.addEventListener('change', configure);
  const observer = new ResizeObserver(measure);
  observer.observe(root);
  document.fonts.ready.then(measure);
  configure();
}
