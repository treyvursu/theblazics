// The Blazic Collective — small site behaviours (no dependencies)
(function () {
  // Loaded with defer, so the DOM is ready when this runs.
  (function () {
    // Sticky header hairline after scrolling
    var header = document.querySelector('.site-header');
    var onScroll = function () {
      if (header) header.classList.toggle('is-scrolled', window.scrollY > 8);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });

    // Mobile menu
    var toggle = document.querySelector('.nav__toggle');
    var menu = document.getElementById('mobile-menu');
    if (toggle && menu) {
      toggle.addEventListener('click', function () {
        var open = menu.classList.toggle('is-open');
        toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
        toggle.querySelector('.icon-open').style.display = open ? 'none' : '';
        toggle.querySelector('.icon-close').style.display = open ? '' : 'none';
      });
      menu.querySelectorAll('a').forEach(function (a) {
        a.addEventListener('click', function () {
          menu.classList.remove('is-open');
          toggle.setAttribute('aria-expanded', 'false');
          toggle.querySelector('.icon-open').style.display = '';
          toggle.querySelector('.icon-close').style.display = 'none';
        });
      });
    }

    // Reveal on scroll
    var items = document.querySelectorAll('.reveal');
    if ('IntersectionObserver' in window) {
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-in');
            io.unobserve(entry.target);
          }
        });
      }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
      items.forEach(function (el) { io.observe(el); });
    } else {
      items.forEach(function (el) { el.classList.add('is-in'); });
    }

    // Marquee: duplicate the track so the loop is seamless
    document.querySelectorAll('.marquee__track').forEach(function (track) {
      track.innerHTML += track.innerHTML;
      Array.prototype.slice.call(track.children, track.children.length / 2)
        .forEach(function (el) { el.setAttribute('aria-hidden', 'true'); });
    });

    // Year in footer
    document.querySelectorAll('[data-year]').forEach(function (el) {
      el.textContent = new Date().getFullYear();
    });

    // Contact form: opens the visitor's email app until a form service is connected.
    // To use a form service (Formspree, Netlify Forms, etc.), set the form's
    // action attribute and delete data-mailto.
    document.querySelectorAll('form[data-mailto]').forEach(function (form) {
      form.addEventListener('submit', function (e) {
        e.preventDefault();
        var data = new FormData(form);
        var subject = 'Order request: ' + (data.get('line') || 'General');
        var body = [
          'Name: ' + (data.get('name') || ''),
          'Email: ' + (data.get('email') || ''),
          'Line: ' + (data.get('line') || ''),
          'Date needed: ' + (data.get('date') || ''),
          '',
          data.get('message') || ''
        ].join('\n');
        window.location.href = 'mailto:' + form.getAttribute('data-mailto') +
          '?subject=' + encodeURIComponent(subject) + '&body=' + encodeURIComponent(body);
        var status = form.querySelector('.form__status');
        if (status) status.textContent = 'Your email app should open with the request filled in.';
      });
    });
  })();
})();
