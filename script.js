/* ==========================================================================
   GG GABRIELA GARCIA - INTERACTIVE JAVASCRIPT & SECURE ADMIN (V4)
   ========================================================================== */

const WHATSAPP_NUMBER = '5591982047600';

/* O conteúdo do site (categorias, produtos, ofertas e campanha) fica no
   servidor, não mais no navegador. Esta página conversa com a API:

     GET  /api/content  -> conteúdo publicado, que todo visitante enxerga
     PUT  /api/content  -> publica as alterações (exige estar logada)
     POST /api/upload   -> envia uma foto e devolve o endereço dela
     POST /api/login    -> troca a senha por um token de 12 horas

   Se a API estiver fora do ar, a página usa o último conteúdo que viu
   (guardado no navegador) e, na falta dele, o arquivo dados-iniciais.json.
   Assim o site nunca aparece vazio para um cliente. */

const API = {
  conteudo: '/api/content',
  login: '/api/login',
  upload: '/api/upload'
};

const ARQUIVO_INICIAL = './dados-iniciais.json';
const CACHE_KEY = 'gg_cache_conteudo';
const TOKEN_KEY = 'gg_token';

// Só define os campos esperados da campanha; os textos vêm do servidor.
const PROMO_SETTINGS_PADRAO = {
  enabled: true,
  badge: '',
  title: '',
  emoji: '',
  subtitle: '',
  countdownEnabled: true,
  countdownTitle: '',
  deadline: '',
  ctaText: ''
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

// Situação do servidor, descoberta no carregamento
let backendOnline = false;
let backendPublicavel = false;
let authToken = lerToken();

document.addEventListener('DOMContentLoaded', async () => {
  initMobileMenu();
  initFaqAccordion();
  await loadData();
  renderApp();
});

/* --------------------------------------------------------------------------
   1. CONTEÚDO: LEITURA E PUBLICAÇÃO
   -------------------------------------------------------------------------- */

/* Cada foto é guardada como { url, thumb }: a versão grande abre no
   lightbox e a miniatura (bem mais leve) aparece nas faixas dos cards.
   Formatos antigos continuam valendo — texto solto vira {url, thumb} igual. */
function normalizeImage(entrada) {
  if (typeof entrada === 'string') {
    const url = entrada.trim();
    return url ? { url, thumb: url } : null;
  }

  if (entrada && typeof entrada === 'object' && typeof entrada.url === 'string') {
    const url = entrada.url.trim();
    if (!url) return null;
    return { url, thumb: (entrada.thumb || url).trim() || url };
  }

  return null;
}

// Aceita tanto o formato antigo (image: '...') quanto o novo (images: [...])
function normalizeItem(item) {
  let brutas = [];

  if (Array.isArray(item.images)) brutas = item.images;
  else if (item.image) brutas = [item.image];

  const images = brutas.map(normalizeImage).filter(Boolean);

  const normalized = { ...item, images };
  delete normalized.image;
  return normalized;
}

function imgUrl(foto) {
  return (foto && foto.url) || '';
}

function imgThumb(foto) {
  return (foto && (foto.thumb || foto.url)) || '';
}

function conteudoAtual() {
  return { categories, products, promos, promoSettings };
}

function aplicaConteudo(conteudo) {
  categories = Array.isArray(conteudo.categories) ? conteudo.categories : [];
  products = Array.isArray(conteudo.products) ? conteudo.products.map(normalizeItem) : [];
  promos = Array.isArray(conteudo.promos) ? conteudo.promos.map(normalizeItem) : [];
  promoSettings = { ...PROMO_SETTINGS_PADRAO, ...(conteudo.promoSettings || {}) };

  // Sem prazo definido, o contador vale 8 dias a partir de agora.
  if (!promoSettings.deadline) {
    const alvo = new Date();
    alvo.setDate(alvo.getDate() + 8);
    alvo.setHours(23, 59, 59, 0);
    promoSettings.deadline = toLocalDatetimeValue(alvo);
  }
}

function guardaCache(conteudo) {
  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify(conteudo));
  } catch (err) {
    // Cache cheio não é problema: o servidor continua sendo a fonte da verdade.
    console.warn('Não foi possível guardar o cache local.', err);
  }
}

function leCache() {
  try {
    const bruto = localStorage.getItem(CACHE_KEY);
    return bruto ? JSON.parse(bruto) : null;
  } catch {
    return null;
  }
}

function lerToken() {
  try {
    return sessionStorage.getItem(TOKEN_KEY) || '';
  } catch {
    return '';
  }
}

function guardaToken(token) {
  authToken = token;
  try {
    sessionStorage.setItem(TOKEN_KEY, token);
  } catch (err) {
    console.warn('Não foi possível guardar a sessão.', err);
  }
}

function limpaToken() {
  authToken = '';
  try {
    sessionStorage.removeItem(TOKEN_KEY);
  } catch {
    /* nada a fazer */
  }
}

async function buscaConteudoInicial() {
  const resposta = await fetch(ARQUIVO_INICIAL, { cache: 'no-store' });
  if (!resposta.ok) throw new Error(`Falha ao ler o conteúdo inicial (${resposta.status}).`);
  return resposta.json();
}

async function loadData() {
  let conteudo = null;

  try {
    const resposta = await fetch(API.conteudo, { cache: 'no-store' });

    if (resposta.ok) {
      const dados = await resposta.json();
      backendOnline = true;
      backendPublicavel = Boolean(dados.armazenamento && dados.armazenamento.publicavel);
      conteudo = dados.conteudo;
      if (conteudo) guardaCache(conteudo);
    }
  } catch (err) {
    console.warn('Servidor de conteúdo indisponível; usando cópia local.', err);
  }

  // Servidor fora do ar: mostra a última versão conhecida.
  if (!conteudo && !backendOnline) conteudo = leCache();

  // Primeira publicação ainda não aconteceu (ou nada em cache).
  if (!conteudo) {
    try {
      conteudo = await buscaConteudoInicial();
    } catch (err) {
      console.error(err);
      conteudo = { categories: [], products: [], promos: [], promoSettings: {} };
    }
  }

  aplicaConteudo(conteudo);
}

// Publica o conteúdo atual. Devolve true quando o servidor confirmou.
async function persist(mensagemSucesso) {
  if (!backendOnline) {
    alert(
      'O site não conseguiu falar com o servidor.\n\n' +
      'A alteração NÃO foi publicada. Verifique sua conexão e tente de novo.'
    );
    return false;
  }

  if (!authToken) {
    alert('Sua sessão expirou. Entre novamente na área restrita para publicar.');
    exitAdminMode();
    return false;
  }

  let publicou = false;
  mostraPublicando(true);

  try {
    const resposta = await fetch(API.conteudo, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${authToken}`
      },
      body: JSON.stringify(conteudoAtual())
    });

    if (resposta.status === 401) {
      limpaToken();
      alert('Sua sessão expirou. Entre novamente para continuar publicando.');
      exitAdminMode();
    } else if (!resposta.ok) {
      const dados = await resposta.json().catch(() => ({}));
      alert(`Não foi possível publicar.\n\n${dados.erro || `Erro ${resposta.status}.`}`);
    } else {
      guardaCache(conteudoAtual());
      publicou = true;
    }
  } catch (err) {
    console.error(err);
    alert('Não foi possível publicar. Verifique sua conexão e tente de novo.');
  } finally {
    mostraPublicando(false);
  }

  if (publicou && mensagemSucesso) showToast(mensagemSucesso);
  return publicou;
}

/* Antes desta versão, tudo era salvo no navegador. Se ainda houver conteúdo
   guardado por lá, oferecemos publicá-lo em vez de deixá-lo se perder. */
const CHAVES_ANTIGAS = {
  categories: 'gg_categories',
  products: 'gg_products',
  promos: 'gg_promos',
  promoSettings: 'gg_promo_settings'
};

function leConteudoAntigo() {
  try {
    const produtos = JSON.parse(localStorage.getItem(CHAVES_ANTIGAS.products) || 'null');
    if (!Array.isArray(produtos) || produtos.length === 0) return null;

    return {
      categories: JSON.parse(localStorage.getItem(CHAVES_ANTIGAS.categories) || 'null') || categories,
      products: produtos,
      promos: JSON.parse(localStorage.getItem(CHAVES_ANTIGAS.promos) || 'null') || promos,
      promoSettings: JSON.parse(localStorage.getItem(CHAVES_ANTIGAS.promoSettings) || 'null') || promoSettings
    };
  } catch (err) {
    console.warn('Conteúdo antigo ilegível.', err);
    return null;
  }
}

function descartaConteudoAntigo() {
  Object.values(CHAVES_ANTIGAS).forEach(chave => {
    try {
      localStorage.removeItem(chave);
    } catch {
      /* nada a fazer */
    }
  });
}

async function ofereceMigracao() {
  const antigo = leConteudoAntigo();
  if (!antigo) return;

  const totalFotos = antigo.products.reduce(
    (soma, p) => soma + (Array.isArray(p.images) ? p.images.length : (p.image ? 1 : 0)),
    0
  );

  const querPublicar = confirm(
    `Encontramos ${antigo.products.length} produtos e ${totalFotos} fotos que você cadastrou ` +
    `neste navegador na versão anterior do site, e que os clientes nunca chegaram a ver.\n\n` +
    `Deseja publicá-los agora, para que fiquem visíveis para todo mundo?\n\n` +
    `(Se escolher "Cancelar", esse conteúdo será descartado.)`
  );

  if (!querPublicar) {
    if (confirm('Tem certeza? O conteúdo antigo deste navegador será apagado.')) descartaConteudoAntigo();
    return;
  }

  const anterior = JSON.stringify(conteudoAtual());
  aplicaConteudo(antigo);

  // As fotos antigas viraram texto embutido; sobem para o servidor uma a uma.
  mostraProgresso('Enviando fotos antigas para o servidor...');

  try {
    for (const item of [...products, ...promos]) {
      const enviadas = [];

      for (const foto of item.images) {
        if (!imgUrl(foto).startsWith('data:')) {
          enviadas.push(foto);
          continue;
        }

        const mini = await reduzDataUrl(imgUrl(foto), 320, 0.7);
        enviadas.push(await enviaFoto(imgUrl(foto), mini));
      }

      item.images = enviadas;
    }
  } catch (err) {
    console.error(err);
    escondeProgresso();
    alert(`Não foi possível enviar todas as fotos antigas.\n\n${err.message}\n\nNada foi publicado.`);
    aplicaConteudo(JSON.parse(anterior));
    return;
  }

  escondeProgresso();

  if (await persist('Conteúdo antigo publicado! Agora seus clientes conseguem ver.')) {
    descartaConteudoAntigo();
    renderApp();
  } else {
    aplicaConteudo(JSON.parse(anterior));
  }
}

// Envia a foto (e a miniatura) e devolve os endereços públicos.
async function enviaFoto(dataUrl, miniatura = null) {
  const resposta = await fetch(API.upload, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${authToken}`
    },
    body: JSON.stringify({ arquivo: dataUrl, miniatura })
  });

  if (!resposta.ok) {
    const dados = await resposta.json().catch(() => ({}));
    throw new Error(dados.erro || `Falha ao enviar a foto (erro ${resposta.status}).`);
  }

  const { url, thumb } = await resposta.json();
  return { url, thumb: thumb || url };
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

const FOTO_RESERVA = './3f7b4bd0-54a9-4490-96f7-d2e134892c30.jpg';

function coverImage(item) {
  return imgUrl(item.images && item.images[0]) || FOTO_RESERVA;
}

function formatPrice(value) {
  return `R$ ${parseFloat(value || 0).toFixed(2).replace('.', ',')}`;
}

// Faixa com TODAS as fotos do item, direto no card: clicar troca a foto grande.
function renderCardStrip(item) {
  const images = item.images || [];
  if (images.length < 2) return '';

  return `
    <div class="card-gallery-strip" role="group" aria-label="Fotos de ${escapeAttr(item.title)}">
      ${images.map((foto, i) => `
        <button type="button" class="card-thumb ${i === 0 ? 'active' : ''}" data-grande="${escapeAttr(imgUrl(foto))}" onclick="setCardPhoto(event)" aria-label="Ver foto ${i + 1} de ${images.length}">
          <img src="${escapeAttr(imgThumb(foto))}" alt="" loading="lazy">
        </button>
      `).join('')}
    </div>
  `;
}

function setCardPhoto(event) {
  const button = event.currentTarget;
  const strip = button.parentElement;
  const card = strip.closest('.portfolio-card-clean, .promo-product-card');
  if (!card) return;

  // Usa a versão grande guardada no botão, não a miniatura que ele exibe.
  const mainImage = card.querySelector('.portfolio-img-container img, .promo-img-box img');
  const grande = button.dataset.grande;
  if (mainImage && grande) mainImage.src = grande;

  strip.querySelectorAll('.card-thumb').forEach(btn => btn.classList.remove('active'));
  button.classList.add('active');
}

// Descobre qual foto do card está selecionada, para o lightbox abrir na mesma.
function activeCardPhotoIndex(event) {
  if (!event) return 0;

  const card = event.currentTarget.closest('.portfolio-card-clean, .promo-product-card');
  const active = card?.querySelector('.card-thumb.active');
  if (!active) return 0;

  return Array.from(active.parentElement.children).indexOf(active);
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
            <button class="zoom-btn" onclick="openProductLightbox('${escapeAttr(p.id)}', event)">
              <i data-lucide="zoom-in"></i> Ver Detalhes
            </button>
          </div>
        </div>

        ${renderCardStrip(p)}

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
        <div class="promo-img-box" onclick="openPromoLightbox('${escapeAttr(item.id)}', event)">
          <img src="${escapeAttr(coverImage(item))}" alt="${escapeAttr(item.title)}" loading="lazy">
          ${tagText ? `<span class="tag-discount">${escapeHtml(tagText)}</span>` : ''}
          ${photoCount > 1 ? `<span class="card-badge-photos"><i data-lucide="images"></i> ${photoCount}</span>` : ''}
        </div>
        ${renderCardStrip(item)}
        <div class="promo-card-body">
          <h3>${escapeHtml(item.title)}</h3>
          <p>${escapeHtml(item.description)}</p>
          <div class="price-box">
            ${priceHTML}
          </div>
          <a href="${waUrl}" target="_blank" class="btn btn-sm btn-primary">
            <i data-lucide="shopping-bag"></i> ${escapeHtml(item.buttonText || 'Encomendar')}
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

// A senha é conferida no servidor: ela não existe mais no código da página.
async function verifyAdminPassword(event) {
  event.preventDefault();

  const input = document.getElementById('admin-pass-input');
  const botao = event.target.querySelector('button[type="submit"]');
  const senha = input.value.trim();

  if (!backendOnline) {
    alert(
      'O site não conseguiu falar com o servidor.\n\n' +
      'Sem ele não é possível publicar alterações. Tente novamente em instantes.'
    );
    return;
  }

  if (botao) botao.disabled = true;

  try {
    const resposta = await fetch(API.login, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ senha })
    });

    const dados = await resposta.json().catch(() => ({}));

    if (!resposta.ok) {
      alert(dados.erro || 'Senha incorreta! Acesso negado.');
      return;
    }

    guardaToken(dados.token);
    backendPublicavel = Boolean(dados.armazenamento && dados.armazenamento.publicavel);

    isAdminMode = true;
    input.value = '';
    closeAdminPasswordModal();
    updateAdminVisibility();
    renderApp();

    showToast('Modo administrativo ativado. Bom trabalho, Gabriela!');

    // Se o envio das fotos falhar, a migração reverte e nada é descartado.
    await ofereceMigracao();

    if (!backendPublicavel) {
      alert(
        'Atenção: o armazenamento de fotos ainda não foi configurado neste site.\n\n' +
        'Os textos e preços serão publicados normalmente, mas fotos novas podem falhar. ' +
        'Peça para configurar o Vercel Blob.'
      );
    }
  } catch (err) {
    console.error(err);
    alert('Não foi possível entrar. Verifique sua conexão e tente de novo.');
  } finally {
    if (botao) botao.disabled = false;
  }
}

function exitAdminMode() {
  isAdminMode = false;
  limpaToken();
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
// Redesenha a imagem num tamanho menor e devolve o JPEG resultante.
function reduzDataUrl(dataUrl, maxDimension, quality, nome = 'a imagem') {
  return new Promise((resolve, reject) => {
    const img = new Image();

    img.onerror = () => reject(new Error(`"${nome}" não parece ser uma imagem válida.`));
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
      // Fundo branco: PNG com transparência ficaria preto ao virar JPEG.
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, width, height);
      ctx.drawImage(img, 0, 0, width, height);

      resolve(canvas.toDataURL('image/jpeg', quality));
    };

    img.src = dataUrl;
  });
}

function compressImage(file, maxDimension = 1200, quality = 0.82) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onerror = () => reject(new Error(`Não foi possível ler "${file.name}".`));
    reader.onload = () => {
      reduzDataUrl(reader.result, maxDimension, quality, file.name).then(resolve, reject);
    };

    reader.readAsDataURL(file);
  });
}

async function handleImageFiles(event, targetList, renderFn) {
  const files = Array.from(event.target.files || []);
  if (files.length === 0) return;

  let enviadas = 0;
  let posicao = 0;

  for (const file of files) {
    posicao++;
    mostraProgresso(`Enviando foto ${posicao} de ${files.length}...`);

    try {
      /* Reduz no navegador e sobe duas versões: a grande, que abre ao clicar,
         e uma miniatura de 320px. Sem a miniatura, a faixa de fotos do card
         baixaria a imagem inteira só para mostrá-la com 46 pixels — com
         muitas fotos isso vira dezenas de MB no celular do cliente. */
      const grande = await compressImage(file, 1200, 0.82);
      const mini = await compressImage(file, 320, 0.7);

      targetList.push(await enviaFoto(grande, mini));
      enviadas++;
      renderFn();
    } catch (err) {
      console.error(err);
      alert(`Não foi possível enviar "${file.name}".\n\n${err.message}`);
    }
  }

  event.target.value = '';
  renderFn();
  escondeProgresso();

  if (enviadas > 0) {
    showToast(`${enviadas} ${enviadas === 1 ? 'foto enviada' : 'fotos enviadas'}. Agora clique em Salvar.`);
  }
}

function renderGalleryPreview(containerId, list, kind) {
  const container = document.getElementById(containerId);
  if (!container) return;

  if (list.length === 0) {
    container.innerHTML = `<p class="gallery-empty">Nenhuma foto ainda. Use o botão acima para escolher.</p>`;
    return;
  }

  container.innerHTML = list.map((foto, index) => `
    <div class="gallery-thumb ${index === 0 ? 'is-cover' : ''}" onclick="setGalleryCover('${kind}', ${index})" title="${index === 0 ? 'Foto de capa' : 'Clique para tornar esta a capa'}">
      <img src="${escapeAttr(imgThumb(foto))}" alt="Foto ${index + 1}" loading="lazy">
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

  // Endereço colado de fora: não temos miniatura, a própria imagem serve.
  list.push({ url, thumb: url });
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

async function saveProductForm(event) {
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

  if (await persist('Produto salvo e publicado!')) {
    closeProductModal();
    renderApp();
  } else {
    products = JSON.parse(backup);
  }
}

async function deleteProduct(productId) {
  const product = products.find(p => p.id === productId);
  if (!product) return;

  if (!confirm(`Excluir o produto "${product.title}"?\n\nEsta ação não pode ser desfeita.`)) return;

  const backup = JSON.stringify(products);
  products = products.filter(p => p.id !== productId);

  if (await persist('Produto excluído.')) renderApp();
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

async function saveCategoryForm(event) {
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

  if (await persist('Categoria salva e publicada!')) {
    closeCategoryEditModal();
    renderAdminCategoryList();
    renderApp();
  } else {
    categories = JSON.parse(backup);
  }
}

async function addNewCategory(event) {
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

  if (await persist('Categoria criada e publicada!')) {
    nameInput.value = '';
    renderAdminCategoryList();
    renderApp();
  } else {
    categories = JSON.parse(backup);
  }
}

async function deleteCategory(catId) {
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

  if (await persist('Categoria excluída.')) {
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
      document.getElementById('pr-button').value = item.buttonText || '';
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

async function savePromoItemForm(event) {
  event.preventDefault();

  const editId = document.getElementById('edit-promo-id').value;
  const payload = {
    title: document.getElementById('pr-title').value.trim(),
    description: document.getElementById('pr-description').value.trim(),
    originalPrice: parseFloat(document.getElementById('pr-original-price').value) || null,
    promoPrice: parseFloat(document.getElementById('pr-promo-price').value) || 0,
    tag: document.getElementById('pr-tag').value.trim(),
    buttonText: document.getElementById('pr-button').value.trim(),
    images: [...promoImages]
  };

  const backup = JSON.stringify(promos);

  if (editId) {
    const index = promos.findIndex(pr => pr.id === editId);
    if (index !== -1) promos[index] = { id: editId, ...payload };
  } else {
    promos.push({ id: 'promo_' + Date.now(), ...payload });
  }

  if (await persist('Oferta salva e publicada!')) {
    closePromoItemModal();
    renderApp();
  } else {
    promos = JSON.parse(backup);
  }
}

async function deletePromoItem(promoId) {
  const item = promos.find(pr => pr.id === promoId);
  if (!item) return;

  if (!confirm(`Excluir a oferta "${item.title}" da campanha?`)) return;

  const backup = JSON.stringify(promos);
  promos = promos.filter(pr => pr.id !== promoId);

  if (await persist('Oferta excluída.')) renderApp();
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

async function savePromoSettingsForm(event) {
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

  if (await persist('Campanha atualizada e publicada!')) {
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

// Mostra, no modal de backup, se o site está mesmo publicando.
function updateStorageMeter() {
  const texto = document.getElementById('storage-usage-text');
  const dica = document.getElementById('storage-usage-hint');
  const caixa = document.getElementById('backend-status');

  const totalFotos = [...products, ...promos]
    .reduce((soma, item) => soma + (item.images || []).length, 0);

  if (texto) {
    texto.textContent = `${products.length} produtos, ${promos.length} ofertas, ${totalFotos} fotos`;
  }

  if (dica) {
    dica.textContent = backendOnline
      ? 'Tudo o que você salva vai direto para o ar, para todos os clientes.'
      : 'O servidor não respondeu. As alterações não serão publicadas agora.';
  }

  if (caixa) {
    const ok = backendOnline && backendPublicavel;

    caixa.className = `alert-box ${ok ? 'alert-ok' : 'alert-warning'}`;
    caixa.innerHTML = ok
      ? `<i data-lucide="check-circle"></i>
         <div><strong>Publicação ativa.</strong> As alterações que você salva aparecem
         imediatamente para qualquer pessoa que abrir o site, em qualquer aparelho.</div>`
      : `<i data-lucide="alert-triangle"></i>
         <div><strong>Publicação indisponível no momento.</strong> ${backendOnline
           ? 'O armazenamento de fotos ainda não foi configurado neste site.'
           : 'O site não conseguiu falar com o servidor.'}
         Baixe um backup antes de fechar a página para não perder nada.</div>`;
  }

  refreshIcons();
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

  reader.onload = async () => {
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

    if (!confirm('Restaurar este backup vai substituir TODO o conteúdo do site publicado.\n\nDeseja continuar?')) {
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
    promoSettings = { ...PROMO_SETTINGS_PADRAO, ...(data.promoSettings || {}) };

    if (await persist('Backup restaurado e publicado!')) {
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

async function resetToDefaults() {
  if (!confirm('Isto apaga TODAS as suas alterações e volta o site ao conteúdo original.\n\nTem certeza?')) return;
  if (!confirm('Confirmação final: todo o conteúdo que você cadastrou será perdido, inclusive para os clientes. Continuar?')) return;

  const anterior = JSON.stringify(conteudoAtual());

  try {
    aplicaConteudo(await buscaConteudoInicial());
  } catch (err) {
    console.error(err);
    alert('Não foi possível ler o conteúdo original do site.');
    return;
  }

  if (await persist('Conteúdo original restaurado e publicado.')) {
    closeBackupModal();
    renderApp();
  } else {
    aplicaConteudo(JSON.parse(anterior));
  }
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
function openProductLightbox(productId, event) {
  const p = products.find(prod => prod.id === productId);
  if (p) openGalleryModal(p, activeCardPhotoIndex(event));
}

function openPromoLightbox(promoId, event) {
  const item = promos.find(pr => pr.id === promoId);
  if (item) openGalleryModal(item, activeCardPhotoIndex(event));
}

function openGalleryModal(item, startIndex = 0) {
  const modal = document.getElementById('image-modal');
  const modalTitle = document.getElementById('modal-title');
  const modalDesc = document.getElementById('modal-desc');
  const modalPriceBox = document.getElementById('modal-price-box');
  const modalWaBtn = document.getElementById('modal-wa-btn');

  if (!modal) return;

  modalGallery = (item.images && item.images.length > 0)
    ? [...item.images]
    : [{ url: coverImage(item), thumb: coverImage(item) }];
  modalGalleryIndex = (startIndex >= 0 && startIndex < modalGallery.length) ? startIndex : 0;
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

  if (modalImg) modalImg.src = imgUrl(modalGallery[modalGalleryIndex]);

  const multiple = modalGallery.length > 1;
  if (prev) prev.style.display = multiple ? 'flex' : 'none';
  if (next) next.style.display = multiple ? 'flex' : 'none';

  if (thumbs) {
    thumbs.innerHTML = multiple
      ? modalGallery.map((foto, i) => `
          <button class="gallery-thumb-btn ${i === modalGalleryIndex ? 'active' : ''}" onclick="showModalGalleryImage(${i})" aria-label="Ver foto ${i + 1} de ${modalGallery.length}">
            <img src="${escapeAttr(imgThumb(foto))}" alt="Foto ${i + 1}" loading="lazy">
          </button>
        `).join('')
      : '';

    // Mantém a miniatura da foto atual sempre à vista na faixa rolável.
    thumbs.querySelector('.gallery-thumb-btn.active')
      ?.scrollIntoView({ block: 'nearest', inline: 'center' });
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

// Aviso que fica na tela enquanto algo demorado acontece (envio ou publicação).
function mostraProgresso(mensagem) {
  const toast = document.getElementById('toast');
  const msg = document.getElementById('toast-msg');
  if (!toast || !msg) return;

  clearTimeout(toastTimer);
  msg.textContent = mensagem;
  toast.classList.add('show', 'is-busy');
}

function escondeProgresso() {
  const toast = document.getElementById('toast');
  if (!toast) return;

  toast.classList.remove('is-busy');
  if (!toastTimer) toast.classList.remove('show');
}

function mostraPublicando(ativo) {
  if (ativo) mostraProgresso('Publicando alterações...');
  else escondeProgresso();
}

function showToast(message) {
  const toast = document.getElementById('toast');
  const msg = document.getElementById('toast-msg');
  if (!toast || !msg) return;

  msg.textContent = message;
  toast.classList.add('show');
  toast.classList.remove('is-busy');

  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => {
    toast.classList.remove('show');
    toastTimer = null;
  }, 3200);
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
