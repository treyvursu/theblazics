// Contact form handler. Runs as a Vercel Function at /api/contact.
// Sends the message through Resend to hello@theblazics.com.
// The Resend key lives in the Vercel env var RESEND_API_KEY. Never put it in this repo.

var TO = 'hello@theblazics.com';
var FROM = 'The Blazic Collective <forms@theblazics.com>';
var LIMITS = { name: 100, email: 200, message: 5000 };
var EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function clean(value, max) {
  if (typeof value !== 'string') return '';
  return value.trim().slice(0, max);
}

function oneLine(value) {
  return value.replace(/[\r\n\t]+/g, ' ');
}

function readBody(req) {
  var body = req.body;
  if (!body) return {};
  if (typeof body === 'string') {
    try { return JSON.parse(body); } catch (e) { /* not JSON, try form encoding */ }
    var out = {};
    new URLSearchParams(body).forEach(function (v, k) { out[k] = v; });
    return out;
  }
  if (typeof body === 'object') return body;
  return {};
}

function wantsJson(req) {
  var type = String(req.headers['content-type'] || '');
  var accept = String(req.headers['accept'] || '');
  return type.indexOf('application/json') !== -1 || accept.indexOf('application/json') !== -1;
}

function sameSite(req) {
  var origin = req.headers['origin'];
  if (!origin) return true; // some browsers leave it off for plain form posts
  try {
    return new URL(origin).host === req.headers['host'];
  } catch (e) {
    return false;
  }
}

module.exports = async function handler(req, res) {
  var json = wantsJson(req);

  function ok() {
    if (json) return res.status(200).json({ ok: true });
    return res.redirect(303, '/thank-you');
  }

  function fail(status) {
    if (json) return res.status(status).json({ ok: false });
    return res.redirect(303, '/?error=1#contact');
  }

  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ ok: false });
  }

  if (!sameSite(req)) return fail(403);

  var data = readBody(req);

  // Honeypot. Real visitors never see this field. Bots fill it in.
  // Pretend it worked so they do not retry.
  if (clean(data.company, 200)) return ok();

  var name = oneLine(clean(data.name, LIMITS.name));
  var email = oneLine(clean(data.email, LIMITS.email));
  var message = clean(data.message, LIMITS.message);

  if (!name || !message || !EMAIL_RE.test(email)) return fail(400);

  var key = process.env.RESEND_API_KEY;
  if (!key) {
    console.error('contact: RESEND_API_KEY is not set');
    return fail(500);
  }

  try {
    var response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': 'Bearer ' + key,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        from: FROM,
        to: [TO],
        reply_to: email,
        subject: 'Website message from ' + name,
        text: 'Name: ' + name + '\nEmail: ' + email + '\n\n' + message + '\n'
      })
    });

    if (!response.ok) {
      // Log the status only. Never send Resend's reply to the visitor.
      console.error('contact: Resend returned ' + response.status);
      return fail(502);
    }
  } catch (e) {
    console.error('contact: could not reach Resend');
    return fail(502);
  }

  return ok();
};
