/* ==========================================================================
   GG GABRIELA GARCIA - INTERACTIVE JAVASCRIPT & SECURE ADMIN (V3)
   ========================================================================== */

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
    image: './6ab20412-d3f5-4cee-9a89-a68b250e496b.jpg'
  },
  {
    id: 'p2',
    category: 'canecas',
    title: 'Xícaras Alça de Coração',
    description: 'Modelo romântico e delicado para casais, mensagens afetivas, Snoopy ou personagens. Incluso arte e embalagem especial.',
    originalPrice: 50.00,
    promoPrice: 45.00,
    image: './9e70fce0-fab3-4a56-b9bd-7afc02a7fce6.jpg'
  },
  {
    id: 'p3',
    category: 'canecas',
    title: 'Xícaras Simples Personalizadas',
    description: 'Estampas com fotos estilo Polaroid, 12 motivos para amar você, mensagens de carinho. Incluso arte e embalagem de presente.',
    originalPrice: 40.00,
    promoPrice: 35.00,
    image: './eaa8ee4a-aaa3-4b8b-b562-9c7d9c4923d2.jpg'
  },
  {
    id: 'p4',
    category: 'canecas',
    title: 'Coleção Canecas Divertidas & Flork',
    description: 'Canecas bem-humoradas com boneco Flork, calendário de namoro, frases hilárias de amizade e profissões.',
    originalPrice: 42.00,
    promoPrice: 35.00,
    image: './3c124ba4-7b75-4acf-9676-4c582696b573.jpg'
  },
  {
    id: 'p5',
    category: 'canecas',
    title: 'Canecas com Iniciais & Florais',
    description: 'Estampas delicadas com monogramas florais, inicial do seu nome, frases para Mães, Filhas e Madrinhas.',
    originalPrice: 45.00,
    promoPrice: 35.00,
    image: './877f987d-483a-48b5-bcd5-ae1cf92ffe30.jpg'
  },
  {
    id: 'p6',
    category: 'azulejos',
    title: 'Azulejo Personalizado 20x20',
    description: 'Impressão fotográfica de alta durabilidade em porcelana cerâmica. Acompanha suporte de mesa elegante e embalagem de presente!',
    originalPrice: 48.00,
    promoPrice: 40.00,
    image: './183c3b84-85f3-414c-a912-3a2e56884c17.jpg'
  },
  {
    id: 'p7',
    category: 'azulejos',
    title: 'Azulejo Spotify & Mosaico de Fotos',
    description: 'Azulejos decorativos com código interativo do Spotify (sua música favorita), calendário com datas especiais e mosaicos de fotos de família.',
    originalPrice: 50.00,
    promoPrice: 40.00,
    image: './7ebd8191-462d-4b2b-a44b-612eb12cac98.jpg'
  },
  {
    id: 'p8',
    category: 'azulejos',
    title: 'Azulejo Relógio Funcional 20x20',
    description: 'Relógio de mesa funcional em azulejo cerâmico com máquina contínua silenciosa. Acompanha suporte de mesa, arte e embalagem.',
    originalPrice: 55.00,
    promoPrice: 40.00,
    image: './b81e6161-762f-40e4-af6f-2e168682e8b9.jpg'
  },
  {
    id: 'p9',
    category: 'azulejos',
    title: 'Relógios de Mesa Afetivos',
    description: 'Modelos comemorativos para Mãe, Vó, Pai, Casal e Bebês. Presente de altíssima utilidade, elegância e valor emocional.',
    originalPrice: 50.00,
    promoPrice: 40.00,
    image: './b750b56e-0cb0-400e-bfee-9e06ef36b0e9.jpg'
  },
  {
    id: 'p10',
    category: 'garrafas',
    title: 'Squeeze Alumínio Tampa Dupla',
    description: 'Garrafas de alumínio 500ml/600ml duráveis com tampa dupla de segurança. Personalize com seu nome, super-heróis ou florais.',
    originalPrice: 55.00,
    promoPrice: 45.00,
    image: './b589c2a3-d000-42fc-a963-c776cd758268.jpg'
  },
  {
    id: 'p11',
    category: 'chaveiros',
    title: 'Chaveiros Sublimados',
    description: 'Chaveiros com fotos de alta resolução, frases de carinho (Dinda, Mamãe) e artes exclusivas. Lembrança acessível e marcante.',
    originalPrice: 8.00,
    promoPrice: 5.00,
    image: './b2ef4f25-f591-40f5-b8bd-c374cbdd6539.jpg'
  },
  {
    id: 'p12',
    category: 'chaveiros',
    title: 'Imãs de Geladeira Fotográficos 5x5',
    description: 'R$ 4,00 a unidade ou Promoção 3 unidades por R$ 10,00! Transforme as fotos do celular em imãs fotográficos brilhantes.',
    originalPrice: 5.00,
    promoPrice: 4.00,
    image: './0057f877-d413-4476-9c48-e96f356d0e3f.jpg'
  }
];

let categories = [];
let products = [];
let isAdminMode = false;
let currentFilter = 'all';
let tempUploadedImage = '';
let logoClickCount = 0;
let logoClickTimer = null;

const ADMIN_PIN = '1234'; // Senha de acesso do proprietário

document.addEventListener('DOMContentLoaded', () => {
  loadData();
  initMobileMenu();
  initFaqAccordion();
  initCountdownTimer();
  renderApp();
});

/* --------------------------------------------------------------------------
   1. GERENCIAMENTO DE DADOS (LOCALSTORAGE)
   -------------------------------------------------------------------------- */
function loadData() {
  const savedCats = localStorage.getItem('gg_categories');
  const savedProds = localStorage.getItem('gg_products');

  categories = savedCats ? JSON.parse(savedCats) : [...DEFAULT_CATEGORIES];
  products = savedProds ? JSON.parse(savedProds) : [...DEFAULT_PRODUCTS];
}

function saveData() {
  localStorage.setItem('gg_categories', JSON.stringify(categories));
  localStorage.setItem('gg_products', JSON.stringify(products));
}

/* --------------------------------------------------------------------------
   2. RENDERIZAÇÃO DA APLICAÇÃO
   -------------------------------------------------------------------------- */
function renderApp() {
  renderCategoriesGrid();
  renderPortfolioFilters();
  renderPortfolioGrid();
  updateCalcSelect();
  updateCalcEstimate();
  if (window.lucide) window.lucide.createIcons();
}

function renderCategoriesGrid() {
  const container = document.getElementById('categories-grid-container');
  if (!container) return;

  container.innerHTML = categories.map(cat => `
    <div class="category-card" onclick="filterPortfolio('${cat.id}')">
      <div class="cat-icon-box"><i data-lucide="${cat.icon || 'tag'}"></i></div>
      <h3>${cat.name}</h3>
      <p>${cat.desc || 'Produtos personalizados incríveis.'}</p>
      <span class="cat-link">Ver Produtos <i data-lucide="arrow-right"></i></span>
    </div>
  `).join('');
}

function renderPortfolioFilters() {
  const container = document.getElementById('portfolio-filters');
  if (!container) return;

  let html = `<button class="filter-btn ${currentFilter === 'all' ? 'active' : ''}" onclick="setFilter('all')">Todos os Produtos</button>`;

  categories.forEach(cat => {
    html += `<button class="filter-btn ${currentFilter === cat.id ? 'active' : ''}" onclick="setFilter('${cat.id}')">${cat.name}</button>`;
  });

  if (isAdminMode) {
    html += `<button class="filter-btn" style="background:#e8f5e9; color:#2e7d32; border-color:#81c784;" onclick="openCategoryModal()"><i data-lucide="folder-plus"></i> + Categorias</button>`;
  }

  container.innerHTML = html;
}

function setFilter(catId) {
  currentFilter = catId;
  renderPortfolioFilters();
  renderPortfolioGrid();
}

function renderPortfolioGrid() {
  const container = document.getElementById('portfolio-grid');
  if (!container) return;

  const filteredProducts = currentFilter === 'all'
    ? products
    : products.filter(p => p.category === currentFilter);

  if (filteredProducts.length === 0) {
    container.innerHTML = `<div style="grid-column: 1/-1; text-align:center; padding: 40px; color:#888;">Nenhum produto cadastrado nesta categoria.</div>`;
    return;
  }

  container.innerHTML = filteredProducts.map(p => {
    const categoryObj = categories.find(c => c.id === p.category);
    const catName = categoryObj ? categoryObj.name : 'Personalizado';

    let discountBadge = '';
    let priceHTML = '';

    if (p.originalPrice && parseFloat(p.originalPrice) > parseFloat(p.promoPrice)) {
      const discountPercent = Math.round(((p.originalPrice - p.promoPrice) / p.originalPrice) * 100);
      discountBadge = `<span class="card-badge-discount">-${discountPercent}% OFF</span>`;
      priceHTML = `
        <div class="price-group">
          <span class="price-de">R$ ${parseFloat(p.originalPrice).toFixed(2).replace('.', ',')}</span>
          <span class="price-por">R$ ${parseFloat(p.promoPrice).toFixed(2).replace('.', ',')}</span>
        </div>
      `;
    } else {
      priceHTML = `
        <div class="price-group">
          <span class="price-por">R$ ${parseFloat(p.promoPrice).toFixed(2).replace('.', ',')}</span>
        </div>
      `;
    }

    const waMsg = `Olás Gabriela! Gostaria de encomendar o produto: ${p.title} (Valor: R$ ${parseFloat(p.promoPrice).toFixed(2).replace('.', ',')})`;
    const waUrl = `https://wa.me/5591982047600?text=${encodeURIComponent(waMsg)}`;

    return `
      <div class="portfolio-card-clean">
        <div class="portfolio-img-container">
          <img src="${p.image}" alt="${p.title}" loading="lazy">
          ${discountBadge}
          <span class="card-badge-cat">${catName}</span>
          <div class="portfolio-card-overlay">
            <button class="zoom-btn" onclick="openModal('${p.image}', '${escapeJsStr(p.title)}', '${escapeJsStr(p.description)}', '${parseFloat(p.promoPrice).toFixed(2)}', '${p.originalPrice ? parseFloat(p.originalPrice).toFixed(2) : ''}')">
              <i data-lucide="zoom-in"></i> Ver Detalhes
            </button>
          </div>
        </div>

        <div class="portfolio-body">
          <div class="portfolio-body-top">
            <h4 class="portfolio-item-title">${p.title}</h4>
            <p class="portfolio-item-desc">${p.description}</p>
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
                  <button class="btn-icon-admin btn-edit-admin" onclick="openProductModal('${p.id}')" title="Editar Produto">
                    <i data-lucide="edit"></i>
                  </button>
                  <button class="btn-icon-admin btn-delete-admin" onclick="deleteProduct('${p.id}')" title="Excluir Produto">
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

  if (window.lucide) window.lucide.createIcons();
}

function filterPortfolio(catId) {
  const section = document.getElementById('portfolio');
  if (section) section.scrollIntoView({ behavior: 'smooth' });
  setFilter(catId);
}

/* --------------------------------------------------------------------------
   3. AUTENTICAÇÃO E SEGURANÇA DA ÁREA ADMIN
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
    const floatBar = document.getElementById('admin-float-bar');
    const addBtnWrapper = document.getElementById('admin-add-product-wrapper');
    if (floatBar) floatBar.style.display = 'block';
    if (addBtnWrapper) addBtnWrapper.style.display = 'flex';
    renderApp();
    alert('Modo Administrativo ativado com sucesso!');
  } else {
    alert('Senha incorreta! Acesso negado.');
  }
}

function exitAdminMode() {
  isAdminMode = false;
  const floatBar = document.getElementById('admin-float-bar');
  const addBtnWrapper = document.getElementById('admin-add-product-wrapper');
  if (floatBar) floatBar.style.display = 'none';
  if (addBtnWrapper) addBtnWrapper.style.display = 'none';
  renderApp();
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
   4. MODAL & GERENCIAMENTO DE PRODUTOS
   -------------------------------------------------------------------------- */
function openProductModal(productId = null) {
  const modal = document.getElementById('product-admin-modal');
  const modalTitle = document.getElementById('product-modal-title');
  const catSelect = document.getElementById('p-category');
  const editIdInput = document.getElementById('edit-product-id');
  const titleInput = document.getElementById('p-title');
  const descInput = document.getElementById('p-description');
  const origPriceInput = document.getElementById('p-original-price');
  const promoPriceInput = document.getElementById('p-promo-price');
  const urlInput = document.getElementById('p-image-url');
  const previewImg = document.getElementById('p-image-preview');
  const previewContainer = document.getElementById('p-image-preview-container');

  catSelect.innerHTML = categories.map(c => `<option value="${c.id}">${c.name}</option>`).join('');
  tempUploadedImage = '';

  if (productId) {
    const p = products.find(prod => prod.id === productId);
    if (p) {
      modalTitle.innerHTML = `<i data-lucide="edit"></i> Editar Produto`;
      editIdInput.value = p.id;
      catSelect.value = p.category;
      titleInput.value = p.title;
      descInput.value = p.description;
      origPriceInput.value = p.originalPrice || '';
      promoPriceInput.value = p.promoPrice || '';
      urlInput.value = p.image.startsWith('data:') ? '' : p.image;
      tempUploadedImage = p.image;

      previewImg.src = p.image;
      previewContainer.style.display = 'block';
    }
  } else {
    modalTitle.innerHTML = `<i data-lucide="package-plus"></i> Cadastrar Novo Produto`;
    editIdInput.value = '';
    document.getElementById('product-form').reset();
    previewContainer.style.display = 'none';
  }

  if (modal) modal.classList.add('open');
  if (window.lucide) window.lucide.createIcons();
}

function closeProductModal() {
  const modal = document.getElementById('product-admin-modal');
  if (modal) modal.classList.remove('open');
}

function previewProductImage(event) {
  const file = event.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = function(e) {
      tempUploadedImage = e.target.result;
      const previewImg = document.getElementById('p-image-preview');
      const previewContainer = document.getElementById('p-image-preview-container');
      previewImg.src = tempUploadedImage;
      previewContainer.style.display = 'block';
    };
    reader.readAsDataURL(file);
  }
}

function saveProductForm(event) {
  event.preventDefault();

  const editId = document.getElementById('edit-product-id').value;
  const category = document.getElementById('p-category').value;
  const title = document.getElementById('p-title').value.trim();
  const description = document.getElementById('p-description').value.trim();
  const origPrice = parseFloat(document.getElementById('p-original-price').value) || null;
  const promoPrice = parseFloat(document.getElementById('p-promo-price').value) || 0;
  const imageUrlInput = document.getElementById('p-image-url').value.trim();

  let finalImage = tempUploadedImage || imageUrlInput || './3f7b4bd0-54a9-4490-96f7-d2e134892c30.jpg';

  if (editId) {
    const index = products.findIndex(p => p.id === editId);
    if (index !== -1) {
      products[index] = {
        id: editId,
        category,
        title,
        description,
        originalPrice: origPrice,
        promoPrice: promoPrice,
        image: finalImage
      };
    }
  } else {
    const newProduct = {
      id: 'p_' + Date.now(),
      category,
      title,
      description,
      originalPrice: origPrice,
      promoPrice: promoPrice,
      image: finalImage
    };
    products.push(newProduct);
  }

  saveData();
  closeProductModal();
  renderApp();
}

function deleteProduct(productId) {
  if (confirm('Tem certeza que deseja excluir este produto?')) {
    products = products.filter(p => p.id !== productId);
    saveData();
    renderApp();
  }
}

/* --------------------------------------------------------------------------
   5. GERENCIAMENTO DE CATEGORIAS
   -------------------------------------------------------------------------- */
function openCategoryModal() {
  const modal = document.getElementById('category-admin-modal');
  renderAdminCategoryList();
  if (modal) modal.classList.add('open');
  if (window.lucide) window.lucide.createIcons();
}

function closeCategoryModal() {
  const modal = document.getElementById('category-admin-modal');
  if (modal) modal.classList.remove('open');
}

function renderAdminCategoryList() {
  const listContainer = document.getElementById('admin-category-list');
  if (!listContainer) return;

  listContainer.innerHTML = categories.map(cat => `
    <div class="admin-cat-item">
      <span><strong>${cat.name}</strong> (ID: ${cat.id})</span>
      <button class="btn-icon-admin btn-delete-admin" onclick="deleteCategory('${cat.id}')" title="Excluir Categoria">
        <i data-lucide="trash-2"></i>
      </button>
    </div>
  `).join('');

  if (window.lucide) window.lucide.createIcons();
}

function addNewCategory(event) {
  event.preventDefault();
  const nameInput = document.getElementById('new-cat-name');
  const name = nameInput.value.trim();

  if (!name) return;
  const id = name.toLowerCase().replace(/[^a-z0-9]/g, '');

  if (categories.some(c => c.id === id)) {
    alert('Já existe uma categoria com este nome.');
    return;
  }

  categories.push({ id, name, icon: 'tag', desc: `Produtos da categoria ${name}` });
  saveData();
  nameInput.value = '';
  renderAdminCategoryList();
  renderApp();
}

function deleteCategory(catId) {
  if (confirm('Tem certeza que deseja excluir esta categoria? Os produtos associados mudarão para "Brindes".')) {
    categories = categories.filter(c => c.id !== catId);
    products.forEach(p => { if (p.category === catId) p.category = 'brindes'; });
    saveData();
    renderAdminCategoryList();
    renderApp();
  }
}

/* --------------------------------------------------------------------------
   6. SIMULADOR DE ORÇAMENTO
   -------------------------------------------------------------------------- */
function updateCalcSelect() {
  const select = document.getElementById('prod-select');
  if (!select) return;

  select.innerHTML = products.map(p => `
    <option value="${p.id}" data-price="${p.promoPrice}">${p.title} (R$ ${parseFloat(p.promoPrice).toFixed(2).replace('.', ',')})</option>
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

  totalPriceElem.textContent = `R$ ${total.toFixed(2).replace('.', ',')}`;
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

  const message = `Olás Gabriela! Gostaria de fazer o pedido pelo simulador do site:\n\n` +
                  `📦 *Produto:* ${prodName}\n` +
                  `🔢 *Quantidade:* ${quantity}\n` +
                  `✏️ *Detalhes/Ideia:* ${userNote}\n` +
                  `💰 *Valor Estimado:* ${estimatedTotal}\n\n` +
                  `Aguardo seu retorno para confirmar a arte!`;

  const waUrl = `https://wa.me/5591982047600?text=${encodeURIComponent(message)}`;
  window.open(waUrl, '_blank');
}

/* --------------------------------------------------------------------------
   7. MODAL LIGHTBOX
   -------------------------------------------------------------------------- */
function openModal(imgSrc, title, description, promoPrice, origPrice) {
  const modal = document.getElementById('image-modal');
  const modalImg = document.getElementById('modal-img');
  const modalTitle = document.getElementById('modal-title');
  const modalDesc = document.getElementById('modal-desc');
  const modalPriceBox = document.getElementById('modal-price-box');
  const modalWaBtn = document.getElementById('modal-wa-btn');

  if (modal && modalImg && modalTitle && modalDesc) {
    modalImg.src = imgSrc;
    modalTitle.textContent = title;
    modalDesc.textContent = description;

    let priceHtml = '';
    if (origPrice && parseFloat(origPrice) > parseFloat(promoPrice)) {
      priceHtml = `<div class="price-group" style="margin-bottom:14px;"><span class="price-de">De R$ ${parseFloat(origPrice).toFixed(2).replace('.', ',')}</span> <span class="price-por">Por R$ ${parseFloat(promoPrice).toFixed(2).replace('.', ',')}</span></div>`;
    } else {
      priceHtml = `<div class="price-group" style="margin-bottom:14px;"><span class="price-por">R$ ${parseFloat(promoPrice).toFixed(2).replace('.', ',')}</span></div>`;
    }
    if (modalPriceBox) modalPriceBox.innerHTML = priceHtml;

    const waMessage = `Olás Gabriela! Gostaria de pedir/saber mais sobre: ${title}`;
    modalWaBtn.href = `https://wa.me/5591982047600?text=${encodeURIComponent(waMessage)}`;

    modal.classList.add('open');
  }
}

function closeModal() {
  const modal = document.getElementById('image-modal');
  if (modal) modal.classList.remove('open');
}

window.addEventListener('click', (e) => {
  if (e.target.classList.contains('modal-overlay')) {
    closeModal();
    closeProductModal();
    closeCategoryModal();
    closeAdminPasswordModal();
  }
});

/* --------------------------------------------------------------------------
   8. COMPONENTES ADICIONAIS
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

function initCountdownTimer() {
  const targetDate = new Date();
  targetDate.setDate(targetDate.getDate() + 8);
  targetDate.setHours(23, 59, 59);

  function updateTimer() {
    const now = new Date().getTime();
    const distance = targetDate.getTime() - now;
    if (distance < 0) return;

    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);

    const d = document.getElementById('days');
    const h = document.getElementById('hours');
    const m = document.getElementById('minutes');
    const s = document.getElementById('seconds');

    if (d) d.textContent = days.toString().padStart(2, '0');
    if (h) h.textContent = hours.toString().padStart(2, '0');
    if (m) m.textContent = minutes.toString().padStart(2, '0');
    if (s) s.textContent = seconds.toString().padStart(2, '0');
  }

  updateTimer();
  setInterval(updateTimer, 1000);
}

function escapeJsStr(str) {
  if (!str) return '';
  return str.replace(/'/g, "\\'").replace(/"/g, '&quot;').replace(/\n/g, ' ');
}
