
document.addEventListener('DOMContentLoaded', () => {
  const PROJECT_ID = 'tly2hu5w';
  const DATASET = 'production';
  const API_VERSION = '2025-01-01';

  const container = document.getElementById('featured-menu-grid');

  if (!container) return;

  // Mengambil menu yang ditandai sebagai unggulan di Sanity
  const query = `*[
    _type == "menuItem" &&
    isFeatured == true &&
    coalesce(isAvailable, true) == true
  ]
  | order(order asc)[0...4] {
    _id,
    name,
    description,
    price,
    image {
      asset->{url}
    },
    "categoryName": category->title
  }`;

  const endpoint =
    `https://${PROJECT_ID}.api.sanity.io/v${API_VERSION}/data/query/${DATASET}?query=${encodeURIComponent(query)}`;

  // Mencegah teks dari CMS dibaca sebagai HTML
  const escapeHTML = (value = '') => {
    return String(value).replace(/[&<>"']/g, char => ({
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#039;'
    })[char]);
  };

  const formatPrice = price => {
    return `Rp ${Number(price || 0).toLocaleString('id-ID')}`;
  };

  function renderFeaturedMenus(items) {
    if (!items.length) {
      container.innerHTML = `
        <p class="section-desc">
          Belum ada menu unggulan saat ini.
        </p>
      `;
      return;
    }

    container.innerHTML = items.map(item => {
      const image = item.image?.asset?.url || '';

      return `
        <article class="menu-item">
          <div class="menu-item-image">
            <img
              src="${escapeHTML(image)}"
              alt="${escapeHTML(item.name)}"
              loading="lazy"
            >
          </div>

          <div class="menu-item-meta">
            <span class="menu-item-category">
              ${escapeHTML(item.categoryName || 'Menu Zamzam')}
            </span>

            <span class="menu-item-price">
              ${formatPrice(item.price)}
            </span>
          </div>

          <h3 class="menu-item-name">
            ${escapeHTML(item.name)}
          </h3>

          <p class="menu-item-desc">
            ${escapeHTML(item.description || '')}
          </p>
        </article>
      `;
    }).join('');
  }

  async function loadFeaturedMenus() {
    try {
      const response = await fetch(endpoint);

      if (!response.ok) {
        throw new Error(`Sanity API Error: ${response.status}`);
      }

      const result = await response.json();

      console.log('Menu unggulan:', result.result);

      renderFeaturedMenus(result.result || []);

    } catch (error) {
      console.error('Gagal memuat menu unggulan:', error);

      container.innerHTML = `
        <p class="section-desc">
          Menu unggulan belum dapat dimuat.
          Silakan coba beberapa saat lagi.
        </p>
      `;
    }
  }

  loadFeaturedMenus();
});
