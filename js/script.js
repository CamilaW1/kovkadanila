const priceRates = {
      canopy: { rate: 22000, min: 38000 },
      bars: { rate: 14500, min: 18000 },
      railings: { rate: 15500, min: 24000 },
      gazebo: { rate: 32000, min: 90000 }
    };

    const product = document.getElementById('product');
    const width = document.getElementById('width');
    const length = document.getElementById('length');
    const complexity = document.getElementById('complexity');
    const price = document.getElementById('price');

    function formatRub(value) {
      return new Intl.NumberFormat('ru-RU', { maximumFractionDigits: 0 }).format(Math.round(value / 1000) * 1000) + ' ₽';
    }

    function calculate() {
      const key = product.value;
      const w = Math.max(0.5, Number(width.value) || 0.5);
      const l = Math.max(0.5, Number(length.value) || 0.5);
      const factor = Number(complexity.value);
      const area = w * l;
      const config = priceRates[key];
      const base = Math.max(config.min, area * config.rate * factor);
      const low = base * 0.92;
      const high = base * 1.12;
      price.textContent = formatRub(low) + ' – ' + formatRub(high);
    }

    [product, width, length, complexity].forEach(el => el.addEventListener('input', calculate));
    calculate();

    const modal = document.getElementById('orderModal');
    const closeModal = document.getElementById('closeModal');
    document.querySelectorAll('[data-open-order]').forEach(btn => btn.addEventListener('click', () => {
      modal.classList.add('open');
      document.body.style.overflow = 'hidden';
    }));

    function closeOrderModal() {
      modal.classList.remove('open');
      document.body.style.overflow = '';
    }
    closeModal.addEventListener('click', closeOrderModal);
    modal.addEventListener('click', e => { if (e.target === modal) closeOrderModal(); });
    document.addEventListener('keydown', e => { if (e.key === 'Escape') closeOrderModal(); });

    const orderForm = document.getElementById('orderForm');
    const emailInput = document.getElementById('email');
    const phoneInput = document.getElementById('phone');
    const contactError = document.getElementById('contactError');
    const estimatedPrice = document.getElementById('estimatedPrice');

    function validateContact() {
      const hasEmail = emailInput.value.trim() !== '';
      const hasPhone = phoneInput.value.trim() !== '';
      const valid = hasEmail || hasPhone;
      contactError.style.display = valid ? 'none' : 'block';
      return valid;
    }

    emailInput.addEventListener('input', validateContact);
    phoneInput.addEventListener('input', validateContact);

    orderForm.addEventListener('submit', e => {
      if (!validateContact()) {
        e.preventDefault();
        (emailInput.value.trim() === '' ? emailInput : phoneInput).focus();
        return;
      }
      estimatedPrice.value = price.textContent;
    });

    document.getElementById('year').textContent = new Date().getFullYear();

// Portfolio filters
const portfolioFilters = document.querySelectorAll('.portfolio-filter');
const portfolioItems = Array.from(document.querySelectorAll('.portfolio-item'));
const portfolioCollage = document.getElementById('portfolioAllCollage');
let activePortfolioFilter = 'all';

function applyPortfolioFilter(filter) {
  activePortfolioFilter = filter;

  if (portfolioCollage) {
    portfolioCollage.hidden = filter !== 'all';
  }

  portfolioItems.forEach(item => {
    item.hidden = filter === 'all' || item.dataset.category !== filter;
  });
}

portfolioFilters.forEach(button => {
  button.addEventListener('click', () => {
    portfolioFilters.forEach(item => item.classList.remove('active'));
    button.classList.add('active');
    applyPortfolioFilter(button.dataset.filter);
  });
});

applyPortfolioFilter('all');

// Portfolio lightbox
const lightbox = document.getElementById('lightbox');
const lightboxImage = document.getElementById('lightboxImage');
const lightboxClose = document.getElementById('lightboxClose');
const lightboxPrev = document.getElementById('lightboxPrev');
const lightboxNext = document.getElementById('lightboxNext');

let currentPortfolioIndex = 0;
let lightboxItems = [];
let touchStartX = null;

function showPortfolioImage(index) {
  if (!lightboxItems.length) return;

  currentPortfolioIndex = (index + lightboxItems.length) % lightboxItems.length;
  const item = lightboxItems[currentPortfolioIndex];
  const img = item.querySelector('img');

  lightboxImage.src = item.dataset.image;
  lightboxImage.alt = img?.alt || 'Работа Ковка Данила';
}

function openPortfolioLightbox(items, index = 0) {
  if (!items.length) return;

  lightboxItems = items;
  currentPortfolioIndex = index;
  showPortfolioImage(currentPortfolioIndex);
  lightbox.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeLightbox() {
  lightbox.classList.remove('open');
  lightboxImage.src = '';
  lightboxItems = [];
  document.body.style.overflow = '';
}

if (portfolioCollage) {
  portfolioCollage.addEventListener('click', () => {
    openPortfolioLightbox(portfolioItems, 0);
  });
}

portfolioItems.forEach(item => {
  item.addEventListener('click', () => {
    const categoryItems = portfolioItems.filter(
      portfolioItem => portfolioItem.dataset.category === item.dataset.category
    );
    openPortfolioLightbox(categoryItems, categoryItems.indexOf(item));
  });
});

lightboxClose.addEventListener('click', closeLightbox);
lightboxPrev.addEventListener('click', () => showPortfolioImage(currentPortfolioIndex - 1));
lightboxNext.addEventListener('click', () => showPortfolioImage(currentPortfolioIndex + 1));

lightbox.addEventListener('click', event => {
  if (event.target === lightbox) closeLightbox();
});

lightbox.addEventListener('touchstart', event => {
  touchStartX = event.changedTouches[0]?.clientX ?? null;
}, { passive: true });

lightbox.addEventListener('touchend', event => {
  if (touchStartX === null || !lightbox.classList.contains('open')) return;

  const touchEndX = event.changedTouches[0]?.clientX ?? touchStartX;
  const distance = touchEndX - touchStartX;

  if (Math.abs(distance) > 45) {
    showPortfolioImage(currentPortfolioIndex + (distance < 0 ? 1 : -1));
  }

  touchStartX = null;
}, { passive: true });

document.addEventListener('keydown', event => {
  if (!lightbox.classList.contains('open')) return;
  if (event.key === 'Escape') closeLightbox();
  if (event.key === 'ArrowLeft') showPortfolioImage(currentPortfolioIndex - 1);
  if (event.key === 'ArrowRight') showPortfolioImage(currentPortfolioIndex + 1);
});


// Adaptive mobile navigation
const menuToggle = document.getElementById('menuToggle');
const mobileMenu = document.getElementById('mobileMenu');

function closeMobileMenu() {
  if (!menuToggle || !mobileMenu) return;
  mobileMenu.classList.remove('open');
  menuToggle.classList.remove('open');
  menuToggle.setAttribute('aria-expanded', 'false');
  menuToggle.setAttribute('aria-label', 'Открыть меню');
}

if (menuToggle && mobileMenu) {
  menuToggle.addEventListener('click', () => {
    const isOpen = mobileMenu.classList.toggle('open');
    menuToggle.classList.toggle('open', isOpen);
    menuToggle.setAttribute('aria-expanded', String(isOpen));
    menuToggle.setAttribute('aria-label', isOpen ? 'Закрыть меню' : 'Открыть меню');
  });

  mobileMenu.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', closeMobileMenu);
  });

  window.addEventListener('resize', () => {
    if (window.innerWidth > 980) {
      closeMobileMenu();
    }
  });

  document.addEventListener('keydown', event => {
    if (event.key === 'Escape') {
      closeMobileMenu();
    }
  });
}


// Hero automatic slideshow
const heroPhotoCard = document.querySelector('.hero-photo-card');
const firstHeroPhoto = heroPhotoCard?.querySelector('.hero-photo');

if (heroPhotoCard && firstHeroPhoto) {
  const heroImages = [
    {
      src: firstHeroPhoto.getAttribute('src'),
      alt: firstHeroPhoto.getAttribute('alt') || 'Кованые изделия — работа Ковка Данила'
    },
    {
      src: 'photos/01-canopies/garden-canopy.jpg',
      alt: 'Кованый навес во дворе — работа Ковка Данила'
    },
    {
      src: 'photos/05-railings/porch-railing.jpg',
      alt: 'Кованые перила — работа Ковка Данила'
    },
    {
      src: 'photos/01-canopies/canopy-01.jpg',
      alt: 'Кованый навес зимой — работа Ковка Данила'
    },
    {
      src: 'photos/03-gates/gate-03.jpg',
      alt: 'Кованые ворота — работа Ковка Данила'
    },
    {
      src: 'photos/04-fences/ornamental-fence.jpg',
      alt: 'Кованое ограждение — работа Ковка Данила'
    }
  ];

  const heroSliderStyle = document.createElement('style');
  heroSliderStyle.textContent = `
    .hero-photo-card .hero-slide {
      position: absolute;
      inset: 0;
      width: 100%;
      height: 100%;
      object-fit: cover;
      opacity: 0;
      transition: opacity .9s ease;
      z-index: 0;
      will-change: opacity;
    }

    .hero-photo-card .hero-slide.is-active {
      opacity: 1;
    }

    .hero-photo-card::after {
      z-index: 1;
    }

    .hero-photo-card .forge-label {
      z-index: 2;
    }
  `;
  document.head.appendChild(heroSliderStyle);

  firstHeroPhoto.classList.add('hero-slide', 'is-active');

  heroImages.slice(1).forEach(imageData => {
    const image = document.createElement('img');
    image.src = imageData.src;
    image.alt = imageData.alt;
    image.className = 'hero-photo hero-slide';
    image.decoding = 'async';
    heroPhotoCard.insertBefore(image, heroPhotoCard.querySelector('.forge-label'));
  });

  const heroSlides = Array.from(heroPhotoCard.querySelectorAll('.hero-slide'));
  let currentHeroSlide = 0;

  function showHeroSlide(index) {
    heroSlides[currentHeroSlide].classList.remove('is-active');
    currentHeroSlide = index;
    heroSlides[currentHeroSlide].classList.add('is-active');
  }

  if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    setInterval(() => {
      showHeroSlide((currentHeroSlide + 1) % heroSlides.length);
    }, 5000);
  }
}
