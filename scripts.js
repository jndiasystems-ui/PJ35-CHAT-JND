/* ═══════════════════════════════════════════════════
   JND AI SYSTEMS — scripts.js
═══════════════════════════════════════════════════ */

/* ─── NAVBAR: scroll effect ─── */
const navbar = document.getElementById('navbar');

window.addEventListener('scroll', () => {
  if (window.scrollY > 20) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }
}, { passive: true });

/* ─── NAVBAR: mobile toggle ─── */
const navToggle = document.getElementById('navToggle');
const navLinks  = document.getElementById('navLinks');

navToggle.addEventListener('click', () => {
  const isOpen = navLinks.classList.toggle('open');
  navToggle.setAttribute('aria-expanded', isOpen);
});

// Close menu on link click
navLinks.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    navLinks.classList.remove('open');
    navToggle.setAttribute('aria-expanded', 'false');
  });
});

// Close on outside click
document.addEventListener('click', (e) => {
  if (!navbar.contains(e.target)) {
    navLinks.classList.remove('open');
  }
});

/* ─── SMOOTH SCROLL with offset ─── */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', (e) => {
    if (anchor.hasAttribute('data-modal')) {
      e.preventDefault();
      return;
    }

    const href = anchor.getAttribute('href');
    if (href === '#') { e.preventDefault(); return; }

    const target = document.querySelector(href);
    if (!target) return;

    e.preventDefault();

    const navHeight = parseInt(getComputedStyle(document.documentElement)
      .getPropertyValue('--nav-height'), 10) || 68;

    const top = target.getBoundingClientRect().top + window.scrollY - navHeight - 16;

    window.scrollTo({ top, behavior: 'smooth' });
  });
});

/* ─── TABS ─── */
const tabButtons = document.querySelectorAll('.tab-btn');
const tabContents = document.querySelectorAll('.tab-content');

tabButtons.forEach(btn => {
  btn.addEventListener('click', () => {
    const tab = btn.getAttribute('data-tab');

    tabButtons.forEach(b => b.classList.remove('active'));
    tabContents.forEach(c => c.classList.remove('active'));

    btn.classList.add('active');
    const content = document.getElementById('tab-' + tab);
    if (content) content.classList.add('active');
  });
});

/* ─── SCROLL ANIMATIONS (Intersection Observer) ─── */
const observerOptions = {
  threshold: 0.1,
  rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    }
  });
}, observerOptions);

const animatedSelectors = [
  '.what-card',
  '.benefit-card',
  '.solution-card',
  '.process-step',
  '.audience-card',
  '.diff-item',
  '.trust-item',
  '.section-header',
  '.hero-content',
  '.hero-visual',
  '.cta-content',
];

document.querySelectorAll(animatedSelectors.join(', ')).forEach((el, index) => {
  el.classList.add('fade-in');
  const parent = el.parentElement;
  const siblings = [...parent.children].filter(c => c.classList.contains(el.classList[0]));
  const siblingIndex = siblings.indexOf(el);
  if (siblingIndex > 0) {
    el.style.transitionDelay = `${siblingIndex * 0.08}s`;
  }
  observer.observe(el);
});

/* ─── ACTIVE NAV LINK on scroll ─── */
const sections = document.querySelectorAll('section[id]');
const navItems = document.querySelectorAll('.nav-links a');

function updateActiveNav() {
  const scrollY = window.scrollY + 100;

  sections.forEach(section => {
    const top = section.offsetTop;
    const height = section.offsetHeight;
    const id = section.getAttribute('id');

    if (scrollY >= top && scrollY < top + height) {
      navItems.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === '#' + id) {
          link.classList.add('active');
        }
      });
    }
  });
}

window.addEventListener('scroll', updateActiveNav, { passive: true });


/* ═══════════════════════════════════════════════════
   SISTEMA DE MODALES
═══════════════════════════════════════════════════ */

const Modal = (() => {
  let activeModal = null;

  function open(id) {
    const overlay = document.getElementById('modal-' + id);
    if (!overlay) return;

    if (id === 'calendario') {
      const iframe = document.getElementById('googleCalendarFrame');
      if (iframe && iframe.getAttribute('src') === 'about:blank') {
        const realSrc = iframe.getAttribute('data-src');
        if (realSrc && realSrc !== 'REEMPLAZAR_CON_TU_URL_DE_GOOGLE_CALENDAR') {
          iframe.src = realSrc;
        } else {
          const loading = document.getElementById('calendarLoading');
          if (loading) {
            loading.innerHTML = `
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#00D4FF" stroke-width="1.5"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
              <span style="font-size:0.95rem;color:#A8B8CC;font-weight:600;">Calendario no configurado aún</span>
              <p style="font-size:0.8rem;color:#637082;text-align:center;max-width:320px;line-height:1.6;">
                Para activarlo: crea un <strong style="color:#A8B8CC;">Horario de citas</strong> en Google Calendar,<br/>
                copia el enlace de reserva y pégalo en el <code style="color:#00D4FF;">data-src</code> del iframe en el HTML.<br/><br/>
                Mientras tanto, contáctanos por WhatsApp.
              </p>
              <a href="https://wa.me/573172844982?text=Hola%2C%20quiero%20agendar%20una%20llamada%20de%20diagn%C3%B3stico%20con%20JND%20AI%20SYSTEMS." target="_blank" rel="noopener" class="btn btn-primary" style="margin-top:0.5rem;">
                Agendar por WhatsApp
              </a>
            `;
          }
        }
      }
    }

    if (activeModal && activeModal !== overlay) {
      _close(activeModal);
    }

    overlay.classList.add('active');
    document.body.classList.add('modal-open');
    activeModal = overlay;

    const closeBtn = overlay.querySelector('.modal-close');
    if (closeBtn) closeBtn.focus();
  }

  function _close(overlay) {
    overlay.classList.remove('active');
    document.body.classList.remove('modal-open');
    activeModal = null;
  }

  function close(id) {
    const overlay = id
      ? document.getElementById('modal-' + id)
      : activeModal;
    if (overlay) _close(overlay);
  }

  function closeActive() {
    if (activeModal) _close(activeModal);
  }

  return { open, close, closeActive };
})();

/* ─── Abrir modales desde data-modal ─── */
const WA_NUMBER  = '573172844982';
const WA_MESSAGE = 'Hola%20JND%20AI%20SYSTEMS%2C%20quiero%20agendar%20una%20llamada%20de%20diagn%C3%B3stico%20gratuita.';
const WA_URL     = `https://wa.me/${WA_NUMBER}?text=${WA_MESSAGE}`;

document.addEventListener('click', (e) => {
  const trigger = e.target.closest('[data-modal]');
  if (trigger) {
    e.preventDefault();
    const modalId = trigger.getAttribute('data-modal');
    if (modalId === 'calendario') {
      window.open(WA_URL, '_blank', 'noopener,noreferrer');
      return;
    }
    Modal.open(modalId);
    return;
  }

  const closeBtn = e.target.closest('[data-close]');
  if (closeBtn) {
    Modal.close(closeBtn.getAttribute('data-close'));
    return;
  }

  if (e.target.classList.contains('modal-overlay')) {
    Modal.closeActive();
  }
});

/* ─── Cerrar con Escape ─── */
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') Modal.closeActive();
});


/* ═══════════════════════════════════════════════════
   EMAILJS CONFIG
═══════════════════════════════════════════════════ */

const EMAILJS_PUBLIC_KEY  = 'SpMyfZiXRVcGwjEp-';
const EMAILJS_SERVICE_ID  = 'service_rg5ux97';
const EMAILJS_TEMPLATE_ID = 'template_i3p89vg';

// Inicializar EmailJS
emailjs.init({ publicKey: EMAILJS_PUBLIC_KEY });


/* ═══════════════════════════════════════════════════
   FORMULARIO DE CONTACTO
═══════════════════════════════════════════════════ */

const contactForm     = document.getElementById('contactForm');
const submitBtn       = document.getElementById('submitBtn');
const formSuccess     = document.getElementById('formSuccess');
const formErrorState  = document.getElementById('formErrorState');
const successEmail    = document.getElementById('successEmail');
const btnNewMessage   = document.getElementById('btnNewMessage');
const btnRetry        = document.getElementById('btnRetry');

function validateField(input) {
  const id      = input.id;
  const value   = input.value.trim();
  const errorEl = document.getElementById('error-' + id.replace('cf-', ''));
  let msg       = '';

  if (input.required && !value) {
    msg = 'Este campo es obligatorio.';
  } else if (id === 'cf-email' && value) {
    const emailRgx = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRgx.test(value)) msg = 'Ingresa un correo válido.';
  }

  if (errorEl) errorEl.textContent = msg;
  input.classList.toggle('error', !!msg);
  return !msg;
}

function validateForm() {
  const fields = contactForm.querySelectorAll('input[required], textarea[required]');
  let valid = true;
  fields.forEach(f => { if (!validateField(f)) valid = false; });
  return valid;
}

if (contactForm) {
  contactForm.querySelectorAll('input, textarea').forEach(input => {
    input.addEventListener('blur', () => validateField(input));
    input.addEventListener('input', () => {
      if (input.classList.contains('error')) validateField(input);
    });
  });
}

function showFormState(state) {
  if (!contactForm) return;
  const states = { form: contactForm, success: formSuccess, error: formErrorState };
  Object.values(states).forEach(el => { if (el) el.style.display = 'none'; });
  if (states[state]) states[state].style.display = state === 'form' ? 'flex' : 'flex';
  if (state === 'form') { contactForm.style.display = 'flex'; }
}

if (contactForm) {
  contactForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    const btnText    = submitBtn.querySelector('.btn-text');
    const btnLoading = submitBtn.querySelector('.btn-loading');
    submitBtn.disabled       = true;
    btnText.style.display    = 'none';
    btnLoading.style.display = 'flex';

    const emailValue = document.getElementById('cf-email').value.trim();

    const templateParams = {
      nombre:   document.getElementById('cf-nombre').value.trim(),
      empresa:  document.getElementById('cf-empresa').value.trim() || 'No indicada',
      email:    emailValue,
      telefono: document.getElementById('cf-telefono').value.trim() || 'No indicado',
      interes:  document.getElementById('cf-interes').value || 'No especificado',
      mensaje:  document.getElementById('cf-mensaje').value.trim(),
    };

    try {
      await emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, templateParams);
      if (successEmail) successEmail.textContent = emailValue;
      showFormState('success');
    } catch (err) {
      console.error('[JND] Error EmailJS:', err);
      showFormState('error');
    } finally {
      submitBtn.disabled       = false;
      btnText.style.display    = 'flex';
      btnLoading.style.display = 'none';
    }
  });
}

if (btnNewMessage) {
  btnNewMessage.addEventListener('click', () => {
    contactForm.reset();
    contactForm.querySelectorAll('.error').forEach(el => el.classList.remove('error'));
    contactForm.querySelectorAll('.field-error').forEach(el => el.textContent = '');
    showFormState('form');
  });
}

if (btnRetry) {
  btnRetry.addEventListener('click', () => showFormState('form'));
}


/* ═══════════════════════════════════════════════════
   CHAT WIDGET — JND AI SYSTEMS
═══════════════════════════════════════════════════ */

const N8N_WEBHOOK_URL = 'https://jnd-projects-n8n.ng9sc3.easypanel.host/webhook/5a676e14-2854-4f37-8383-51d166d4813b/chat';

const $ = id => document.getElementById(id);

function chatTimestamp() {
  return new Date().toLocaleTimeString('es-CO', { hour: '2-digit', minute: '2-digit' });
}

function getSessionId() {
  let sid = sessionStorage.getItem('jnd_chat_sid');
  if (!sid) {
    sid = 'jnd_' + Date.now() + '_' + Math.random().toString(36).slice(2, 9);
    sessionStorage.setItem('jnd_chat_sid', sid);
  }
  return sid;
}

const chatState = {
  open:       false,
  waitingBot: false,
  sessionId:  getSessionId(),
};

const chatFab         = $('chatFab');
const chatWindow      = $('chatWindow');
const chatClose       = $('chatClose');
const chatMessages    = $('chatMessages');
const chatInput       = $('chatInput');
const chatSendBtn     = $('chatSendBtn');
const chatBadge       = $('chatBadge');
const chatSuggestions = $('chatSuggestions');

function openChat() {
  chatState.open = true;
  chatWindow.classList.add('open');
  chatWindow.setAttribute('aria-hidden', 'false');
  chatFab.setAttribute('aria-expanded', 'true');
  chatFab.querySelector('.chat-fab-open').style.display = 'none';
  chatFab.querySelector('.chat-fab-close').style.display = 'flex';
  hideBadge();
  chatInput.focus();
  scrollToBottom();
}

function closeChat() {
  chatState.open = false;
  chatWindow.classList.remove('open');
  chatWindow.setAttribute('aria-hidden', 'true');
  chatFab.setAttribute('aria-expanded', 'false');
  chatFab.querySelector('.chat-fab-open').style.display = 'flex';
  chatFab.querySelector('.chat-fab-close').style.display = 'none';
}

function hideBadge() {
  if (chatBadge) chatBadge.classList.add('hidden');
}

chatFab.addEventListener('click', () => chatState.open ? closeChat() : openChat());
chatClose.addEventListener('click', closeChat);

function scrollToBottom() {
  requestAnimationFrame(() => {
    chatMessages.scrollTop = chatMessages.scrollHeight;
  });
}

function renderMessage(role, text, isError = false) {
  const isBot  = role === 'bot';
  const time   = chatTimestamp();

  const msgEl  = document.createElement('div');
  msgEl.className = `chat-msg ${role}${isError ? ' chat-error-msg' : ''}`;

  const avatarEl = document.createElement('div');
  avatarEl.className = 'chat-msg-avatar' + (isBot ? '' : ' user-avatar');

  if (isBot) {
    avatarEl.innerHTML = `<img src="logo.png" alt="JND AI" />`;
  } else {
    avatarEl.innerHTML = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>`;
  }

  const bubbleEl = document.createElement('div');
  bubbleEl.className = 'chat-bubble';
  bubbleEl.innerHTML = text.replace(/\n/g, '<br>');

  msgEl.appendChild(avatarEl);
  msgEl.appendChild(bubbleEl);
  chatMessages.appendChild(msgEl);

  if (isBot) {
    const timeEl = document.createElement('p');
    timeEl.className = 'chat-msg-time';
    timeEl.textContent = time;
    chatMessages.appendChild(timeEl);
  }

  scrollToBottom();
  return msgEl;
}

function showTyping() {
  const typingEl = document.createElement('div');
  typingEl.className = 'chat-typing';
  typingEl.id = 'chatTyping';
  typingEl.innerHTML = `
    <div class="chat-msg-avatar">
      <img src="logo.png" alt="JND AI" />
    </div>
    <div class="typing-bubble">
      <span></span><span></span><span></span>
    </div>`;
  chatMessages.appendChild(typingEl);
  scrollToBottom();
}

function hideTyping() {
  const el = $('chatTyping');
  if (el) el.remove();
}

async function sendToN8n(userMessage) {
  const payload = {
    action:    'sendMessage',
    chatInput: userMessage,
    sessionId: chatState.sessionId,
  };

  const res = await fetch(N8N_WEBHOOK_URL, {
    method:  'POST',
    headers: { 'Content-Type': 'application/json' },
    body:    JSON.stringify(payload),
  });

  if (!res.ok) throw new Error(`HTTP ${res.status}`);

  const data = await res.json();

  if (typeof data === 'string') return { response: data, action: null };
  return {
    response: data.output || data.response || data.message || data.text || 'Recibido.',
    action:   data.action || null,
  };
}

function handleAction(action) {
  if (!action) return;
  if (action === 'open_calendar') {
    setTimeout(() => window.open(WA_URL, '_blank', 'noopener,noreferrer'), 600);
  }
  if (action === 'open_form') {
    setTimeout(() => Modal.open('contacto'), 600);
  }
}

async function handleUserMessage(text) {
  const trimmed = text.trim();
  if (!trimmed || chatState.waitingBot) return;

  if (chatSuggestions) chatSuggestions.classList.add('hidden');

  chatInput.value = '';
  chatInput.style.height = 'auto';
  chatSendBtn.disabled = true;

  renderMessage('user', trimmed);

  chatState.waitingBot = true;
  showTyping();

  try {
    const { response, action } = await sendToN8n(trimmed);
    hideTyping();
    renderMessage('bot', response);
    handleAction(action);
  } catch (err) {
    hideTyping();
    console.error('[JND Chat] Error webhook:', err);
    renderMessage('bot',
      'Ocurrió un error al conectar. Por favor escríbenos directamente por WhatsApp o al correo soporte@jndiasystems.com',
      true
    );
  } finally {
    chatState.waitingBot = false;
  }
}

chatInput.addEventListener('input', () => {
  chatInput.style.height = 'auto';
  chatInput.style.height = Math.min(chatInput.scrollHeight, 100) + 'px';
  chatSendBtn.disabled = !chatInput.value.trim() || chatState.waitingBot;
});

chatInput.addEventListener('keydown', (e) => {
  if (e.key === 'Enter' && !e.shiftKey) {
    e.preventDefault();
    handleUserMessage(chatInput.value);
  }
});

chatSendBtn.addEventListener('click', () => handleUserMessage(chatInput.value));

if (chatSuggestions) {
  chatSuggestions.querySelectorAll('.chat-suggestion-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      handleUserMessage(btn.getAttribute('data-suggestion'));
    });
  });
}

(function initWelcomeMessage() {
  setTimeout(() => {
    renderMessage('bot',
      '¡Hola! 👋 Bienvenido a JND AI SYSTEMS.\n\n¿En qué podemos ayudarte hoy? Puedo orientarte sobre nuestros servicios de automatización o ayudarte a agendar una llamada con nuestro equipo.'
    );
    if (!chatState.open && chatBadge) {
      chatBadge.classList.remove('hidden');
    }
  }, 1800);
})();

/* ═══════════════════════════════════════════════════
   SCROLL ANIMATIONS — Intersection Observer
═══════════════════════════════════════════════════ */
(function initScrollAnimations() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('anim-visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

  const selectors = [
    '.animate-on-scroll',
    '.section-header',
    '.benefit-card',
    '.solution-card',
    '.what-card',
    '.process-step',
    '.audience-card',
    '.diff-item',
    '.caso-card',
    '.testimonio-card',
    '.faq-item',
  ];
  document.querySelectorAll(selectors.join(',')).forEach((el, i) => {
    el.classList.add('animate-on-scroll');
    el.style.transitionDelay = `${(i % 4) * 0.1}s`;
    observer.observe(el);
  });
})();

/* ═══════════════════════════════════════════════════
   CONTADORES ANIMADOS
═══════════════════════════════════════════════════ */
(function initCounters() {
  function animateCount(el, target, suffix, duration) {
    const start = performance.now();
    const isFloat = target % 1 !== 0;
    function update(now) {
      const progress = Math.min((now - start) / duration, 1);
      const ease = 1 - Math.pow(1 - progress, 3);
      const value = isFloat ? (target * ease).toFixed(1) : Math.round(target * ease);
      el.textContent = value + suffix;
      if (progress < 1) requestAnimationFrame(update);
    }
    requestAnimationFrame(update);
  }

  const kpiObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      const raw = el.getAttribute('data-count-target');
      if (!raw) return;
      const suffix = el.getAttribute('data-count-suffix') || '';
      const duration = parseInt(el.getAttribute('data-count-duration') || '1800');
      animateCount(el, parseFloat(raw), suffix, duration);
      kpiObserver.unobserve(el);
    });
  }, { threshold: 0.5 });

  document.querySelectorAll('[data-count-target]').forEach(el => kpiObserver.observe(el));
})();

/* ═══════════════════════════════════════════════════
   HERO PARTICLES — Red neuronal Canvas
═══════════════════════════════════════════════════ */
(function initParticles() {
  const canvas = document.getElementById('heroParticles');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let W, H, particles = [], animId;

  const COUNT        = 75;
  const CONNECT      = 170;
  const MOUSE_RADIUS = 250;
  const MOUSE_FORCE  = 0.12;
  const COLOR        = '0, 212, 255';

  const mouse = { x: null, y: null };
  const heroSection = document.getElementById('hero');
  const mouseTarget  = heroSection || document;

  mouseTarget.addEventListener('mousemove', (e) => {
    const rect = canvas.getBoundingClientRect();
    mouse.x = e.clientX - rect.left;
    mouse.y = e.clientY - rect.top;
  });
  mouseTarget.addEventListener('mouseleave', () => {
    mouse.x = null;
    mouse.y = null;
  });

  function resize() {
    W = canvas.width  = canvas.offsetWidth;
    H = canvas.height = canvas.offsetHeight;
  }

  function Particle() {
    this.x   = Math.random() * W;
    this.y   = Math.random() * H;
    this.vx  = (Math.random() - 0.5) * 0.2;
    this.vy  = (Math.random() - 0.5) * 0.2;
    this.r     = Math.random() * 2.5 + 1.5;
    this.baseR = this.r;
  }

  function init() {
    resize();
    particles = Array.from({ length: COUNT }, () => new Particle());
  }

  function draw() {
    ctx.clearRect(0, 0, W, H);

    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const d  = Math.sqrt(dx * dx + dy * dy);
        if (d < CONNECT) {
          const alpha = (1 - d / CONNECT) * 0.65;
          ctx.beginPath();
          ctx.strokeStyle = `rgba(${COLOR}, ${alpha})`;
          ctx.lineWidth = (1 - d / CONNECT) * 1.2;
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.stroke();
        }
      }
    }

    particles.forEach(p => {
      if (mouse.x !== null) {
        const dx = p.x - mouse.x;
        const dy = p.y - mouse.y;
        const d  = Math.sqrt(dx * dx + dy * dy);
        if (d < MOUSE_RADIUS && d > 0) {
          const force = (1 - d / MOUSE_RADIUS) * MOUSE_FORCE;
          p.vx += (dx / d) * force * MOUSE_RADIUS;
          p.vy += (dy / d) * force * MOUSE_RADIUS;
        }
      }

      const speed = Math.sqrt(p.vx * p.vx + p.vy * p.vy);
      if (speed > 1.2) { p.vx *= 1.2 / speed; p.vy *= 1.2 / speed; }
      p.vx *= 0.98;
      p.vy *= 0.98;
      if (speed < 0.15) {
        p.vx += (Math.random() - 0.5) * 0.06;
        p.vy += (Math.random() - 0.5) * 0.06;
      }

      p.x += p.vx;
      p.y += p.vy;
      if (p.x < 0 || p.x > W) p.vx *= -1;
      if (p.y < 0 || p.y > H) p.vy *= -1;

      ctx.save();
      ctx.shadowColor = `rgba(${COLOR}, 1)`;
      ctx.shadowBlur  = 20;

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r * 3, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${COLOR}, 0.18)`;
      ctx.fill();

      ctx.shadowBlur = 25;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${COLOR}, 1)`;
      ctx.fill();

      ctx.restore();
    });

    if (mouse.x !== null) {
      ctx.save();
      ctx.beginPath();
      ctx.arc(mouse.x, mouse.y, 28, 0, Math.PI * 2);
      ctx.strokeStyle = `rgba(${COLOR}, 0.6)`;
      ctx.lineWidth = 1.5;
      ctx.shadowColor = `rgba(${COLOR}, 1)`;
      ctx.shadowBlur  = 12;
      ctx.stroke();

      ctx.beginPath();
      ctx.arc(mouse.x, mouse.y, 6, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${COLOR}, 0.9)`;
      ctx.shadowBlur = 18;
      ctx.fill();
      ctx.restore();
    }

    animId = requestAnimationFrame(draw);
  }

  const heroEl = document.getElementById('hero');
  const visObs = new IntersectionObserver(([e]) => {
    if (e.isIntersecting) { if (!animId) draw(); }
    else { cancelAnimationFrame(animId); animId = null; }
  });
  if (heroEl) visObs.observe(heroEl);

  window.addEventListener('resize', () => { resize(); particles = Array.from({ length: COUNT }, () => new Particle()); });
  init();
  draw();
})();

/* ═══════════════════════════════════════════════════
   FAQ ACORDEÓN
═══════════════════════════════════════════════════ */
document.querySelectorAll('.faq-question').forEach(btn => {
  btn.addEventListener('click', () => {
    const isOpen = btn.getAttribute('aria-expanded') === 'true';
    document.querySelectorAll('.faq-question').forEach(b => {
      b.setAttribute('aria-expanded', 'false');
      b.nextElementSibling.classList.remove('open');
    });
    if (!isOpen) {
      btn.setAttribute('aria-expanded', 'true');
      btn.nextElementSibling.classList.add('open');
    }
  });
});

/* ═══════════════════════════════════════════════════
   EXIT INTENT POPUP
═══════════════════════════════════════════════════ */
(function initExitIntent() {
  const popup      = document.getElementById('exitIntentPopup');
  const closeBtn   = document.getElementById('exitPopupClose');
  const dismissBtn = document.getElementById('exitPopupDismiss');
  const ctaBtn     = document.getElementById('exitPopupCTA');
  if (!popup) return;

  let shown = false;
  const DELAY_MS  = 8000;
  const startTime = Date.now();

  function show() {
    if (shown) return;
    shown = true;
    popup.classList.add('active');
    document.body.classList.add('modal-open');
  }

  function hide() {
    popup.classList.remove('active');
    document.body.classList.remove('modal-open');
    sessionStorage.setItem('jnd_exit_shown', '1');
  }

  if (sessionStorage.getItem('jnd_exit_shown')) return;

  document.addEventListener('mouseleave', (e) => {
    if (e.clientY <= 0 && (Date.now() - startTime) > DELAY_MS) show();
  });

  let mobileFired = false;
  window.addEventListener('scroll', () => {
    if (mobileFired || shown) return;
    const scrollPct = (window.scrollY + window.innerHeight) / document.body.scrollHeight;
    if (scrollPct > 0.75 && (Date.now() - startTime) > DELAY_MS) {
      mobileFired = true;
      show();
    }
  }, { passive: true });

  closeBtn   && closeBtn.addEventListener('click', hide);
  dismissBtn && dismissBtn.addEventListener('click', hide);
  ctaBtn     && ctaBtn.addEventListener('click', hide);
  popup.addEventListener('click', (e) => { if (e.target === popup) hide(); });
})();

/* ═══════════════════════════════════════════════════
   QUIZ DE DIAGNÓSTICO
═══════════════════════════════════════════════════ */
(function initQuiz() {
  const quizOverlay = document.getElementById('modal-quiz');
  if (!quizOverlay) return;

  const answers  = {};
  let currentStep = 1;
  const TOTAL_STEPS = 4;

  const progressBar     = document.getElementById('quizProgressBar');
  const resultDiv       = document.getElementById('quiz-result');
  const resultText      = document.getElementById('quizResultText');
  const resultHighlight = document.getElementById('quizResultHighlight');

  function updateProgress(step) {
    const pct = (step / TOTAL_STEPS) * 100;
    if (progressBar) progressBar.style.width = pct + '%';
  }

  function goToStep(step) {
    document.querySelectorAll('.quiz-step').forEach(s => s.classList.remove('active'));
    const next = document.getElementById('quiz-step-' + step);
    if (next) next.classList.add('active');
    updateProgress(step);
    currentStep = step;
  }

  function showResult() {
    document.querySelectorAll('.quiz-step').forEach(s => s.classList.remove('active'));
    if (progressBar) progressBar.style.width = '100%';

    const area  = answers[2] || 'tu operación';
    const hours = answers[3] || '';
    const pain  = answers[4] || '';
    const team  = answers[1] || '';

    const hoursMap = {
      'Entre 5 y 15 horas':  'recuperar entre 5 y 15 horas semanales',
      'Entre 15 y 30 horas': 'recuperar más de 15 horas semanales',
      'Más de 30 horas':     'liberar más de 30 horas semanales de trabajo manual',
      'Menos de 5 horas':    'optimizar los procesos clave'
    };
    const saving = hoursMap[hours] || 'optimizar tus procesos';

    if (resultText) {
      resultText.textContent = `Con base en tu perfil (${team}), vemos oportunidades claras en "${area}". La automatización puede ayudarte a ${saving}.`;
    }
    if (resultHighlight) {
      resultHighlight.innerHTML = `
        <strong>Recomendación principal:</strong> Automatización de ${area.toLowerCase()}<br/>
        <strong>Mayor dolor identificado:</strong> ${pain}<br/>
        <strong>Impacto esperado:</strong> ${saving}
      `;
    }
    if (resultDiv) resultDiv.style.display = 'block';
  }

  quizOverlay.addEventListener('transitionend', (e) => {
    if (e.target !== quizOverlay) return;
    if (!quizOverlay.classList.contains('active')) return;
    currentStep = 1;
    Object.keys(answers).forEach(k => delete answers[k]);
    document.querySelectorAll('.quiz-option').forEach(o => o.classList.remove('selected'));
    if (resultDiv) resultDiv.style.display = 'none';
    goToStep(1);
  });

  document.querySelectorAll('.quiz-option').forEach(btn => {
    btn.addEventListener('click', () => {
      const step = parseInt(btn.getAttribute('data-step'));
      const val  = btn.getAttribute('data-value');
      answers[step] = val;

      btn.closest('.quiz-options').querySelectorAll('.quiz-option').forEach(b => b.classList.remove('selected'));
      btn.classList.add('selected');

      setTimeout(() => {
        if (step < TOTAL_STEPS) goToStep(step + 1);
        else showResult();
      }, 350);
    });
  });

  const quizCloseBtn = quizOverlay.querySelector('.modal-close');
  if (quizCloseBtn) {
    quizCloseBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      Modal.close('modal-quiz');
    });
  }

  updateProgress(1);
})();

/* ─── i18n: Inicializar idioma ─── */
if (typeof i18n !== 'undefined') {
  i18n.init();
}
