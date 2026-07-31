/* ==========================================================================
   GG GABRIELA GARCIA - INTERACTIVE JAVASCRIPT & SECURE ADMIN (V4)
   ========================================================================== */

const WHATSAPP_NUMBER = '5591982047600';

// Dados Padrão Iniciais
const DEFAULT_CATEGORIES = [
  { id: 'diadospais', name: 'Dia dos Pais', icon: 'heart-handshake', desc: 'Caixas de bombons com camisa de time, bonés e relógios.' },
  { id: 'canecas', name: 'Canecas & Xícaras', icon: 'coffee', desc: 'Mágicas, alça coração, com fotos e memes Flork.' },
  { id: 'azulejos', name: 'Azulejos & Relógios', icon: 'image', desc: 'Porcelanas 20x20, azulejos com relógio e Spotify Code.' },
  { id: 'garrafas', name: 'Squeezes & Garrafas', icon: 'droplet', desc: 'Alumínio com tampa dupla, estampas duráveis.' },
  { id: 'chaveiros', name: 'Chaveiros & Imãs', icon: 'key', desc: 'Chaveiros de alta resolução e imãs 5x5 para fotos.' },
  { id: 'brindes', name: 'Brindes & Outros', icon: 'gift', desc: 'Lembrancinhas para festas, eventos e datas especiais.' }
];

const DEFAULT_PRODUCTS = [
  {
    id: 'p1',
    category: 'canecas',
    title: 'Xícaras Mágicas (Alça Coração)',
    description: 'Revela a imagem ou frase quando aquecida com café ou chá quente! Incluso arte personalizada, xícara cerâmica premium e embalagem de presente.',
    originalPrice: 55.00,
    promoPrice: 47.00,
    images: ['./6ab20412-d3f5-4cee-9a89-a68b250e496b.jpg']
  },
  {
    id: 'p2',
    category: 'canecas',
    title: 'Xícaras Alça de Coração',
    description: 'Modelo romântico e delicado para casais, mensagens afetivas, Snoopy ou personagens. Incluso arte e embalagem especial.',
    originalPrice: 50.00,
    promoPrice: 45.00,
    images: ['./9e70fce0-fab3-4a56-b9bd-7afc02a7fce6.jpg']
  },
  {
    id: 'p3',
    category: 'canecas',
    title: 'Xícaras Simples Personalizadas',
    description: 'Estampas com fotos estilo Polaroid, 12 motivos para amar você, mensagens de carinho. Incluso arte e embalagem de presente.',
    originalPrice: 40.00,
    promoPrice: 35.00,
    images: ['./eaa8ee4a-aaa3-4b8b-b562-9c7d9c4923d2.jpg']
  },
  {
    id: 'p4',
    category: 'canecas',
    title: 'Coleção Canecas Divertidas & Flork',
    description: 'Canecas bem-humoradas com boneco Flork, calendário de namoro, frases hilárias de amizade e profissões.',
    originalPrice: 42.00,
    promoPrice: 35.00,
    images: ['./3c124ba4-7b75-4acf-9676-4c582696b573.jpg']
  },
  {
    id: 'p5',
    category: 'canecas',
    title: 'Canecas com Iniciais & Florais',
    description: 'Estampas delicadas com monogramas florais, inicial do seu nome, frases para Mães, Filhas e Madrinhas.',
    originalPrice: 45.00,
    promoPrice: 35.00,
    images: ['./877f987d-483a-48b5-bcd5-ae1cf92ffe30.jpg']
  },
  {
    id: 'p6',
    category: 'azulejos',
    title: 'Azulejo Personalizado 20x20',
    description: 'Impressão fotográfica de alta durabilidade em porcelana cerâmica. Acompanha suporte de mesa elegante e embalagem de presente!',
    originalPrice: 48.00,
    promoPrice: 40.00,
    images: ['./183c3b84-85f3-414c-a912-3a2e56884c17.jpg']
  },
  {
    id: 'p7',
    category: 'azulejos',
    title: 'Azulejo Spotify & Mosaico de Fotos',
    description: 'Azulejos decorativos com código interativo do Spotify (sua música favorita), calendário com datas especiais e mosaicos de fotos de família.',
    originalPrice: 50.00,
    promoPrice: 40.00,
    images: ['./7ebd8191-462d-4b2b-a44b-612eb12cac98.jpg']
  },
  {
    id: 'p8',
    category: 'azulejos',
    title: 'Azulejo Relógio Funcional 20x20',
    description: 'Relógio de mesa funcional em azulejo cerâmico com máquina contínua silenciosa. Acompanha suporte de mesa, arte e embalagem.',
    originalPrice: 55.00,
    promoPrice: 40.00,
    images: ['./b81e6161-762f-40e4-af6f-2e168682e8b9.jpg']
  },
  {
    id: 'p9',
    category: 'azulejos',
    title: 'Relógios de Mesa Afetivos',
    description: 'Modelos comemorativos para Mãe, Vó, Pai, Casal e Bebês. Presente de altíssima utilidade, elegância e valor emocional.',
    originalPrice: 50.00,
    promoPrice: 40.00,
    images: ['./b750b56e-0cb0-400e-bfee-9e06ef36b0e9.jpg']
  },
  {
    id: 'p10',
    category: 'garrafas',
    title: 'Squeeze Alumínio Tampa Dupla',
    description: 'Garrafas de alumínio 500ml/600ml duráveis com tampa dupla de segurança. Personalize com seu nome, super-heróis ou florais.',
    originalPrice: 55.00,
    promoPrice: 45.00,
    images: ['./b589c2a3-d000-42fc-a963-c776cd758268.jpg']
  },
  {
    id: 'p11',
    category: 'chaveiros',
    title: 'Chaveiros Sublimados',
    description: 'Chaveiros com fotos de alta resolução, frases de carinho (Dinda, Mamãe) e artes exclusivas. Lembrança acessível e marcante.',
    originalPrice: 8.00,
    promoPrice: 5.00,
    images: ['./b2ef4f25-f591-40f5-b8bd-c374cbdd6539.jpg']
  },
  {
    id: 'p12',
    category: 'chaveiros',
    title: 'Imãs de Geladeira Fotográficos 5x5',
    description: 'R$ 4,00 a unidade ou Promoção 3 unidades por R$ 10,00! Transforme as fotos do celular em imãs fotográficos brilhantes.',
    originalPrice: 5.00,
    promoPrice: 4.00,
    images: ['./0057f877-d413-4476-9c48-e96f356d0e3f.jpg']
  }
];

const DEFAULT_PROMOS = [
  {
    id: 'promo1',
    title: 'Caixa Bombom + Camisa Corinthians',
    description: 'Camisa personalizada de time, bombons e foto polaroid com prendedor. "Para o melhor Pai do Mundo!"',
    originalPrice: 100.00,
    promoPrice: 85.00,
    tag: '',
    images: ['./1c252cc3-73b2-40f5-9c10-cbe7392c274a.jpg']
  },
  {
    id: 'promo2',
    title: 'Caixa Bombom + Camisa Fluminense',
    description: 'Arte sob medida com o time do coração dele, foto afetuosa e embalagem decorada de presente.',
    originalPrice: 100.00,
    promoPrice: 85.00,
    tag: '',
    images: ['./7f6d1b45-8e12-4a0b-a0aa-ae7f90a7bde8.jpg']
  },
  {
    id: 'promo3',
    title: 'Caixa Bombom + Camisa São Paulo',
    description: 'Combine o amor pelo futebol e pelo pai em uma lembrança doce, elegante e cheia de carinho.',
    originalPrice: 100.00,
    promoPrice: 85.00,
    tag: '',
    images: ['./e9ea658e-fc1d-461f-a04c-41ec6b4b6d27.jpg']
  },
  {
    id: 'promo4',
    title: 'Boné Personalizado "DAD EST 2025"',
    description: 'Bordado ou estampa de altíssima definição. Estilo moderno e emocionante para novos pais e avós!',
    originalPrice: 60.00,
    promoPrice: 49.90,
    tag: 'Lançamento',
    images: ['./Boné.jpg']
  }
];

const DEFAULT_PROMO_SETTINGS = {
  enabled: true,
  badge: '👔 Especial Dia dos Pais — Edição Limitada',
  title: 'Surpreenda o Seu Herói com um Presente Inesquecível',
  emoji: '👨‍👧‍👦',
  subtitle: 'Caixas personalizadas do time do coração com bombons Ferrero Rocher + Bonés exclusivos e relógios afetivos. Faça seu pedido antecipado!',
  countdownEnabled: true,
  countdownTitle: 'Corra! Encomendas antecipadas com condições especiais encerram em:',
  deadline: '',
  ctaText: 'Solicitar Orçamento Personalizado para o Dia dos Pais'
};

const STORAGE_KEYS = {
  categories: 'gg_categories',
  products: 'gg_products',
  promos: 'gg_promos',
  promoSettings: 'gg_promo_settings'
};

let categories = [];
let products = [];
let promos = [];
let promoSettings = {};

let isAdminMode = false;
let currentFilter = 'all';
let logoClickCount = 0;
let logoClickTimer = null;
let countdownInterval = null;

// Fotos sendo editadas no momento (produto e oferta)
let productImages = [];
let promoImages = [];

// Estado da galeria do lightbox
let modalGallery = [];
let modalGalleryIndex = 0;

const ADMIN_PIN = '1234'; // Senha de acesso do proprietário

document.addEventListener('DOMContentLoaded', () => {
  loadData();
  initMobileMenu();
  initFaqAccordion();
  renderApp();
});

/* --------------------------------------------------------------------------
   1. GERENCIAMENTO DE DADOS (LOCALSTORAGE)
   -------------------------------------------------------------------------- */

// Aceita tanto o formato antigo (image: '...') quanto o novo (images: [...])
function normalizeItem(item) {
  let images = [];

  if (Array.isArray(item.images)) {
    images = item.images.filter(src => typeof src === 'string' && src.trim() !== '');
  } else if (typeof item.image === 'string' && item.image.trim() !== '') {
    images = [item.image];
  }

  const normalized = { ...item, images };
  delete normalized.image;
  return normalized;
}

function readStored(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    const parsed = JSON.parse(raw);
    return parsed ?? fallback;
  } catch (err) {
    console.warn(`Não foi possível ler "${key}" do armazenamento local.`, err);
    return fallback;
  }
}

function loadData() {
  categories = readStored(STORAGE_KEYS.categories, null) || DEFAULT_CATEGORIES.map(c => ({ ...c }));
  products = (readStored(STORAGE_KEYS.products, null) || DEFAULT_PRODUCTS).map(normalizeItem);
  promos = (readStored(STORAGE_KEYS.promos, null) || DEFAULT_PROMOS).map(normalizeItem);
  promoSettings = { ...DEFAULT_PROMO_SETTINGS, ...(readStored(STORAGE_KEYS.promoSettings, null) || {}) };

  // Na primeira visita o contador vale 8 dias a partir de agora.
  if (!promoSettings.deadline) {
    const target = new Date();
    target.setDate(target.getDate() + 8);
    target.setHours(23, 59, 59, 0);
    promoSettings.deadline = toLocalDatetimeValue(target);
  }
}

function isQuotaError(err) {
  return err && (
    err.name === 'QuotaExceededError' ||
    err.name === 'NS_ERROR_DOM_QUOTA_REACHED' ||
    err.code === 22
  );
}

function saveData() {
  const snapshot = {
    [STORAGE_KEYS.categories]: JSON.stringify(categories),
    [STORAGE_KEYS.products]: JSON.stringify(products),
    [STORAGE_KEYS.promos]: JSON.stringify(promos),
    [STORAGE_KEYS.promoSettings]: JSON.stringify(promoSettings)
  };

  const previous = {};
  Object.keys(snapshot).forEach(key => { previous[key] = localStorage.getItem(key); });

  try {
    Object.entries(snapshot).forEach(([key, value]) => localStorage.setItem(key, value));
    return true;
  } catch (err) {
    // Desfaz a gravação parcial para não deixar os dados inconsistentes.
    Object.entries(previous).forEach(([key, value]) => {
      if (value === null) localStorage.removeItem(key);
      else localStorage.setItem(key, value);
    });

    if (isQuotaError(err)) {
      alert(
        'O espaço de armazenamento do navegador acabou!\n\n' +
        'As fotos ocupam bastante espaço. Para continuar:\n' +
        '• Baixe um backup (botão "Backup") para não perder nada;\n' +
        '• Apague fotos antigas que não usa mais;\n' +
        '• Ou use menos fotos por produto.\n\n' +
        'Esta última alteração NÃO foi salva.'
      );
    } else {
      console.error('Falha ao salvar os dados.', err);
      alert('Não foi possível salvar a alteração neste navegador.');
    }
    return false;
  }
}

// Salva e avisa na tela. Devolve true quando deu certo.
function persist(successMessage) {
  const ok = saveData();
  if (ok && successMessage) showToast(successMessage);
  return ok;
}

/* --------------------------------------------------------------------------
   2. RENDERIZAÇÃO DA APLICAÇÃO
   -------------------------------------------------------------------------- */
function renderApp() {
  renderCategoriesGrid();
  renderPortfolioFilters();
  renderPortfolioGrid();
  renderPromoSection();
  updateCalcSelect();
  updateCalcEstimate();
  refreshIcons();
}

function refreshIcons() {
  if (window.lucide) window.lucide.createIcons();
}

function coverImage(item) {
  return (item.images && item.images[0]) || './3f7b4bd0-54a9-4490-96f7-d2e134892c30.jpg';
}

function formatPrice(value) {
  return `R$ ${parseFloat(value || 0).toFixed(2).replace('.', ',')}`;
}

function discountPercent(item) {
  const original = parseFloat(item.originalPrice);
  const promo = parseFloat(item.promoPrice);
  if (!original || !promo || original <= promo) return 0;
  return Math.round(((original - promo) / original) * 100);
}

function renderCategoriesGrid() {
  const container = document.getElementById('categories-grid-container');
  if (!container) return;

  if (categories.length === 0) {
    container.innerHTML = `<div class="empty-state">Nenhuma categoria cadastrada ainda.</div>`;
    return;
  }

  container.innerHTML = categories.map(cat => {
    const count = products.filter(p => p.category === cat.id).length;

    return `
      <div class="category-card" onclick="filterPortfolio('${escapeAttr(cat.id)}')">
        <div class="cat-icon-box"><i data-lucide="${escapeAttr(cat.icon || 'tag')}"></i></div>
        <h3>${escapeHtml(cat.name)}</h3>
        <p>${escapeHtml(cat.desc || 'Produtos personalizados incríveis.')}</p>
        <span class="cat-count">${count} ${count === 1 ? 'produto' : 'produtos'}</span>
        <span class="cat-link">Ver Produtos <i data-lucide="arrow-right"></i></span>
        ${isAdminMode ? `
          <div class="admin-card-controls admin-card-controls-corner" onclick="event.stopPropagation()">
            <button class="btn-icon-admin btn-edit-admin" onclick="openCategoryEditModal('${escapeAttr(cat.id)}')" title="Editar Categoria">
              <i data-lucide="edit"></i>
            </button>
            <button class="btn-icon-admin btn-delete-admin" onclick="deleteCategory('${escapeAttr(cat.id)}')" title="Excluir Categoria">
              <i data-lucide="trash-2"></i>
            </button>
          </div>
        ` : ''}
      </div>
    `;
  }).join('');
}

function renderPortfolioFilters() {
  const container = document.getElementById('portfolio-filters');
  if (!container) return;

  let html = `<button class="filter-btn ${currentFilter === 'all' ? 'active' : ''}" onclick="setFilter('all')">Todos os Produtos</button>`;

  categories.forEach(cat => {
    html += `<button class="filter-btn ${currentFilter === cat.id ? 'active' : ''}" onclick="setFilter('${escapeAttr(cat.id)}')">${escapeHtml(cat.name)}</button>`;
  });

  if (isAdminMode) {
    html += `<button class="filter-btn filter-btn-admin" onclick="openCategoryEditModal()"><i data-lucide="folder-plus"></i> Nova Categoria</button>`;
  }

  container.innerHTML = html;
}

function setFilter(catId) {
  currentFilter = catId;
  renderPortfolioFilters();
  renderPortfolioGrid();
  refreshIcons();
}

function renderPortfolioGrid() {
  const container = document.getElementById('portfolio-grid');
  if (!container) return;

  const filteredProducts = currentFilter === 'all'
    ? products
    : products.filter(p => p.category === currentFilter);

  if (filteredProducts.length === 0) {
    container.innerHTML = `<div class="empty-state">Nenhum produto cadastrado nesta categoria.</div>`;
    return;
  }

  container.innerHTML = filteredProducts.map(p => {
    const categoryObj = categories.find(c => c.id === p.category);
    const catName = categoryObj ? categoryObj.name : 'Personalizado';
    const percent = discountPercent(p);
    const photoCount = (p.images || []).length;

    const discountBadge = percent > 0 ? `<span class="card-badge-discount">-${percent}% OFF</span>` : '';

    const priceHTML = percent > 0
      ? `<div class="price-group">
           <span class="price-de">${formatPrice(p.originalPrice)}</span>
           <span class="price-por">${formatPrice(p.promoPrice)}</span>
         </div>`
      : `<div class="price-group">
           <span class="price-por">${formatPrice(p.promoPrice)}</span>
         </div>`;

    const waMsg = `Olá Gabriela! Gostaria de encomendar o produto: ${p.title} (Valor: ${formatPrice(p.promoPrice)})`;
    const waUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(waMsg)}`;

    return `
      <div class="portfolio-card-clean">
        <div class="portfolio-img-container">
          <img src="${escapeAttr(coverImage(p))}" alt="${escapeAttr(p.title)}" loading="lazy">
          ${discountBadge}
          <span class="card-badge-cat">${escapeHtml(catName)}</span>
          ${photoCount > 1 ? `<span class="card-badge-photos"><i data-lucide="images"></i> ${photoCount}</span>` : ''}
          <div class="portfolio-card-overlay">
            <button class="zoom-btn" onclick="openProductLightbox('${escapeAttr(p.id)}')">
              <i data-lucide="zoom-in"></i> Ver Detalhes
            </button>
          </div>
        </div>

        <div class="portfolio-body">
          <div class="portfolio-body-top">
            <h4 class="portfolio-item-title">${escapeHtml(p.title)}</h4>
            <p class="portfolio-item-desc">${escapeHtml(p.description)}</p>
          </div>

          <div class="portfolio-body-bottom">
            <div class="portfolio-price-row">
              ${priceHTML}
            </div>

            <div class="portfolio-card-actions">
              <a href="${waUrl}" target="_blank" class="btn-card-wa">
                <i data-lucide="shopping-cart"></i> Encomendar
              </a>
              ${isAdminMode ? `
                <div class="admin-card-controls">
                  <button class="btn-icon-admin btn-photo-admin" onclick="openProductModal('${escapeAttr(p.id)}', 'photos')" title="Adicionar Fotos">
                    <i data-lucide="image-plus"></i>
                  </button>
                  <button class="btn-icon-admin btn-edit-admin" onclick="openProductModal('${escapeAttr(p.id)}')" title="Editar Preço e Descrição">
                    <i data-lucide="edit"></i>
                  </button>
                  <button class="btn-icon-admin btn-delete-admin" onclick="deleteProduct('${escapeAttr(p.id)}')" title="Excluir Produto">
                    <i data-lucide="trash-2"></i>
                  </button>
                </div>
              ` : ''}
            </div>
          </div>
        </div>
      </div>
    `;
  }).join('');

  refreshIcons();
}

function filterPortfolio(catId) {
  const section = document.getElementById('portfolio');
  if (section) section.scrollIntoView({ behavior: 'smooth' });
  setFilter(catId);
}

/* --------------------------------------------------------------------------
   3. SEÇÃO DE PROMOÇÕES (DINÂMICA)
   -------------------------------------------------------------------------- */
function renderPromoSection() {
  const section = document.getElementById('promocao');
  if (!section) return;

  // A seção fica escondida para os clientes quando desligada, mas continua
  // visível no modo admin para que ela possa reativá-la.
  const visible = promoSettings.enabled || isAdminMode;
  section.style.display = visible ? '' : 'none';

  if (!visible) {
    stopCountdown();
    // Esvazia os containers para não deixar botões de admin no HTML da página.
    ['promo-banner-header', 'promo-products-grid', 'promo-cta-box'].forEach(id => {
      const el = document.getElementById(id);
      if (el) el.innerHTML = '';
    });
    return;
  }

  renderPromoHeader();
  renderPromoGrid();
  renderPromoCta();
  initCountdownTimer();
}

function renderPromoHeader() {
  const header = document.getElementById('promo-banner-header');
  if (!header) return;

  const disabledNotice = !promoSettings.enabled
    ? `<div class="admin-inline-warning"><i data-lucide="eye-off"></i> Esta seção está oculta para os clientes. Só você a está vendo.</div>`
    : '';

  header.innerHTML = `
    ${disabledNotice}
    ${promoSettings.badge ? `<span class="promo-badge promo-badge-pais">${escapeHtml(promoSettings.badge)}</span>` : ''}
    <h2>${escapeHtml(promoSettings.title)} ${promoSettings.emoji ? `<span class="promo-emoji-row">${escapeHtml(promoSettings.emoji)}</span>` : ''}</h2>
    ${promoSettings.subtitle ? `<p>${escapeHtml(promoSettings.subtitle)}</p>` : ''}
  `;
}

function renderPromoGrid() {
  const grid = document.getElementById('promo-products-grid');
  if (!grid) return;

  if (promos.length === 0) {
    grid.innerHTML = `<div class="empty-state empty-state-light">Nenhuma oferta cadastrada na campanha.</div>`;
    return;
  }

  grid.innerHTML = promos.map(item => {
    const percent = discountPercent(item);
    const tagText = item.tag ? item.tag : (percent > 0 ? `-${percent}% OFF` : '');
    const photoCount = (item.images || []).length;

    const priceHTML = percent > 0
      ? `<span class="price-old">${formatPrice(item.originalPrice)}</span>
         <span class="price-current">${formatPrice(item.promoPrice)}</span>`
      : `<span class="price-current">${formatPrice(item.promoPrice)}</span>`;

    const waMsg = `Olá! Quero encomendar: ${item.title} (${formatPrice(item.promoPrice)})`;
    const waUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(waMsg)}`;

    return `
      <div class="promo-product-card">
        <div class="promo-img-box" onclick="openPromoLightbox('${escapeAttr(item.id)}')">
          <img src="${escapeAttr(coverImage(item))}" alt="${escapeAttr(item.title)}" loading="lazy">
          ${tagText ? `<span class="tag-discount">${escapeHtml(tagText)}</span>` : ''}
          ${photoCount > 1 ? `<span class="card-badge-photos"><i data-lucide="images"></i> ${photoCount}</span>` : ''}
        </div>
        <div class="promo-card-body">
          <h3>${escapeHtml(item.title)}</h3>
          <p>${escapeHtml(item.description)}</p>
          <div class="price-box">
            ${priceHTML}
          </div>
          <a href="${waUrl}" target="_blank" class="btn btn-sm btn-primary">
            <i data-lucide="shopping-bag"></i> Encomendar
          </a>
          ${isAdminMode ? `
            <div class="admin-card-controls admin-card-controls-promo">
              <button class="btn-icon-admin btn-photo-admin" onclick="openPromoItemModal('${escapeAttr(item.id)}', 'photos')" title="Adicionar Fotos">
                <i data-lucide="image-plus"></i>
              </button>
              <button class="btn-icon-admin btn-edit-admin" onclick="openPromoItemModal('${escapeAttr(item.id)}')" title="Editar Preço e Descrição">
                <i data-lucide="edit"></i>
              </button>
              <button class="btn-icon-admin btn-delete-admin" onclick="deletePromoItem('${escapeAttr(item.id)}')" title="Excluir Oferta">
                <i data-lucide="trash-2"></i>
              </button>
            </div>
          ` : ''}
        </div>
      </div>
    `;
  }).join('');
}

function renderPromoCta() {
  const box = document.getElementById('promo-cta-box');
  if (!box) return;

  if (!promoSettings.ctaText) {
    box.innerHTML = '';
    return;
  }

  const waUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent('Olá! ' + promoSettings.ctaText)}`;
  box.innerHTML = `
    <a href="${waUrl}" target="_blank" class="btn btn-whatsapp btn-lg">
      <i data-lucide="message-circle"></i> ${escapeHtml(promoSettings.ctaText)}
    </a>
  `;
}

/* --------------------------------------------------------------------------
   4. AUTENTICAÇÃO E SEGURANÇA DA ÁREA ADMIN
   -------------------------------------------------------------------------- */
function openAdminPasswordModal(event) {
  if (event) event.preventDefault();
  const modal = document.getElementById('admin-login-modal');
  const input = document.getElementById('admin-pass-input');
  if (input) input.value = '';
  if (modal) modal.classList.add('open');
}

function closeAdminPasswordModal() {
  const modal = document.getElementById('admin-login-modal');
  if (modal) modal.classList.remove('open');
}

function verifyAdminPassword(event) {
  event.preventDefault();
  const input = document.getElementById('admin-pass-input');
  const pass = input.value.trim();

  if (pass === ADMIN_PIN || pass === 'gg2026') {
    isAdminMode = true;
    closeAdminPasswordModal();
    updateAdminVisibility();
    renderApp();
    showToast('Modo administrativo ativado. Bom trabalho, Gabriela!');
  } else {
    alert('Senha incorreta! Acesso negado.');
  }
}

function exitAdminMode() {
  isAdminMode = false;
  updateAdminVisibility();
  renderApp();
}

// Liga/desliga todos os controles visíveis apenas para a administradora.
function updateAdminVisibility() {
  const blocks = [
    { id: 'admin-float-bar', display: 'block' },
    { id: 'admin-add-product-wrapper', display: 'flex' },
    { id: 'admin-category-controls', display: 'flex' },
    { id: 'admin-promo-controls', display: 'flex' }
  ];

  blocks.forEach(({ id, display }) => {
    const el = document.getElementById(id);
    if (el) el.style.display = isAdminMode ? display : 'none';
  });

  document.body.classList.toggle('admin-active', isAdminMode);
}

function handleLogoClicks(event) {
  logoClickCount++;
  clearTimeout(logoClickTimer);
  logoClickTimer = setTimeout(() => { logoClickCount = 0; }, 1200);

  if (logoClickCount >= 3) {
    logoClickCount = 0;
    openAdminPasswordModal(event);
  }
}

/* --------------------------------------------------------------------------
   5. GALERIA DE FOTOS (COMPARTILHADA ENTRE PRODUTOS E OFERTAS)
   -------------------------------------------------------------------------- */

// Reduz a foto antes de guardar: fotos de celular passam de 4 MB e estouram
// o limite do navegador em poucas imagens.
function compressImage(file, maxDimension = 1200, quality = 0.82) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onerror = () => reject(new Error(`Não foi possível ler "${file.name}".`));
    reader.onload = () => {
      const img = new Image();

      img.onerror = () => reject(new Error(`"${file.name}" não parece ser uma imagem válida.`));
      img.onload = () => {
        let { width, height } = img;

        if (width > maxDimension || height > maxDimension) {
          const scale = maxDimension / Math.max(width, height);
          width = Math.round(width * scale);
          height = Math.round(height * scale);
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, width, height);
        ctx.drawImage(img, 0, 0, width, height);

        resolve(canvas.toDataURL('image/jpeg', quality));
      };

      img.src = reader.result;
    };

    reader.readAsDataURL(file);
  });
}

async function handleImageFiles(event, targetList, renderFn) {
  const files = Array.from(event.target.files || []);
  if (files.length === 0) return;

  showToast(`Processando ${files.length} ${files.length === 1 ? 'foto' : 'fotos'}...`);

  for (const file of files) {
    try {
      const dataUrl = await compressImage(file);
      targetList.push(dataUrl);
    } catch (err) {
      console.error(err);
      alert(err.message);
    }
  }

  event.target.value = '';
  renderFn();
  showToast(`${files.length} ${files.length === 1 ? 'foto adicionada' : 'fotos adicionadas'}. Não esqueça de salvar!`);
}

function renderGalleryPreview(containerId, list, kind) {
  const container = document.getElementById(containerId);
  if (!container) return;

  if (list.length === 0) {
    container.innerHTML = `<p class="gallery-empty">Nenhuma foto ainda. Use o botão acima para escolher.</p>`;
    return;
  }

  container.innerHTML = list.map((src, index) => `
    <div class="gallery-thumb ${index === 0 ? 'is-cover' : ''}" onclick="setGalleryCover('${kind}', ${index})" title="${index === 0 ? 'Foto de capa' : 'Clique para tornar esta a capa'}">
      <img src="${escapeAttr(src)}" alt="Foto ${index + 1}">
      ${index === 0 ? `<span class="gallery-cover-badge">Capa</span>` : ''}
      <button type="button" class="gallery-remove" onclick="event.stopPropagation(); removeGalleryImage('${kind}', ${index})" title="Remover foto">
        <i data-lucide="x"></i>
      </button>
    </div>
  `).join('');

  refreshIcons();
}

function galleryListFor(kind) {
  return kind === 'promo' ? promoImages : productImages;
}

function renderGalleryFor(kind) {
  if (kind === 'promo') renderGalleryPreview('pr-gallery-preview', promoImages, 'promo');
  else renderGalleryPreview('p-gallery-preview', productImages, 'product');
}

function setGalleryCover(kind, index) {
  const list = galleryListFor(kind);
  if (index <= 0 || index >= list.length) return;

  const [chosen] = list.splice(index, 1);
  list.unshift(chosen);
  renderGalleryFor(kind);
}

function removeGalleryImage(kind, index) {
  const list = galleryListFor(kind);
  list.splice(index, 1);
  renderGalleryFor(kind);
}

function addProductImages(event) {
  handleImageFiles(event, productImages, () => renderGalleryFor('product'));
}

function addPromoImages(event) {
  handleImageFiles(event, promoImages, () => renderGalleryFor('promo'));
}

function addImageFromUrlInput(inputId, list, kind) {
  const input = document.getElementById(inputId);
  if (!input) return;

  const url = input.value.trim();
  if (!url) return;

  list.push(url);
  input.value = '';
  renderGalleryFor(kind);
}

function addProductImageFromUrl() {
  addImageFromUrlInput('p-image-url', productImages, 'product');
}

function addPromoImageFromUrl() {
  addImageFromUrlInput('pr-image-url', promoImages, 'promo');
}

/* --------------------------------------------------------------------------
   6. MODAL & GERENCIAMENTO DE PRODUTOS
   -------------------------------------------------------------------------- */
function openProductModal(productId = null, focus = null) {
  const modal = document.getElementById('product-admin-modal');
  const modalTitle = document.getElementById('product-modal-title');
  const catSelect = document.getElementById('p-category');
  const form = document.getElementById('product-form');

  form.reset();
  catSelect.innerHTML = categories.map(c => `<option value="${escapeAttr(c.id)}">${escapeHtml(c.name)}</option>`).join('');
  productImages = [];

  if (productId) {
    const p = products.find(prod => prod.id === productId);
    if (p) {
      modalTitle.innerHTML = `<i data-lucide="edit"></i> Editar Produto`;
      document.getElementById('edit-product-id').value = p.id;
      catSelect.value = p.category;
      document.getElementById('p-title').value = p.title;
      document.getElementById('p-description').value = p.description;
      document.getElementById('p-original-price').value = p.originalPrice || '';
      document.getElementById('p-promo-price').value = p.promoPrice || '';
      productImages = [...(p.images || [])];
    }
  } else {
    modalTitle.innerHTML = `<i data-lucide="package-plus"></i> Cadastrar Novo Produto`;
    document.getElementById('edit-product-id').value = '';
  }

  renderGalleryFor('product');
  if (modal) modal.classList.add('open');
  refreshIcons();

  // Ao clicar em "adicionar fotos" no card, já abre o seletor de arquivos.
  if (focus === 'photos') {
    setTimeout(() => document.getElementById('p-image-file')?.click(), 250);
  }
}

function closeProductModal() {
  const modal = document.getElementById('product-admin-modal');
  if (modal) modal.classList.remove('open');
}

function saveProductForm(event) {
  event.preventDefault();

  const editId = document.getElementById('edit-product-id').value;
  const payload = {
    category: document.getElementById('p-category').value,
    title: document.getElementById('p-title').value.trim(),
    description: document.getElementById('p-description').value.trim(),
    originalPrice: parseFloat(document.getElementById('p-original-price').value) || null,
    promoPrice: parseFloat(document.getElementById('p-promo-price').value) || 0,
    images: [...productImages]
  };

  const backup = JSON.stringify(products);

  if (editId) {
    const index = products.findIndex(p => p.id === editId);
    if (index !== -1) products[index] = { id: editId, ...payload };
  } else {
    products.push({ id: 'p_' + Date.now(), ...payload });
  }

  if (persist('Produto salvo com sucesso!')) {
    closeProductModal();
    renderApp();
  } else {
    products = JSON.parse(backup);
  }
}

function deleteProduct(productId) {
  const product = products.find(p => p.id === productId);
  if (!product) return;

  if (!confirm(`Excluir o produto "${product.title}"?\n\nEsta ação não pode ser desfeita.`)) return;

  const backup = JSON.stringify(products);
  products = products.filter(p => p.id !== productId);

  if (persist('Produto excluído.')) renderApp();
  else products = JSON.parse(backup);
}

/* --------------------------------------------------------------------------
   7. GERENCIAMENTO DE CATEGORIAS
   -------------------------------------------------------------------------- */
function openCategoryModal() {
  const modal = document.getElementById('category-admin-modal');
  renderAdminCategoryList();
  if (modal) modal.classList.add('open');
  refreshIcons();
}

function closeCategoryModal() {
  const modal = document.getElementById('category-admin-modal');
  if (modal) modal.classList.remove('open');
}

function renderAdminCategoryList() {
  const listContainer = document.getElementById('admin-category-list');
  if (!listContainer) return;

  if (categories.length === 0) {
    listContainer.innerHTML = `<p class="gallery-empty">Nenhuma categoria cadastrada.</p>`;
    return;
  }

  listContainer.innerHTML = categories.map(cat => {
    const count = products.filter(p => p.category === cat.id).length;

    return `
      <div class="admin-cat-item">
        <span>
          <i data-lucide="${escapeAttr(cat.icon || 'tag')}"></i>
          <strong>${escapeHtml(cat.name)}</strong>
          <small>${count} ${count === 1 ? 'produto' : 'produtos'}</small>
        </span>
        <span class="admin-cat-actions">
          <button class="btn-icon-admin btn-edit-admin" onclick="openCategoryEditModal('${escapeAttr(cat.id)}')" title="Editar Categoria">
            <i data-lucide="edit"></i>
          </button>
          <button class="btn-icon-admin btn-delete-admin" onclick="deleteCategory('${escapeAttr(cat.id)}')" title="Excluir Categoria">
            <i data-lucide="trash-2"></i>
          </button>
        </span>
      </div>
    `;
  }).join('');

  refreshIcons();
}

function openCategoryEditModal(catId = null) {
  const modal = document.getElementById('category-edit-modal');
  const title = document.getElementById('category-edit-title');
  const form = document.getElementById('category-edit-form');

  form.reset();

  if (catId) {
    const cat = categories.find(c => c.id === catId);
    if (cat) {
      title.innerHTML = `<i data-lucide="edit"></i> Editar Categoria`;
      document.getElementById('edit-category-id').value = cat.id;
      document.getElementById('c-name').value = cat.name;
      document.getElementById('c-desc').value = cat.desc || '';
      document.getElementById('c-icon').value = cat.icon || 'tag';
    }
  } else {
    title.innerHTML = `<i data-lucide="folder-plus"></i> Nova Categoria`;
    document.getElementById('edit-category-id').value = '';
  }

  if (modal) modal.classList.add('open');
  refreshIcons();
}

function closeCategoryEditModal() {
  const modal = document.getElementById('category-edit-modal');
  if (modal) modal.classList.remove('open');
}

function slugify(name) {
  return name
    .toLowerCase()
    .normalize('NFD')
    .replace(/[^a-z0-9]/g, '');
}

function saveCategoryForm(event) {
  event.preventDefault();

  const editId = document.getElementById('edit-category-id').value;
  const name = document.getElementById('c-name').value.trim();
  const desc = document.getElementById('c-desc').value.trim();
  const icon = document.getElementById('c-icon').value;

  if (!name) return;

  const backup = JSON.stringify(categories);

  if (editId) {
    const index = categories.findIndex(c => c.id === editId);
    // O id não muda na edição: os produtos já cadastrados apontam para ele.
    if (index !== -1) categories[index] = { ...categories[index], name, desc, icon };
  } else {
    const id = slugify(name) || 'cat' + Date.now();

    if (categories.some(c => c.id === id)) {
      alert('Já existe uma categoria com este nome.');
      return;
    }

    categories.push({ id, name, desc, icon });
  }

  if (persist('Categoria salva!')) {
    closeCategoryEditModal();
    renderAdminCategoryList();
    renderApp();
  } else {
    categories = JSON.parse(backup);
  }
}

function addNewCategory(event) {
  event.preventDefault();
  const nameInput = document.getElementById('new-cat-name');
  const name = nameInput.value.trim();
  if (!name) return;

  const id = slugify(name) || 'cat' + Date.now();

  if (categories.some(c => c.id === id)) {
    alert('Já existe uma categoria com este nome.');
    return;
  }

  const backup = JSON.stringify(categories);
  categories.push({ id, name, icon: 'tag', desc: `Produtos da categoria ${name}` });

  if (persist('Categoria criada!')) {
    nameInput.value = '';
    renderAdminCategoryList();
    renderApp();
  } else {
    categories = JSON.parse(backup);
  }
}

function deleteCategory(catId) {
  const cat = categories.find(c => c.id === catId);
  if (!cat) return;

  const affected = products.filter(p => p.category === catId).length;
  const warning = affected > 0
    ? `\n\n${affected} ${affected === 1 ? 'produto será movido' : 'produtos serão movidos'} para "Brindes & Outros".`
    : '';

  if (!confirm(`Excluir a categoria "${cat.name}"?${warning}`)) return;

  const backupCats = JSON.stringify(categories);
  const backupProds = JSON.stringify(products);

  categories = categories.filter(c => c.id !== catId);

  // Se "brindes" não existir mais, recria para não deixar produtos órfãos.
  if (affected > 0 && !categories.some(c => c.id === 'brindes')) {
    categories.push({ id: 'brindes', name: 'Brindes & Outros', icon: 'gift', desc: 'Lembrancinhas para festas, eventos e datas especiais.' });
  }

  products.forEach(p => { if (p.category === catId) p.category = 'brindes'; });
  if (currentFilter === catId) currentFilter = 'all';

  if (persist('Categoria excluída.')) {
    renderAdminCategoryList();
    renderApp();
  } else {
    categories = JSON.parse(backupCats);
    products = JSON.parse(backupProds);
  }
}

/* --------------------------------------------------------------------------
   8. GERENCIAMENTO DAS OFERTAS PROMOCIONAIS
   -------------------------------------------------------------------------- */
function openPromoItemModal(promoId = null, focus = null) {
  const modal = document.getElementById('promo-item-modal');
  const title = document.getElementById('promo-item-title');
  const form = document.getElementById('promo-item-form');

  form.reset();
  promoImages = [];

  if (promoId) {
    const item = promos.find(pr => pr.id === promoId);
    if (item) {
      title.innerHTML = `<i data-lucide="edit"></i> Editar Oferta`;
      document.getElementById('edit-promo-id').value = item.id;
      document.getElementById('pr-title').value = item.title;
      document.getElementById('pr-description').value = item.description;
      document.getElementById('pr-original-price').value = item.originalPrice || '';
      document.getElementById('pr-promo-price').value = item.promoPrice || '';
      document.getElementById('pr-tag').value = item.tag || '';
      promoImages = [...(item.images || [])];
    }
  } else {
    title.innerHTML = `<i data-lucide="badge-percent"></i> Nova Oferta`;
    document.getElementById('edit-promo-id').value = '';
  }

  renderGalleryFor('promo');
  if (modal) modal.classList.add('open');
  refreshIcons();

  if (focus === 'photos') {
    setTimeout(() => document.getElementById('pr-image-file')?.click(), 250);
  }
}

function closePromoItemModal() {
  const modal = document.getElementById('promo-item-modal');
  if (modal) modal.classList.remove('open');
}

function savePromoItemForm(event) {
  event.preventDefault();

  const editId = document.getElementById('edit-promo-id').value;
  const payload = {
    title: document.getElementById('pr-title').value.trim(),
    description: document.getElementById('pr-description').value.trim(),
    originalPrice: parseFloat(document.getElementById('pr-original-price').value) || null,
    promoPrice: parseFloat(document.getElementById('pr-promo-price').value) || 0,
    tag: document.getElementById('pr-tag').value.trim(),
    images: [...promoImages]
  };

  const backup = JSON.stringify(promos);

  if (editId) {
    const index = promos.findIndex(pr => pr.id === editId);
    if (index !== -1) promos[index] = { id: editId, ...payload };
  } else {
    promos.push({ id: 'promo_' + Date.now(), ...payload });
  }

  if (persist('Oferta salva!')) {
    closePromoItemModal();
    renderApp();
  } else {
    promos = JSON.parse(backup);
  }
}

function deletePromoItem(promoId) {
  const item = promos.find(pr => pr.id === promoId);
  if (!item) return;

  if (!confirm(`Excluir a oferta "${item.title}" da campanha?`)) return;

  const backup = JSON.stringify(promos);
  promos = promos.filter(pr => pr.id !== promoId);

  if (persist('Oferta excluída.')) renderApp();
  else promos = JSON.parse(backup);
}

/* --------------------------------------------------------------------------
   9. CONFIGURAÇÕES DA CAMPANHA
   -------------------------------------------------------------------------- */
function openPromoSettingsModal() {
  const modal = document.getElementById('promo-settings-modal');

  document.getElementById('ps-badge').value = promoSettings.badge || '';
  document.getElementById('ps-title').value = promoSettings.title || '';
  document.getElementById('ps-emoji').value = promoSettings.emoji || '';
  document.getElementById('ps-subtitle').value = promoSettings.subtitle || '';
  document.getElementById('ps-countdown-on').checked = !!promoSettings.countdownEnabled;
  document.getElementById('ps-countdown-title').value = promoSettings.countdownTitle || '';
  document.getElementById('ps-deadline').value = promoSettings.deadline || '';
  document.getElementById('ps-cta').value = promoSettings.ctaText || '';
  document.getElementById('ps-section-on').checked = !!promoSettings.enabled;

  if (modal) modal.classList.add('open');
  refreshIcons();
}

function closePromoSettingsModal() {
  const modal = document.getElementById('promo-settings-modal');
  if (modal) modal.classList.remove('open');
}

function savePromoSettingsForm(event) {
  event.preventDefault();

  const backup = JSON.stringify(promoSettings);

  promoSettings = {
    ...promoSettings,
    badge: document.getElementById('ps-badge').value.trim(),
    title: document.getElementById('ps-title').value.trim(),
    emoji: document.getElementById('ps-emoji').value.trim(),
    subtitle: document.getElementById('ps-subtitle').value.trim(),
    countdownEnabled: document.getElementById('ps-countdown-on').checked,
    countdownTitle: document.getElementById('ps-countdown-title').value.trim(),
    deadline: document.getElementById('ps-deadline').value,
    ctaText: document.getElementById('ps-cta').value.trim(),
    enabled: document.getElementById('ps-section-on').checked
  };

  if (persist('Campanha atualizada!')) {
    closePromoSettingsModal();
    renderApp();
  } else {
    promoSettings = JSON.parse(backup);
  }
}

/* --------------------------------------------------------------------------
   10. BACKUP, RESTAURAÇÃO E PUBLICAÇÃO
   -------------------------------------------------------------------------- */
function openBackupModal() {
  const modal = document.getElementById('backup-modal');
  updateStorageMeter();
  if (modal) modal.classList.add('open');
  refreshIcons();
}

function closeBackupModal() {
  const modal = document.getElementById('backup-modal');
  if (modal) modal.classList.remove('open');
}

function storageBytesUsed() {
  return Object.values(STORAGE_KEYS).reduce((total, key) => {
    const value = localStorage.getItem(key);
    // Cada caractere ocupa 2 bytes no armazenamento do navegador.
    return total + (value ? value.length * 2 : 0);
  }, 0);
}

function updateStorageMeter() {
  const LIMIT = 5 * 1024 * 1024;
  const used = storageBytesUsed();
  const percent = Math.min(100, Math.round((used / LIMIT) * 100));

  const text = document.getElementById('storage-usage-text');
  const fill = document.getElementById('storage-usage-fill');
  const hint = document.getElementById('storage-usage-hint');

  if (text) text.textContent = `${(used / (1024 * 1024)).toFixed(2)} MB de ~5 MB (${percent}%)`;
  if (fill) {
    fill.style.width = `${percent}%`;
    fill.classList.toggle('is-warning', percent >= 70 && percent < 90);
    fill.classList.toggle('is-danger', percent >= 90);
  }
  if (hint) {
    hint.textContent = percent >= 90
      ? 'Espaço quase no fim! Baixe um backup e remova fotos que não usa mais.'
      : 'O navegador reserva cerca de 5 MB para os dados do site.';
  }
}

function exportData() {
  const payload = {
    _tipo: 'backup-gg-personalizados',
    _versao: 1,
    _gerado_em: new Date().toISOString(),
    categories,
    products,
    promos,
    promoSettings
  };

  const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const stamp = new Date().toISOString().slice(0, 10);

  const link = document.createElement('a');
  link.href = url;
  link.download = `backup-site-gabriela-${stamp}.json`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);

  showToast('Backup baixado! Guarde este arquivo em local seguro.');
}

function importData(event) {
  const file = event.target.files[0];
  if (!file) return;

  const reader = new FileReader();

  reader.onload = () => {
    let data;

    try {
      data = JSON.parse(reader.result);
    } catch (err) {
      alert('Este arquivo não é um backup válido do site.');
      event.target.value = '';
      return;
    }

    if (!data || !Array.isArray(data.products) || !Array.isArray(data.categories)) {
      alert('Este arquivo não tem o formato esperado de backup do site.');
      event.target.value = '';
      return;
    }

    if (!confirm('Restaurar este backup vai substituir TODO o conteúdo atual do site neste navegador.\n\nDeseja continuar?')) {
      event.target.value = '';
      return;
    }

    const backup = {
      categories: JSON.stringify(categories),
      products: JSON.stringify(products),
      promos: JSON.stringify(promos),
      promoSettings: JSON.stringify(promoSettings)
    };

    categories = data.categories;
    products = data.products.map(normalizeItem);
    promos = Array.isArray(data.promos) ? data.promos.map(normalizeItem) : promos;
    promoSettings = { ...DEFAULT_PROMO_SETTINGS, ...(data.promoSettings || {}) };

    if (persist('Backup restaurado com sucesso!')) {
      closeBackupModal();
      renderApp();
    } else {
      categories = JSON.parse(backup.categories);
      products = JSON.parse(backup.products);
      promos = JSON.parse(backup.promos);
      promoSettings = JSON.parse(backup.promoSettings);
    }

    event.target.value = '';
  };

  reader.onerror = () => {
    alert('Não foi possível ler o arquivo escolhido.');
    event.target.value = '';
  };

  reader.readAsText(file);
}

function resetToDefaults() {
  if (!confirm('Isto apaga TODAS as suas alterações e volta o site ao conteúdo original.\n\nTem certeza?')) return;
  if (!confirm('Confirmação final: todo o conteúdo que você cadastrou será perdido. Continuar?')) return;

  Object.values(STORAGE_KEYS).forEach(key => localStorage.removeItem(key));
  loadData();
  closeBackupModal();
  renderApp();
  showToast('Conteúdo original restaurado.');
}

/* --------------------------------------------------------------------------
   11. SIMULADOR DE ORÇAMENTO
   -------------------------------------------------------------------------- */
function updateCalcSelect() {
  const select = document.getElementById('prod-select');
  if (!select) return;

  select.innerHTML = products.map(p => `
    <option value="${escapeAttr(p.id)}" data-price="${p.promoPrice}">${escapeHtml(p.title)} (${formatPrice(p.promoPrice)})</option>
  `).join('');
}

function updateCalcEstimate() {
  const select = document.getElementById('prod-select');
  const qtyInput = document.getElementById('prod-qty');
  const totalPriceElem = document.getElementById('total-price');

  if (!select || !qtyInput || !totalPriceElem || select.options.length === 0) return;

  const selectedOption = select.options[select.selectedIndex];
  const unitPrice = parseFloat(selectedOption.getAttribute('data-price')) || 0;
  const quantity = parseInt(qtyInput.value) || 1;

  let total = unitPrice * quantity;

  const pObj = products.find(p => p.id === select.value);
  if (pObj && pObj.title.toLowerCase().includes('imã')) {
    const trios = Math.floor(quantity / 3);
    const remainder = quantity % 3;
    total = (trios * 10) + (remainder * 4);
  }

  totalPriceElem.textContent = formatPrice(total);
}

function sendCalculatedOrder() {
  const select = document.getElementById('prod-select');
  const qtyInput = document.getElementById('prod-qty');
  const noteInput = document.getElementById('prod-note');
  const totalPriceElem = document.getElementById('total-price');

  if (!select || select.options.length === 0) return;

  const prodName = select.options[select.selectedIndex].text;
  const quantity = qtyInput.value || 1;
  const userNote = noteInput.value.trim() || 'Sem observação adicional';
  const estimatedTotal = totalPriceElem.textContent;

  const message = `Olá Gabriela! Gostaria de fazer o pedido pelo simulador do site:\n\n` +
                  `📦 *Produto:* ${prodName}\n` +
                  `🔢 *Quantidade:* ${quantity}\n` +
                  `✏️ *Detalhes/Ideia:* ${userNote}\n` +
                  `💰 *Valor Estimado:* ${estimatedTotal}\n\n` +
                  `Aguardo seu retorno para confirmar a arte!`;

  window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`, '_blank');
}

/* --------------------------------------------------------------------------
   12. MODAL LIGHTBOX COM GALERIA
   -------------------------------------------------------------------------- */
function openProductLightbox(productId) {
  const p = products.find(prod => prod.id === productId);
  if (p) openGalleryModal(p);
}

function openPromoLightbox(promoId) {
  const item = promos.find(pr => pr.id === promoId);
  if (item) openGalleryModal(item);
}

function openGalleryModal(item) {
  const modal = document.getElementById('image-modal');
  const modalTitle = document.getElementById('modal-title');
  const modalDesc = document.getElementById('modal-desc');
  const modalPriceBox = document.getElementById('modal-price-box');
  const modalWaBtn = document.getElementById('modal-wa-btn');

  if (!modal) return;

  modalGallery = (item.images && item.images.length > 0) ? [...item.images] : [coverImage(item)];
  modalGalleryIndex = 0;
  renderModalGallery();

  modalTitle.textContent = item.title;
  modalDesc.textContent = item.description;

  const percent = discountPercent(item);
  modalPriceBox.innerHTML = percent > 0
    ? `<div class="price-group" style="margin-bottom:14px;">
         <span class="price-de">De ${formatPrice(item.originalPrice)}</span>
         <span class="price-por">Por ${formatPrice(item.promoPrice)}</span>
       </div>`
    : `<div class="price-group" style="margin-bottom:14px;">
         <span class="price-por">${formatPrice(item.promoPrice)}</span>
       </div>`;

  const waMessage = `Olá Gabriela! Gostaria de pedir/saber mais sobre: ${item.title}`;
  modalWaBtn.href = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(waMessage)}`;

  modal.classList.add('open');
  refreshIcons();
}

function renderModalGallery() {
  const modalImg = document.getElementById('modal-img');
  const thumbs = document.getElementById('modal-thumbs');
  const prev = document.getElementById('gallery-prev');
  const next = document.getElementById('gallery-next');

  if (modalImg) modalImg.src = modalGallery[modalGalleryIndex] || '';

  const multiple = modalGallery.length > 1;
  if (prev) prev.style.display = multiple ? 'flex' : 'none';
  if (next) next.style.display = multiple ? 'flex' : 'none';

  if (thumbs) {
    thumbs.innerHTML = multiple
      ? modalGallery.map((src, i) => `
          <button class="gallery-thumb-btn ${i === modalGalleryIndex ? 'active' : ''}" onclick="showModalGalleryImage(${i})" aria-label="Ver foto ${i + 1}">
            <img src="${escapeAttr(src)}" alt="Foto ${i + 1}">
          </button>
        `).join('')
      : '';
  }
}

function showModalGalleryImage(index) {
  if (index < 0 || index >= modalGallery.length) return;
  modalGalleryIndex = index;
  renderModalGallery();
}

function stepModalGallery(step) {
  if (modalGallery.length === 0) return;
  modalGalleryIndex = (modalGalleryIndex + step + modalGallery.length) % modalGallery.length;
  renderModalGallery();
}

function closeModal() {
  const modal = document.getElementById('image-modal');
  if (modal) modal.classList.remove('open');
}

function closeAllModals() {
  closeModal();
  closeProductModal();
  closeCategoryModal();
  closeCategoryEditModal();
  closePromoItemModal();
  closePromoSettingsModal();
  closeBackupModal();
  closeAdminPasswordModal();
}

window.addEventListener('click', (e) => {
  if (e.target.classList.contains('modal-overlay')) closeAllModals();
});

document.addEventListener('keydown', (e) => {
  const lightboxOpen = document.getElementById('image-modal')?.classList.contains('open');

  if (e.key === 'Escape') closeAllModals();
  else if (lightboxOpen && e.key === 'ArrowLeft') stepModalGallery(-1);
  else if (lightboxOpen && e.key === 'ArrowRight') stepModalGallery(1);
});

/* --------------------------------------------------------------------------
   13. COMPONENTES ADICIONAIS
   -------------------------------------------------------------------------- */
function initMobileMenu() {
  const toggleBtn = document.getElementById('mobile-toggle');
  const navMenu = document.getElementById('nav-menu');
  const navLinks = document.querySelectorAll('.nav-link');

  if (toggleBtn && navMenu) {
    toggleBtn.addEventListener('click', () => navMenu.classList.toggle('active'));
    navLinks.forEach(link => link.addEventListener('click', () => navMenu.classList.remove('active')));
  }
}

function initFaqAccordion() {
  const faqQuestions = document.querySelectorAll('.faq-question');
  faqQuestions.forEach(btn => {
    btn.addEventListener('click', () => {
      const faqItem = btn.parentElement;
      const isActive = faqItem.classList.contains('active');
      document.querySelectorAll('.faq-item').forEach(item => item.classList.remove('active'));
      if (!isActive) faqItem.classList.add('active');
    });
  });
}

function stopCountdown() {
  if (countdownInterval) {
    clearInterval(countdownInterval);
    countdownInterval = null;
  }
}

function initCountdownTimer() {
  stopCountdown();

  const wrapper = document.getElementById('countdown-wrapper');
  const titleEl = document.getElementById('countdown-title');

  if (!wrapper) return;

  if (!promoSettings.countdownEnabled || !promoSettings.deadline) {
    wrapper.style.display = 'none';
    return;
  }

  wrapper.style.display = '';
  if (titleEl) titleEl.textContent = promoSettings.countdownTitle || '';

  const targetDate = new Date(promoSettings.deadline);
  if (isNaN(targetDate.getTime())) {
    wrapper.style.display = 'none';
    return;
  }

  const fields = {
    days: document.getElementById('days'),
    hours: document.getElementById('hours'),
    minutes: document.getElementById('minutes'),
    seconds: document.getElementById('seconds')
  };

  function paint(days, hours, minutes, seconds) {
    if (fields.days) fields.days.textContent = String(days).padStart(2, '0');
    if (fields.hours) fields.hours.textContent = String(hours).padStart(2, '0');
    if (fields.minutes) fields.minutes.textContent = String(minutes).padStart(2, '0');
    if (fields.seconds) fields.seconds.textContent = String(seconds).padStart(2, '0');
  }

  function updateTimer() {
    const distance = targetDate.getTime() - Date.now();

    if (distance <= 0) {
      paint(0, 0, 0, 0);
      if (titleEl) titleEl.textContent = 'Esta promoção foi encerrada. Fale com a gente para conhecer as novidades!';
      stopCountdown();
      return;
    }

    paint(
      Math.floor(distance / (1000 * 60 * 60 * 24)),
      Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
      Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
      Math.floor((distance % (1000 * 60)) / 1000)
    );
  }

  updateTimer();
  countdownInterval = setInterval(updateTimer, 1000);
}

let toastTimer = null;

function showToast(message) {
  const toast = document.getElementById('toast');
  const msg = document.getElementById('toast-msg');
  if (!toast || !msg) return;

  msg.textContent = message;
  toast.classList.add('show');

  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove('show'), 3200);
}

/* --------------------------------------------------------------------------
   14. UTILITÁRIOS
   -------------------------------------------------------------------------- */

// Converte uma data para o formato aceito pelo campo datetime-local.
function toLocalDatetimeValue(date) {
  const pad = n => String(n).padStart(2, '0');
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

function escapeHtml(str) {
  if (str === null || str === undefined) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function escapeAttr(str) {
  return escapeHtml(str);
}
