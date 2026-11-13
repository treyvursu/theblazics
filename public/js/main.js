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

    // Contact form. The form posts to /api/contact and works with JavaScript off.
    // With JavaScript on, send it in the background and show any error in place.
    var ERROR_TEXT = 'Sorry, that did not send. Please try again or email hello@theblazics.com.';
    var showError = function (form) {
      var status = form.querySelector('.form__status');
      if (!status) return;
      status.classList.add('is-error');
      status.textContent = ERROR_TEXT;
    };
    var forms = document.querySelectorAll('form[action="/api/contact"]');

    // Came back from a failed send with JavaScript off the first time
    if (/[?&]error=1/.test(window.location.search)) {
      forms.forEach(showError);
    }

    forms.forEach(function (form) {
      if (!window.fetch || !window.FormData) return;
      form.addEventListener('submit', function (e) {
        e.preventDefault();
        var button = form.querySelector('button[type="submit"]');
        var status = form.querySelector('.form__status');
        var label = button ? button.textContent : '';
        var data = new FormData(form);
        var payload = {};
        data.forEach(function (value, key) { payload[key] = value; });

        if (button) { button.disabled = true; button.textContent = 'Sending'; }
        if (status) { status.classList.remove('is-error'); status.textContent = ''; }

        fetch('/api/contact', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
          body: JSON.stringify(payload)
        })
          .then(function (res) { return res.json().then(function (body) { return res.ok && body && body.ok; }); })
          .then(function (sent) {
            if (!sent) throw new Error('not sent');
            window.location.href = '/thank-you';
          })
          .catch(function () {
            if (button) { button.disabled = false; button.textContent = label; }
            showError(form);
          });
      });
    });
  })();
})();
