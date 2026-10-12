export function mountNavigation(root: HTMLElement) {
  const toggle = root.querySelector<HTMLButtonElement>('[data-menu-toggle]');
  const dialog = root.querySelector<HTMLDialogElement>('[data-menu-dialog]');
  const close = root.querySelector<HTMLButtonElement>('[data-menu-close]');
  const brand = root.querySelector<HTMLAnchorElement>('[data-brand-link]');
  if (!toggle || !dialog || !close || root.dataset.navReady) return;

  root.dataset.navReady = 'true';
  let previousOverflow = '';

  toggle.addEventListener('click', () => {
    previousOverflow = document.documentElement.style.overflow;
    dialog.showModal();
    toggle.setAttribute('aria-expanded', 'true');
    document.documentElement.style.overflow = 'hidden';
  });
  close.addEventListener('click', () => dialog.close());
  dialog.addEventListener('keydown', event => {
    if (event.key !== 'Tab') return;
    const controls = [...dialog.querySelectorAll<HTMLButtonElement | HTMLAnchorElement>('button, a[href]')];
    const first = controls[0];
    const last = controls[controls.length - 1];
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last?.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first?.focus();
    }
  });
  dialog.querySelectorAll('a').forEach(link => link.addEventListener('click', () => dialog.close()));
  dialog.addEventListener('close', () => {
    document.documentElement.style.overflow = previousOverflow;
    toggle.setAttribute('aria-expanded', 'false');
    (toggle.offsetParent !== null ? toggle : brand)?.focus({ preventScroll: true });
  });
  const desktop = window.matchMedia('(min-width: 768px)');
  desktop.addEventListener('change', () => { if (desktop.matches && dialog.open) dialog.close(); });

  const links = [...root.querySelectorAll<HTMLAnchorElement>('.desktop-nav a')];
  const observer = new IntersectionObserver(entries => {
    const active = entries.find(entry => entry.isIntersecting);
    if (!active) return;
    links.forEach(link => {
      if (link.hash === `#${active.target.id}`) link.setAttribute('aria-current', 'location');
      else link.removeAttribute('aria-current');
    });
  }, { rootMargin: '-20% 0px -65% 0px' });
  links.forEach(link => { const section = document.querySelector(link.hash); if (section) observer.observe(section); });
}
