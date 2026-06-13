import './style.css';

// ===== CURSOR PARTICLE TRAIL (PROGRAMMER STYLE) =====
const canvas = document.getElementById('cursor-canvas');
const ctx = canvas ? canvas.getContext('2d') : null;
let particles = [];
let lastX = 0, lastY = 0;

const codeSymbols = [';', '{}', '</>', '=>', '1', '0', '++', '[]', '()', '&&', '||', '!=', '==='];

function resizeCanvas() {
  if (canvas) {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
}
window.addEventListener('resize', resizeCanvas);
resizeCanvas();

class CodeParticle {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.char = codeSymbols[Math.floor(Math.random() * codeSymbols.length)];
    this.vx = (Math.random() - 0.5) * 1.2;
    this.vy = Math.random() * 0.8 + 0.3; // float downwards
    this.alpha = 1.0;
    this.size = Math.floor(Math.random() * 4) + 12; // 12px to 15px
    // Green or Blue to match brand colors
    this.color = Math.random() > 0.4 ? '#10B981' : '#2563EB';
  }

  update() {
    this.x += this.vx;
    this.y += this.vy;
    this.alpha -= 0.024; // fade rate
  }

  draw() {
    if (!ctx) return;
    ctx.save();
    ctx.globalAlpha = this.alpha;
    ctx.fillStyle = this.color;
    ctx.font = `700 ${this.size}px 'DM Sans', monospace`;
    ctx.shadowBlur = 6;
    ctx.shadowColor = this.color;
    ctx.fillText(this.char, this.x, this.y);
    ctx.restore();
  }
}

// ===== CURSOR CONTROLS =====
const dot = document.getElementById('cursor-dot');
const ring = document.getElementById('cursor-ring');
const cursorText = document.getElementById('cursor-text');
let mx = 0, my = 0, rx = 0, ry = 0;

document.addEventListener('mousemove', e => {
  mx = e.clientX; my = e.clientY;
  dot.style.left = mx + 'px';
  dot.style.top = my + 'px';
  cursorText.style.left = mx + 'px';
  cursorText.style.top = my + 'px';

  // Spawn particle on distance threshold
  const dx = mx - lastX;
  const dy = my - lastY;
  const dist = Math.sqrt(dx*dx + dy*dy);
  if (dist > 8) {
    particles.push(new CodeParticle(mx, my));
    lastX = mx;
    lastY = my;
  }
});

function animateRing() {
  rx += (mx - rx) * 0.12;
  ry += (my - ry) * 0.12;
  ring.style.left = rx + 'px';
  ring.style.top = ry + 'px';

  // Animate canvas particles
  if (ctx) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach(p => {
      p.update();
      p.draw();
    });
    particles = particles.filter(p => p.alpha > 0);
  }

  requestAnimationFrame(animateRing);
}
animateRing();

const cursorLabels = {
  '.btn-primary': 'Konsultasi!',
  '.btn-secondary': 'Lihat Yuk',
  '.pricing-btn': 'Pesan!',
  '.kontak-btn': 'Hubungi!',
  '.service-card': 'Selengkapnya',
  '.faq-q': 'Klik!',
  '.nav-links a': 'Go',
  '.hamburger': 'Menu',
};

document.querySelectorAll('a, button, .service-card, .faq-q, .pricing-card').forEach(el => {
  el.addEventListener('mouseenter', () => {
    document.body.classList.add('hovering');
    const label = Object.entries(cursorLabels).find(([sel]) => el.matches(sel));
    if (label) {
      cursorText.textContent = label[1];
      document.body.classList.add('show-text');
    }
  });
  el.addEventListener('mouseleave', () => {
    document.body.classList.remove('hovering', 'show-text');
  });
});

// ===== NAVBAR SCROLL =====
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 50);
});

// ===== MOBILE NAV =====
const hamburger = document.getElementById('hamburger');
const mobileNav = document.getElementById('mobileNav');
const mobileClose = document.getElementById('mobileClose');

if (hamburger) {
  hamburger.addEventListener('click', () => {
    mobileNav.classList.toggle('open');
    hamburger.classList.toggle('open');
  });
}
if (mobileClose) {
  mobileClose.addEventListener('click', () => {
    mobileNav.classList.remove('open');
    if (hamburger) hamburger.classList.remove('open');
  });
}

window.closeMobileNav = function() {
  if (mobileNav) {
    mobileNav.classList.remove('open');
  }
  if (hamburger) {
    hamburger.classList.remove('open');
  }
};

// ===== FAQ =====
window.toggleFaq = function(item) {
  const isOpen = item.classList.contains('open');
  document.querySelectorAll('.faq-item.open').forEach(i => i.classList.remove('open'));
  if (!isOpen) item.classList.add('open');
};

// ===== SCROLL REVEAL =====
const observer = new IntersectionObserver(entries => {
  entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); });
}, { threshold: 0.12 });

document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-scale').forEach(el => observer.observe(el));

// ===== STAGGER REVEAL =====
const cards = document.querySelectorAll('.service-card, .pricing-card, .faq-item');
cards.forEach((c, i) => { c.style.transitionDelay = (i % 3) * 0.1 + 's'; });

// ===== COUNTER ANIMATION =====
function animateCounters() {
  document.querySelectorAll('.stat-num').forEach(el => {
    const text = el.textContent;
    const num = parseInt(text.replace(/\D/g,''));
    const suffix = text.replace(/[\d]/g,'');
    let start = 0;
    const step = () => {
      start += Math.ceil(num / 40);
      if (start >= num) { el.innerHTML = num + '<span>' + suffix.replace('0','') + '</span>'; return; }
      el.innerHTML = start + '<span>' + suffix.replace('0','') + '</span>';
      requestAnimationFrame(step);
    };
    step();
  });
}

const heroObserver = new IntersectionObserver(entries => {
  entries.forEach(e => { if (e.isIntersecting) { animateCounters(); heroObserver.disconnect(); } });
}, { threshold: 0.5 });

const statsEl = document.querySelector('.hero-stats');
if (statsEl) heroObserver.observe(statsEl);

// ===== TESTIMONIALS WITHOUT NAME TO ANONYMOUS =====
document.querySelectorAll('.testi-card').forEach(card => {
  const authorInfo = card.querySelector('.testi-author-info');
  if (authorInfo) {
    let nameEl = authorInfo.querySelector('h4');
    if (!nameEl) {
      nameEl = document.createElement('h4');
      authorInfo.insertBefore(nameEl, authorInfo.firstChild);
    }
    if (!nameEl.textContent || nameEl.textContent.trim() === '') {
      nameEl.textContent = 'Anonim';
    }
  }
});

