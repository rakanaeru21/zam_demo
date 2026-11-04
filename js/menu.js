
document.addEventListener('DOMContentLoaded', () => {
  // KONFIGURASI SANITY
  const PROJECT_ID = 'tly2hu5w';
  const DATASET = 'production';
  const API_VERSION = '2025-01-01';

  const catalog = document.getElementById('menu-catalog-content');
  if (!catalog) return;

  const menuData = new Map();

  // QUERY SANITY
  const query = `*[_type == "menuCategory" && coalesce(isActive, true) == true]
    | order(order asc) {
      _id,
      title,
      slug,
      description,
      eyebrow,
      "items": *[
        _type == "menuItem" &&
        category._ref == ^._id &&
        coalesce(isAvailable, true) == true
      ]
      | order(isFeatured desc, order asc) {
        _id,
        name,
        description,
        price,
        isFeatured,
        image {
          asset->{url}
        }
      }
    }`;

  const endpoint =
    `https://${PROJECT_ID}.api.sanity.io/v${API_VERSION}/data/query/${DATASET}?query=${encodeURIComponent(query)}`;

  // HELPER
  const escapeHTML = (value = '') => {
    return String(value).replace(/[&<>"']/g, char => ({
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#039;'
    })[char]);
  };

  const formatPrice = price =>
    `Rp ${Number(price || 0).toLocaleString('id-ID')}`;

  // KARTU MENU
  function createMenuCard(item, categoryTitle) {
    const image = item.image?.asset?.url || '';

    menuData.set(item._id, {
      ...item,
      categoryTitle
    });

    return `
      <article
        class="menu-item"
        tabindex="0"
        role="button"
        data-menu-id="${escapeHTML(item._id)}"
        aria-label="Lihat detail ${escapeHTML(item.name)}"
      >
        <div class="menu-item-image">
          <img
            src="${escapeHTML(image)}"
            alt="${escapeHTML(item.name)}"
            loading="lazy"
          >
        </div>

        <div class="menu-item-meta">
          <span class="menu-item-category">
            ${item.isFeatured ? 'Signature' : escapeHTML(categoryTitle)}
          </span>

          <span class="menu-item-price">
            ${formatPrice(item.price)}
          </span>
        </div>

        <h3 class="menu-item-name">
          ${escapeHTML(item.name)}
        </h3>
      </article>
    `;
  }

  // RENDER KATEGORI
  function renderCategories(categories) {
    if (!categories.length) {
      catalog.innerHTML = `
        <p class="section-desc">Belum ada kategori menu yang tersedia.</p>
      `;
      return;
    }

    menuData.clear();

    const navigation = `
      <nav class="menu-categories" aria-label="Kategori menu">
        ${categories.map(category => `
          <a href="#${escapeHTML(category.slug?.current || '')}">
            ${escapeHTML(category.title)}
          </a>
        `).join('')}
      </nav>
    `;

    const featuredItems = categories.flatMap(category =>
      (category.items || [])
        .filter(item => item.isFeatured === true)
        .map(item => ({
          ...item,
          categoryTitle: category.title
        }))
    );

    const featuredSection = featuredItems.length
      ? `
        <section class="menu-featured-section">
          <div class="menu-category-heading">
            <span class="label">Pilihan Spesial</span>
            <h2 class="section-heading">Menu Unggulan</h2>
            <p class="section-desc">
              Pilihan spesial yang menjadi favorit di Zamzam.
            </p>
          </div>

          <div class="menu-grid menu-grid-featured">
            ${featuredItems.map(item =>
              createMenuCard(item, item.categoryTitle)
            ).join('')}
          </div>
        </section>
      `
      : '';

    const sections = categories.map(category => {
      const slug = category.slug?.current;
      if (!slug) return '';

      const items = category.items || [];

      return `
        <section class="menu-category" id="${escapeHTML(slug)}">
          <div class="menu-category-heading">
            ${category.eyebrow
              ? `<span class="label">${escapeHTML(category.eyebrow)}</span>`
              : ''}

            <h2 class="section-heading">
              ${escapeHTML(category.title)}
            </h2>

            ${category.description
              ? `<p class="section-desc">${escapeHTML(category.description)}</p>`
              : ''}
          </div>

          <div class="menu-grid">
            ${items.length
              ? items.map(item =>
                  createMenuCard(item, category.title)
                ).join('')
              : `<p class="section-desc">Belum ada menu dalam kategori ini.</p>`
            }
          </div>
        </section>
      `;
    }).join('');

    catalog.innerHTML = navigation + featuredSection + sections;

    // NAVIGASI KATEGORI
    catalog.querySelectorAll('.menu-categories a').forEach(link => {
      link.addEventListener('click', event => {
        const targetId = decodeURIComponent(
          link.getAttribute('href').slice(1)
        );

        const target = document.getElementById(targetId);
        if (!target) return;

        event.preventDefault();

        target.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });

        history.replaceState(null, '', `#${targetId}`);
      });
    });
  }

  // MEMUAT DATA
  async function loadMenu() {
    try {
      catalog.innerHTML = `
        <p class="section-desc">Memuat daftar menu...</p>
      `;

      const response = await fetch(endpoint);

      if (!response.ok) {
        throw new Error(`Sanity API error: ${response.status}`);
      }

      const result = await response.json();

      console.log('Data Sanity:', result.result);

      renderCategories(result.result || []);

    } catch (error) {
      console.error('Gagal memuat menu:', error);

      catalog.innerHTML = `
        <p class="section-desc">
          Menu belum dapat dimuat. Silakan coba beberapa saat lagi.
        </p>
      `;
    }
  }

  // MEMBUKA DETAIL MENU
  function openMenuDetail(menuId) {
    const item = menuData.get(menuId);
    if (!item) return;

    const modal = document.getElementById('menu-detail-modal');
    if (!modal) return;

    const detailImage = document.getElementById('menu-detail-image');
    const detailTitle = document.getElementById('menu-detail-title');
    const detailDescription = document.getElementById('menu-detail-description');
    const detailPrice = document.getElementById('menu-detail-price');
    const detailCategory = document.getElementById('menu-detail-category');

    if (detailImage) {
      detailImage.src = item.image?.asset?.url || '';
      detailImage.alt = item.name || '';
    }

    if (detailTitle) {
      detailTitle.textContent = item.name || '';
    }

    if (detailDescription) {
      detailDescription.textContent =
        item.description || 'Belum ada deskripsi untuk menu ini.';
    }

    if (detailPrice) {
      detailPrice.textContent = formatPrice(item.price);
    }

    if (detailCategory) {
      detailCategory.textContent = item.isFeatured
        ? 'Signature'
        : item.categoryTitle || '';
    }

    modal.classList.add('active');
    modal.setAttribute('aria-hidden', 'false');
    document.body.classList.add('modal-open');
  }

  // MENUTUP DETAIL
  function closeMenuDetail() {
    const modal = document.getElementById('menu-detail-modal');
    if (!modal) return;

    modal.classList.remove('active');
    modal.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('modal-open');
  }

  // EVENT KLIK KARTU
  catalog.addEventListener('click', event => {
    const card = event.target.closest('[data-menu-id]');
    if (!card) return;

    openMenuDetail(card.dataset.menuId);
  });

  // EVENT KEYBOARD
  catalog.addEventListener('keydown', event => {
    const card = event.target.closest('[data-menu-id]');

    if (!card || !['Enter', ' '].includes(event.key)) return;

    event.preventDefault();
    openMenuDetail(card.dataset.menuId);
  });

  // TOMBOL TUTUP
  document.querySelectorAll('.js-close-menu-detail').forEach(button => {
    button.addEventListener('click', closeMenuDetail);
  });

  document.addEventListener('keydown', event => {
    if (event.key === 'Escape') closeMenuDetail();
  });

  // JALANKAN
  loadMenu();
});
