/* ============================================================
   ZAMZAM CAFE & SHISHA LOUNGE
   JavaScript — Navigation, Animations, Form Validation + WA Redirect
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {
  'use strict';

  
  // =========================
  // SANITY CMS CONNECTION
  // =========================
  async function loadSanityContent() {
    try {
      const projectId = 'tly2hu5w';
      const dataset = 'production';
      const apiVersion = '2025-01-01';

      const query = encodeURIComponent(
        `*[_type == "siteSettings"][0]`
      );

      const url =
        `https://${projectId}.api.sanity.io/v${apiVersion}/data/query/${dataset}?query=${query}`;

      const response = await fetch(url);

      if (!response.ok) {
        throw new Error(`Sanity API error: ${response.status}`);
      }

      const data = await response.json();
      const settings = data.result;

      if (!settings) {
        console.warn('Konten Sanity belum tersedia.');
        return;
      }

      // HERO LABEL
      const heroLabel = document.querySelector('.hero-content .label');

      if (heroLabel && settings.heroLabel) {
        heroLabel.textContent = settings.heroLabel;
      }

      console.log('Sanity CMS berhasil terhubung!', settings);

    } catch (error) {
      console.error('Gagal mengambil data Sanity:', error);
    }
  }

  loadSanityContent();


  /* =========================
     ELEMENTS
     ========================= */
  const navbar = document.querySelector('.navbar');
  const hamburger = document.querySelector('.nav-hamburger');
  const mobileMenu = document.querySelector('.mobile-menu');
  const navLinks = document.querySelectorAll('.nav-links a');
  const mobileLinks = document.querySelectorAll('.mobile-menu a');
  const allNavLinks = [...navLinks, ...mobileLinks];
  const sections = document.querySelectorAll('section[id]');
  const revealElements = document.querySelectorAll('.reveal');
  const yearEl = document.getElementById('current-year');
  const form = document.getElementById('reservation-form');
  const formSuccess = document.querySelector('.form-success');

  /* =========================
     MOBILE NAVIGATION
     ========================= */
  function toggleMobileMenu() {
    const isOpen = mobileMenu.classList.toggle('active');
    hamburger.classList.toggle('active', isOpen);
    hamburger.setAttribute('aria-expanded', String(isOpen));
    document.body.style.overflow = isOpen ? 'hidden' : '';
  }

  function closeMobileMenu() {
    hamburger.classList.remove('active');
    mobileMenu.classList.remove('active');
    hamburger.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  }

  hamburger.addEventListener('click', toggleMobileMenu);

  mobileLinks.forEach(link => {
    link.addEventListener('click', () => {
      closeMobileMenu();
    });
  });

  // Close mobile menu on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && mobileMenu.classList.contains('active')) {
      closeMobileMenu();
    }
  });

  /* =========================
     STICKY NAVBAR ON SCROLL
     ========================= */
  let lastScrollY = 0;

  function handleNavScroll() {
    const scrollY = window.scrollY;

    if (scrollY > 80) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }

    lastScrollY = scrollY;
  }

  window.addEventListener('scroll', handleNavScroll, { passive: true });

  /* =========================
     SMOOTH SCROLLING
     ========================= */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const targetId = anchor.getAttribute('href');
      if (targetId === '#') return;

      const targetElement = document.querySelector(targetId);
      if (!targetElement) return;

      e.preventDefault();

      const navbarHeight = navbar.offsetHeight;
      const targetPosition = targetElement.getBoundingClientRect().top + window.scrollY - navbarHeight;

      window.scrollTo({
        top: targetPosition,
        behavior: 'smooth'
      });
    });
  });

  /* =========================
     ACTIVE NAVIGATION STATE
     ========================= */
  function updateActiveNav() {
    const scrollY = window.scrollY + 200;

    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;
      const sectionId = section.getAttribute('id');

      if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
        allNavLinks.forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === '#' + sectionId) {
            link.classList.add('active');
          }
        });
      }
    });
  }

  window.addEventListener('scroll', updateActiveNav, { passive: true });

  /* =========================
     SCROLL REVEAL (IntersectionObserver)
     ========================= */
  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          revealObserver.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.12,
      rootMargin: '0px 0px -40px 0px'
    }
  );

  revealElements.forEach(el => revealObserver.observe(el));

  /* =========================
     DYNAMIC YEAR
     ========================= */
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }

  /* =========================
     RESERVATION FORM VALIDATION + WA REDIRECT
     ========================= */
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();

      // Reset previous errors
      form.querySelectorAll('.form-group').forEach(group => {
        group.classList.remove('error');
      });

      let isValid = true;

      // Validate name
      const nameInput = form.querySelector('#res-name');
      if (!nameInput.value.trim()) {
        showError(nameInput, 'Silakan masukkan nama Anda.');
        isValid = false;
      }

      // Validate date
      const dateInput = form.querySelector('#res-date');
      if (!dateInput.value) {
        showError(dateInput, 'Silakan pilih tanggal.');
        isValid = false;
      } else {
        const selectedDate = new Date(dateInput.value);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        if (selectedDate < today) {
          showError(dateInput, 'Tanggal tidak boleh di masa lalu.');
          isValid = false;
        }
      }

      // Validate time
      const timeInput = form.querySelector('#res-time');
      if (!timeInput.value) {
        showError(timeInput, 'Silakan pilih waktu.');
        isValid = false;
      }

      // Validate guests
      const guestsInput = form.querySelector('#res-guests');
      if (!guestsInput.value) {
        showError(guestsInput, 'Silakan pilih jumlah tamu.');
        isValid = false;
      }

      if (!isValid) return;

      // --- BUILD WHATSAPP MESSAGE ---
      const nameVal = nameInput.value.trim();
      const dateVal = dateInput.value;
      const timeVal = timeInput.value;
      const guestsVal = guestsInput.value;
      const notesVal = form.querySelector('#res-notes').value.trim();

      // Format date: 2026-04-28 -> Selasa, 28 April 2026
      const dateObj = new Date(dateVal + 'T00:00:00');
      const formattedDate = dateObj.toLocaleDateString('id-ID', {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
        year: 'numeric'
      });

      const formattedTime = timeVal.replace(':', '.') + ' WIB';

      let message =
        `Halo Zamzam Cafe & Shisha Lounge, saya ingin *Reservasi Meja Makan*:\n\n` +
        `👤 Nama: ${nameVal}\n` +
        `📅 Tanggal: ${formattedDate}\n` +
        `⏰ Waktu: ${formattedTime}\n` +
        `👥 Jumlah Tamu: ${guestsVal} orang`;

      if (notesVal) {
        message += `\n📝 Permintaan Khusus: ${notesVal}`;
      }

      message += `\n\nMohon konfirmasinya, terima kasih!`;

      const waNumber = window.zamzamWhatsApp || '6287822665674';
      const waUrl = `https://wa.me/${waNumber}?text=${encodeURIComponent(message)}`;

      // Redirect ke WA - user tinggal kirim
      window.open(waUrl, '_blank', 'noopener');
    });
  }

  /* =========================
     TENNIS COURT RESERVATION FORM
     ========================= */
  const tennisForm = document.getElementById('tennis-reservation-form');
  if (tennisForm) {
    tennisForm.addEventListener('submit', (e) => {
      e.preventDefault();

      // Reset previous errors
      tennisForm.querySelectorAll('.form-group').forEach(group => {
        group.classList.remove('error');
      });

      let isValid = true;

      // Validate name
      const nameInput = tennisForm.querySelector('#tennis-name');
      if (!nameInput.value.trim()) {
        showError(nameInput, 'Silakan masukkan nama Anda.');
        isValid = false;
      }

      // Validate date
      const dateInput = tennisForm.querySelector('#tennis-date');
      if (!dateInput.value) {
        showError(dateInput, 'Silakan pilih tanggal.');
        isValid = false;
      } else {
        const selectedDate = new Date(dateInput.value);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        if (selectedDate < today) {
          showError(dateInput, 'Tanggal tidak boleh di masa lalu.');
          isValid = false;
        }
      }

      // Validate time
      const timeInput = tennisForm.querySelector('#tennis-time');
      if (!timeInput.value) {
        showError(timeInput, 'Silakan pilih waktu.');
        isValid = false;
      }

      // Validate players
      const playersInput = tennisForm.querySelector('#tennis-players');
      if (!playersInput.value) {
        showError(playersInput, 'Silakan pilih jumlah pemain.');
        isValid = false;
      }

      if (!isValid) return;

      // --- BUILD WHATSAPP MESSAGE ---
      const nameVal = nameInput.value.trim();
      const dateVal = dateInput.value;
      const timeVal = timeInput.value;
      const playersVal = playersInput.value;
      const notesVal = tennisForm.querySelector('#tennis-notes').value.trim();

      // Format date: 2026-04-28 -> Selasa, 28 April 2026
      const dateObj = new Date(dateVal + 'T00:00:00');
      const formattedDate = dateObj.toLocaleDateString('id-ID', {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
        year: 'numeric'
      });

      const formattedTime = timeVal.replace(':', '.') + ' WIB';

      let message =
        `Halo Zamzam Cafe & Shisha Lounge, saya ingin *Reservasi Lapangan Tennis*:\n\n` +
        `👤 Nama: ${nameVal}\n` +
        `📅 Tanggal: ${formattedDate}\n` +
        `⏰ Waktu: ${formattedTime}\n` +
        `👥 Jumlah Pemain: ${playersVal} orang`;

      if (notesVal) {
        message += `\n📝 Permintaan Khusus: ${notesVal}`;
      }

      message += `\n\nMohon konfirmasinya, terima kasih!`;

      const waNumber = '6287822665674';
      const waUrl = `https://wa.me/${waNumber}?text=${encodeURIComponent(message)}`;

      // Redirect ke WA - user tinggal kirim
      window.open(waUrl, '_blank', 'noopener');
    });
  }

  function showError(input, message) {
    const group = input.closest('.form-group');
    if (group) {
      group.classList.add('error');
      const errorEl = group.querySelector('.form-error');
      if (errorEl) {
        errorEl.textContent = message;
      }
    }
  }

  /* =========================
     SET MINIMUM DATE FOR RESERVATION
     ========================= */
  const resDateInput = document.querySelector('#res-date');
  if (resDateInput) {
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const dd = String(today.getDate()).padStart(2, '0');
    resDateInput.setAttribute('min', `${yyyy}-${mm}-${dd}`);
  }

  const tennisDateInput = document.querySelector('#tennis-date');
  if (tennisDateInput) {
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const dd = String(today.getDate()).padStart(2, '0');
    tennisDateInput.setAttribute('min', `${yyyy}-${mm}-${dd}`);
  }

  /* =========================
     MODAL CONTROLS
     ========================= */
  const modalTable = document.getElementById('modal-table');
  const modalTennis = document.getElementById('modal-tennis');
  const openTableBtns = document.querySelectorAll('.js-open-table, a[href="#reservasi"]');
  const openTennisBtns = document.querySelectorAll('.js-open-tennis');
  const closeBtns = document.querySelectorAll('.js-close-modal');

  function openModal(modal) {
    if (!modal) return;
    modal.classList.add('active');
    modal.setAttribute('aria-hidden', 'false');
    document.body.classList.add('modal-open');
  }

  function closeModal(modal) {
    if (!modal) return;
    modal.classList.remove('active');
    modal.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('modal-open');
  }

  function closeAllModals() {
    [modalTable, modalTennis].forEach(modal => {
      if (modal && modal.classList.contains('active')) {
        closeModal(modal);
      }
    });
  }

  openTableBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      // Allow scroll behavior for navbar link if desired, or open modal directly
      e.preventDefault();
      openModal(modalTable);
    });
  });

  openTennisBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      openModal(modalTennis);
    });
  });

  closeBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      closeAllModals();
    });
  });

  /* =========================
     MENU DETAIL MODAL
     ========================= */
  const menuDetailModal = document.getElementById('menu-detail-modal');
  const menuItems = document.querySelectorAll('.menu-item, .menu-list-item');
  const menuDetailImage = document.getElementById('menu-detail-image');
  const menuDetailCategory = document.getElementById('menu-detail-category');
  const menuDetailTitle = document.getElementById('menu-detail-title');
  const menuDetailDescription = document.getElementById('menu-detail-description');
  const menuDetailPrice = document.getElementById('menu-detail-price');

  function openMenuDetail(item) {
    if (!menuDetailModal) return;

    const image = item.querySelector('img');
    const title = item.querySelector('.menu-item-name, .menu-list-content h3');
    const description = item.querySelector('.menu-item-desc, .menu-list-content p');
    const price = item.querySelector('.menu-item-price, .menu-list-item > span');
    const category = item.querySelector('.menu-item-category') ||
      item.closest('.menu-category')?.querySelector('.menu-category-heading .label');

    if (!image || !title || !description || !price) {
      console.error('Detail menu tidak lengkap.', item);
      return;
    }

    menuDetailImage.src = image.src;
    menuDetailImage.alt = image.alt;
    menuDetailCategory.textContent = category ? category.textContent : 'Menu Zamzam';
    menuDetailTitle.textContent = title.textContent;
    menuDetailDescription.textContent = description.textContent;
    menuDetailPrice.textContent = price.textContent;
    menuDetailModal.classList.add('active');
    menuDetailModal.setAttribute('aria-hidden', 'false');
    document.body.classList.add('modal-open');
  }

  function closeMenuDetail() {
    if (!menuDetailModal) return;
    menuDetailModal.classList.remove('active');
    menuDetailModal.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('modal-open');
  }

  menuItems.forEach(item => {
    item.addEventListener('click', () => openMenuDetail(item));
    item.addEventListener('keydown', (event) => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        openMenuDetail(item);
      }
    });
  });

  document.querySelectorAll('.js-close-menu-detail').forEach(button => {
    button.addEventListener('click', closeMenuDetail);
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeAllModals();
      closeMenuDetail();
    }
  });

  /* =========================
     INITIAL STATES
     ========================= */
  handleNavScroll();
  updateActiveNav();
});


/* ==========================================
   SANITY CMS - ZAMZAM WEBSITE CONTENT
   ========================================== */

document.addEventListener('DOMContentLoaded', async () => {
  const PROJECT_ID = 'tly2hu5w';
  const DATASET = 'production';
  const API_VERSION = '2025-01-01';

  const query = `*[_type == "siteSettings"][0]{
    siteName,
    heroLabel,
    heroHeading,
    heroDescription,
    heroImage{
      asset->{url}
    },
    heroServices,
    openingHours,
    whatsappNumber,
    email,
    instagram,
    facebook,
    address,
    googleMapsUrl
  }`;

  const endpoint =
    `https://${PROJECT_ID}.api.sanity.io/v${API_VERSION}/data/query/${DATASET}?query=${encodeURIComponent(query)}`;

  try {
    const response = await fetch(endpoint);

    if (!response.ok) {
      throw new Error(`Sanity API error: ${response.status}`);
    }

    const result = await response.json();
    const data = result.result;

    if (!data) {
      console.warn('Data siteSettings belum tersedia.');
      return;
    }

    console.log('Sanity CMS berhasil terhubung!', data);

    // Helper untuk mengubah teks dengan aman
    const setText = (selector, value) => {
      const element = document.querySelector(selector);
      if (element && value) {
        element.textContent = value;
      }
    };

    // SITE NAME
    if (data.siteName) {
      document.title = `${data.siteName} — Modern Arabian Luxury`;

      const nameParts = data.siteName.split(' ');
      setText('.nav-brand-name', nameParts.shift().toUpperCase());
      setText('.nav-brand-sub', nameParts.join(' '));

      setText('.footer-brand-name', data.siteName.split(' ')[0].toUpperCase());
      setText('.footer-brand-sub', data.siteName.split(' ').slice(1).join(' '));
    }

    // HERO SECTION
    setText('.hero-content .label', data.heroLabel);
    setText('.hero-desc', data.heroDescription);
    setText('.hero-services', data.heroServices);
    setText('.hero-hours', data.openingHours);

    // Judul hero: pertahankan baris baru dan highlight
    const heroHeading = document.querySelector('.hero-heading');

    if (heroHeading && data.heroHeading) {
      const escapeHTML = (text) =>
        text.replace(/[&<>"']/g, char => ({
          '&': '&amp;',
          '<': '&lt;',
          '>': '&gt;',
          '"': '&quot;',
          "'": '&#039;'
        })[char]);

      const heading = escapeHTML(data.heroHeading);

      heroHeading.innerHTML = heading
        .replace(/Sebuah Momen\./g, '<span class="highlight">Sebuah Momen.</span>')
        .replace(/\n/g, '<br>');
    }

    // HERO IMAGE
    if (data.heroImage?.asset?.url) {
      const heroImage = document.querySelector('.hero-bg img');

      if (heroImage) {
        heroImage.src = data.heroImage.asset.url;
      }
    }

    // OPENING HOURS DI FOOTER
    if (data.openingHours) {
      const footerHours = document.querySelector('.footer-hours');

      if (footerHours) {
        const strong = footerHours.querySelector('strong');

        footerHours.textContent = data.openingHours;

        if (strong) {
          footerHours.prepend(strong);
        }
      }
    }

    // LOCATION
    if (data.address) {
      const addressElement = document.querySelector('.location-details p');

      if (addressElement) {
        addressElement.textContent = data.address;
      }
    }

    if (data.googleMapsUrl) {
      const mapsButton = document.querySelector('.location-button');

      if (mapsButton) {
        mapsButton.href = data.googleMapsUrl;
      }
    }

    // CONTACT
    if (data.email) {
      const emailLink = document.querySelector('.footer-col a[href^="mailto:"]');

      if (emailLink) {
        emailLink.href = `mailto:${data.email}`;
        emailLink.textContent = data.email;
      }
    }

    // SOCIAL MEDIA
    if (data.instagram) {
      const instagramLink = document.querySelector(
        '.footer-col a[aria-label="Instagram Zamzam"]'
      );

      if (instagramLink) {
        instagramLink.href = data.instagram;
        instagramLink.target = '_blank';
        instagramLink.rel = 'noopener noreferrer';
      }
    }

    if (data.facebook) {
      const facebookLink = document.querySelector(
        '.footer-col a[aria-label="Facebook Zamzam"]'
      );

      if (facebookLink) {
        facebookLink.href = data.facebook;
        facebookLink.target = '_blank';
        facebookLink.rel = 'noopener noreferrer';
      }
    }

    // NOMOR WHATSAPP RESERVASI
    if (data.whatsappNumber) {
      window.zamzamWhatsApp = data.whatsappNumber.replace(/\D/g, '');
    }

  } catch (error) {
    console.error('Gagal mengambil data Sanity:', error);
  }
});


// ==========================================
// SANITY CMS - ABOUT SECTION
// ==========================================

async function loadAboutSection() {
    const PROJECT_ID = 'tly2hu5w';
    const DATASET = 'production';
    const API_VERSION = '2025-01-01';

    const query = `*[_type == "aboutSection"][0]{
        label,
        heading,
        description,
        image{
            asset->{
                url
            }
        },
        estYear,
        estText
    }`;

    const endpoint =
        `https://${PROJECT_ID}.api.sanity.io/v${API_VERSION}/data/query/${DATASET}?query=${encodeURIComponent(query)}`;

    try {
        const response = await fetch(endpoint);

        if (!response.ok) {
            throw new Error(`Sanity API Error: ${response.status}`);
        }

        const result = await response.json();
        const data = result.result;

        if (!data) {
            console.warn('Data About Section belum tersedia di Sanity.');
            return;
        }

        console.log('About Section berhasil dimuat:', data);

        // Mengubah teks
        const setText = (selector, value) => {
            const element = document.querySelector(selector);

            if (element && value) {
                element.textContent = value;
            }
        };

        setText('.about-content .label', data.label);
        setText('.about-content .section-desc', data.description);
        setText('.about-est-year', data.estYear ? `EST. ${data.estYear}` : '');
        setText('.about-est-text', data.estText);

        // Mengubah judul
        const heading = document.querySelector(
            '.about-content .section-heading'
        );

        if (heading && data.heading) {
            const escapeHTML = (text) => text.replace(/[&<>"']/g, char => ({
                '&': '&amp;',
                '<': '&lt;',
                '>': '&gt;',
                '"': '&quot;',
                "'": '&#039;'
            })[char]);

            heading.innerHTML = escapeHTML(data.heading)
                .replace(/\n/g, '<br>');
        }

        // Mengubah gambar
        const aboutImage = document.querySelector('.about-image img');

        if (aboutImage && data.image?.asset?.url) {
            aboutImage.src = data.image.asset.url;
            aboutImage.alt = data.heading || 'Tentang Zamzam';
        }

    } catch (error) {
        console.error('Gagal memuat About Section:', error);
    }
}

// Jalankan ketika halaman siap
loadAboutSection();


 // ==========================================
 // SANITY CMS - TENNIS COURT SECTION
 // ==========================================

async function loadTennisSection() {
    const PROJECT_ID = 'tly2hu5w';
    const DATASET = 'production';
    const API_VERSION = '2025-01-01';

    const query = `*[_type == "tennisSection"][0]{
        label,
        heading,
        description,
        image{
            asset->{
                url
            }
        },
        facilities[]{
            label,
            value
        }
    }`;

    const endpoint =
        `https://${PROJECT_ID}.api.sanity.io/v${API_VERSION}/data/query/${DATASET}?query=${encodeURIComponent(query)}`;

    try {
        const response = await fetch(endpoint);

        if (!response.ok) {
            throw new Error(`Sanity API Error: ${response.status}`);
        }

        const result = await response.json();
        const data = result.result;

        if (!data) {
            console.warn('Data Tennis Court belum tersedia di Sanity.');
            return;
        }

        console.log('Tennis Court berhasil dimuat:', data);

        // Mengubah teks
        const setText = (selector, value) => {
            const element = document.querySelector(selector);

            if (element && value) {
                element.textContent = value;
            }
        };

        setText('.tennis-content .label', data.label);
        setText('.tennis-content .section-desc', data.description);

        // Mengubah judul
        const heading = document.querySelector(
            '.tennis-content .section-heading'
        );

        if (heading && data.heading) {
            const escapeHTML = (text) => text.replace(/[&<>"']/g, char => ({
                '&': '&amp;',
                '<': '&lt;',
                '>': '&gt;',
                '"': '&quot;',
                "'": '&#039;'
            })[char]);

            heading.innerHTML = escapeHTML(data.heading)
                .replace(/\n/g, '<br>');
        }

        // Mengubah gambar
        const tennisImage = document.querySelector('.tennis-image img');

        if (tennisImage && data.image?.asset?.url) {
            tennisImage.src = data.image.asset.url;
            tennisImage.alt = data.heading || 'Tennis Court Zamzam';
        }

        // Mengubah informasi Tennis Court
        const infoContainer = document.querySelector('.tennis-info');

        if (infoContainer && Array.isArray(data.facilities)) {
            const template = infoContainer.querySelector('.tennis-info-item');

            if (template) {
                infoContainer.innerHTML = '';

                data.facilities.forEach((facility) => {
                    const item = template.cloneNode(true);
                    const children = item.children;

                    // Anak pertama = label
                    // Anak kedua = value
                    if (children[0]) {
                        children[0].textContent = facility.label || '';
                    }

                    if (children[1]) {
                        children[1].textContent = facility.value || '';
                    }

                    infoContainer.appendChild(item);
                });
            } else {
                console.warn(
                    'Template .tennis-info-item tidak ditemukan.'
                );
            }
        }

    } catch (error) {
        console.error('Gagal memuat Tennis Court:', error);
    }
}

// Jalankan fungsi
loadTennisSection();


// ==========================================
// SANITY CMS - LOUNGE & FACILITIES
// ==========================================

async function loadLoungeSection() {
    const PROJECT_ID = 'tly2hu5w';
    const DATASET = 'production';
    const API_VERSION = '2025-01-01';

    const query = `*[_type == "loungeSection"][0]{
        label,
        heading,
        description,
        image{
            asset->{
                url
            }
        },
        facilities[]{
            name,
            description
        }
    }`;

    const endpoint =
        `https://${PROJECT_ID}.api.sanity.io/v${API_VERSION}/data/query/${DATASET}?query=${encodeURIComponent(query)}`;

    try {
        const response = await fetch(endpoint);

        if (!response.ok) {
            throw new Error(`Sanity API Error: ${response.status}`);
        }

        const result = await response.json();
        const data = result.result;

        if (!data) {
            console.warn('Data Lounge belum tersedia di Sanity.');
            return;
        }

        console.log('Lounge & Facilities berhasil dimuat:', data);

        // Helper untuk mengubah teks
        const setText = (selector, value) => {
            const element = document.querySelector(selector);

            if (element && value) {
                element.textContent = value;
            }
        };

        // Label
        setText('.lounge-hero-overlay .label', data.label);

        // Judul
        const heading = document.querySelector(
            '.lounge-hero-overlay .section-heading'
        );

        if (heading && data.heading) {
            const escapeHTML = (text) => text.replace(/[&<>"']/g, char => ({
                '&': '&amp;',
                '<': '&lt;',
                '>': '&gt;',
                '"': '&quot;',
                "'": '&#039;'
            })[char]);

            heading.innerHTML = escapeHTML(data.heading)
                .replace(/\n/g, '<br>');
        }

        // Deskripsi
        setText(
            '.lounge-hero-overlay .section-desc',
            data.description
        );

        // Gambar utama Lounge
        const loungeImage = document.querySelector('.lounge-hero img');

        if (loungeImage && data.image?.asset?.url) {
            loungeImage.src = data.image.asset.url;
            loungeImage.alt = data.heading || 'Lounge Zamzam';
        }

        // Daftar fasilitas
        const facilitiesContainer = document.querySelector(
            '.lounge-facilities'
        );

        if (facilitiesContainer && Array.isArray(data.facilities)) {
            const template = facilitiesContainer.querySelector(
                '.lounge-facility'
            );

            if (template) {
                facilitiesContainer.innerHTML = '';

                data.facilities.forEach((facility) => {
                    const item = template.cloneNode(true);

                    const nameElement = item.querySelector(
                        '.lounge-facility-name'
                    );

                    const descElement = item.querySelector(
                        '.lounge-facility-desc'
                    );

                    if (nameElement) {
                        nameElement.textContent = facility.name || '';
                    }

                    if (descElement) {
                        descElement.textContent =
                            facility.description || '';
                    }

                    facilitiesContainer.appendChild(item);
                });
            } else {
                console.warn(
                    'Template .lounge-facility tidak ditemukan.'
                );
            }
        }

    } catch (error) {
        console.error(
            'Gagal memuat Lounge & Facilities:',
            error
        );
    }
}

// Jalankan fungsi
loadLoungeSection();
// ==========================================
// SANITY CMS - RESERVATION SECTION
// ==========================================

async function loadReservationSection() {
    const PROJECT_ID = 'tly2hu5w';
    const DATASET = 'production';
    const API_VERSION = '2025-01-01';

    const query = `*[_type == "reservationSection"][0]{
        label,
        heading,
        description,
        note
    }`;

    const endpoint =
        `https://${PROJECT_ID}.api.sanity.io/v${API_VERSION}/data/query/${DATASET}?query=${encodeURIComponent(query)}`;

    try {
        const response = await fetch(endpoint);

        if (!response.ok) {
            throw new Error(`Sanity API Error: ${response.status}`);
        }

        const result = await response.json();
        const data = result.result;

        if (!data) {
            console.warn('Data Reservation belum tersedia di Sanity.');
            return;
        }

        console.log('Reservation berhasil dimuat:', data);

        const setText = (selector, value) => {
            const element = document.querySelector(selector);

            if (element && value) {
                element.textContent = value;
            }
        };

        // Label
        setText('.reservation-content .label', data.label);

        // Deskripsi
        setText(
            '.reservation-content .section-desc',
            data.description
        );

        // Catatan
        setText('.reservation-note', data.note);

        // Judul
        const heading = document.querySelector(
            '.reservation-content .section-heading'
        );

        if (heading && data.heading) {
            const escapeHTML = (text) => text.replace(/[&<>"']/g, char => ({
                '&': '&amp;',
                '<': '&lt;',
                '>': '&gt;',
                '"': '&quot;',
                "'": '&#039;'
            })[char]);

            heading.innerHTML = escapeHTML(data.heading)
                .replace(/\n/g, '<br>');
        }

    } catch (error) {
        console.error('Gagal memuat Reservation:', error);
    }
}

// Jalankan fungsi
loadReservationSection();
