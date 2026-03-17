document.addEventListener('DOMContentLoaded', function () {
  const menuToggle = document.getElementById('menu-toggle');
  const menu       = document.getElementById('menu');

  if (!menuToggle || !menu) return;

  const menuLinks = menu.querySelectorAll('a');

  /* ── helpers ── */
  function openMenu() {
    menu.classList.add('active');
    menuToggle.classList.replace('fa-bars', 'fa-xmark');
    menuToggle.setAttribute('aria-expanded', 'true');
  }

  function closeMenu() {
    menu.classList.remove('active');
    menuToggle.classList.replace('fa-xmark', 'fa-bars');
    menuToggle.setAttribute('aria-expanded', 'false');
  }

  /* ── toggle on hamburger click ── */
  menuToggle.addEventListener('click', function (e) {
    e.stopPropagation();
    menu.classList.contains('active') ? closeMenu() : openMenu();
  });

  /* ── close when a nav link is clicked ── */
  menuLinks.forEach(function (link) {
    link.addEventListener('click', closeMenu);
  });

  /* ── close when clicking outside ── */
  document.addEventListener('click', function (e) {
    if (!menuToggle.contains(e.target) && !menu.contains(e.target)) {
      closeMenu();
    }
  });

  /* ── close on Escape ── */
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') closeMenu();
  });

  /* ── reset al volver a desktop ── */
  window.matchMedia('(max-width: 768px)').addEventListener('change', function (e) {
    if (!e.matches) closeMenu();
  });
});