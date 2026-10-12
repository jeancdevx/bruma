/** Content stays visible until an entrance animation actually starts. */
export function observeReveals(root: HTMLElement) {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('is-revealed');
      observer.unobserve(entry.target);
    });
  }, { threshold: .12 });
  root.querySelectorAll('[data-reveal]').forEach(element => observer.observe(element));
}
