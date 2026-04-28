// ── Sticky nav on scroll ──
const header = document.querySelector('header');
if (header) {
  const onScroll = () => header.classList.toggle('scrolled', window.scrollY > 60);
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
}

// ── Mobile nav toggle ──
const hamburger = document.querySelector('.hamburger');
const nav = document.querySelector('nav');
if (hamburger && nav) {
  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('open');
    nav.classList.toggle('open');
    document.body.style.overflow = nav.classList.contains('open') ? 'hidden' : '';
  });
  nav.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('open');
      nav.classList.remove('open');
      document.body.style.overflow = '';
    });
  });
}

// ── Active nav link ──
const page = window.location.pathname.split('/').pop() || 'index.html';
document.querySelectorAll('nav a').forEach(a => {
  if (a.getAttribute('href') === page) a.classList.add('active');
});

// ── Scroll reveal ──
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add('visible');
      revealObserver.unobserve(e.target);
    }
  });
}, { threshold: 0.1 });
document.querySelectorAll('.fade-up').forEach(el => revealObserver.observe(el));

// ── Contact form ──
const form = document.getElementById('contactForm');
if (form) {
  form.addEventListener('submit', e => {
    e.preventDefault();
    const data = new URLSearchParams(new FormData(form)).toString();
    fetch('/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: data
    })
    .then(() => {
      form.style.display = 'none';
      const s = document.querySelector('.form-success');
      if (s) s.style.display = 'block';
    })
    .catch(() => {
      alert('Something went wrong. Please call us at 225.266.1415 or email wediditweddings@gmail.com directly.');
    });
  });
}

// ── Gallery filter ──
const filterBtns = document.querySelectorAll('.filter-btn');
const galleryItems = document.querySelectorAll('.gallery-item');
filterBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    filterBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    const f = btn.dataset.filter;
    galleryItems.forEach(item => {
      item.style.display = (f === 'all' || item.dataset.category === f) ? '' : 'none';
    });
  });
});

// ── Lightbox ──
const lightbox = document.getElementById('lightbox');
const lbImg = document.getElementById('lbImg');
if (lightbox && lbImg) {
  const getVisible = () => [...galleryItems].filter(i => i.style.display !== 'none');

  galleryItems.forEach(item => {
    item.addEventListener('click', () => {
      lbImg.src = item.querySelector('img').src;
      lbImg.alt = item.querySelector('img').alt;
      lightbox.classList.add('active');
      document.body.style.overflow = 'hidden';
    });
  });

  const close = () => {
    lightbox.classList.remove('active');
    document.body.style.overflow = '';
  };

  document.getElementById('lbClose').addEventListener('click', close);
  lightbox.addEventListener('click', e => { if (e.target === lightbox) close(); });

  document.getElementById('lbPrev').addEventListener('click', () => {
    const vis = getVisible();
    const imgs = vis.map(i => i.querySelector('img'));
    const ci = imgs.findIndex(i => i.src === lbImg.src);
    const prev = imgs[(ci - 1 + imgs.length) % imgs.length];
    lbImg.src = prev.src; lbImg.alt = prev.alt;
  });

  document.getElementById('lbNext').addEventListener('click', () => {
    const vis = getVisible();
    const imgs = vis.map(i => i.querySelector('img'));
    const ci = imgs.findIndex(i => i.src === lbImg.src);
    const next = imgs[(ci + 1) % imgs.length];
    lbImg.src = next.src; lbImg.alt = next.alt;
  });

  document.addEventListener('keydown', e => {
    if (!lightbox.classList.contains('active')) return;
    if (e.key === 'Escape') close();
    if (e.key === 'ArrowLeft') document.getElementById('lbPrev').click();
    if (e.key === 'ArrowRight') document.getElementById('lbNext').click();
  });
}
