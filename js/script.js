// Dados de exemplo dos produtos
const products = [
    {
        id: 1,
        title: 'Fone de Ouvido Bluetooth com Cancelamento de Ruído',
        price: 89.90,
        originalPrice: 129.90,
        store: 'Amazon',
        category: 'eletronicos',
        image: 'https://via.placeholder.com/300',
        affiliateLink: 'https://amzn.to/exemplo1',
        discount: 31
    },
    {
        id: 2,
        title: 'Parafusadeira Furadeira De Impacto The Black Tools Profissional TB-21PX 2 Baterias Com Maleta 60Hz Amarelo',
        price: 219,
        originalPrice: 399.90,
        store: 'Mercado livre',
        category: 'eletronicos',
        image: 'https://http2.mlstatic.com/D_NQ_NP_2X_918679-MLA95349562903_102025-F.webp',
        affiliateLink: 'https://mercadolivre.com/sec/11h8y8V',
        discount: 45
    },
    {
        id: 3,
        title: 'Smartwatch com Monitor Cardíaco',
        price: 199.90,
        originalPrice: 299.90,
        store: 'Magazine luiza',
        category: 'eletronicos',
        image: 'https://via.placeholder.com/300',
        affiliateLink: 'https://magazineluiza.com/exemplo3',
        discount: 33
    },
    {
        id: 2,
        title: 'fone',
        price: 59,
        originalPrice: 79.90,
        store: 'Mercado livre',
        category: 'eletronicos',
        image: 'https://http2.mlstatic.com/D_NQ_NP_2X_752029-MLA96147242869_102025-F.webp',
        affiliateLink: 'https://mercadolivre.com/sec/1HsbXyA',
        discount: 45
    },
    // Adicione mais produtos conforme necessário
];

// Função para renderizar os produtos
function renderProducts(productsToRender = products) {
    const container = document.getElementById('products-container');
    container.innerHTML = '';

    showLoading();

    setTimeout(() => { // Simulando tempo de carregamento para demonstração
        productsToRender.forEach(product => {
            const productCard = `
                <div class="product-card">
                    ${product.discount ? `<div class="discount-badge">-${product.discount}%</div>` : ''}
                    <img src="${product.image}" alt="${product.title}" class="product-image">
                    <div class="product-info">
                        <h3 class="product-title">${product.title}</h3>
                        <div class="price-container">
                            <p class="product-price">R$ ${product.price.toFixed(2)}</p>
                            ${product.originalPrice ? `<p class="original-price">R$ ${product.originalPrice.toFixed(2)}</p>` : ''}
                        </div>
                        <p class="product-store">
                            <i class="fas fa-store"></i>
                            ${product.store}
                        </p>
                        <a href="${product.affiliateLink}" target="_blank" class="buy-button">
                            <i class="fas fa-shopping-cart"></i>
                            Comprar agora
                        </a>
                    </div>
                </div>
            `;
            container.innerHTML += productCard;
        });

        hideLoading();
    }, 500);
}

// Função para filtrar produtos
function filterProducts() {
    const selectedStores = Array.from(document.querySelectorAll('input[type="checkbox"]:checked'))
        .filter(checkbox => ['amazon', 'mercado livre', 'magazine luiza', 'shopee'].includes(checkbox.value.toLowerCase()))
        .map(checkbox => checkbox.value.toLowerCase());

    const selectedCategories = Array.from(document.querySelectorAll('input[type="checkbox"]:checked'))
        .filter(checkbox => ['eletronicos', 'casa', 'moda', 'beleza'].includes(checkbox.value))
        .map(checkbox => checkbox.value);

    const selectedPrice = document.querySelector('input[name="price"]:checked')?.value;

    let filteredProducts = products;

    // Filtrar por loja
    if (selectedStores.length > 0) {
        filteredProducts = filteredProducts.filter(product => 
            selectedStores.includes(product.store.toLowerCase()));
    }

    // Filtrar por categoria
    if (selectedCategories.length > 0) {
        filteredProducts = filteredProducts.filter(product => 
            selectedCategories.includes(product.category));
    }

    // Filtrar por preço
    if (selectedPrice) {
        const [min, max] = selectedPrice.split('-').map(Number);
        filteredProducts = filteredProducts.filter(product => {
            if (max) {
                return product.price >= min && product.price <= max;
            } else {
                return product.price >= min;
            }
        });
    }

    renderProducts(filteredProducts);
}

// Função para pesquisar produtos
function searchProducts() {
    const searchTerm = document.getElementById('search').value.toLowerCase();
    const filteredProducts = products.filter(product =>
        product.title.toLowerCase().includes(searchTerm) ||
        product.store.toLowerCase().includes(searchTerm)
    );
    renderProducts(filteredProducts);
}

// Funções de loading
function showLoading() {
    const loading = document.getElementById('loading-overlay');
    loading.classList.add('active');
}

function hideLoading() {
    const loading = document.getElementById('loading-overlay');
    loading.classList.remove('active');
}

// Função para ordenar produtos
function sortProducts(products, sortType) {
    switch (sortType) {
        case 'price-asc':
            return [...products].sort((a, b) => a.price - b.price);
        case 'price-desc':
            return [...products].sort((a, b) => b.price - a.price);
        case 'discount':
            return [...products].sort((a, b) => (b.discount || 0) - (a.discount || 0));
        default: // relevance - mantém a ordem original
            return products;
    }
}

// Event listeners
document.addEventListener('DOMContentLoaded', () => {
    renderProducts();

    // Adicionar event listeners para filtros
    const filterInputs = document.querySelectorAll('.filter-options input');
    filterInputs.forEach(input => {
        input.addEventListener('change', filterProducts);
    });

    // Adicionar event listener para pesquisa
    const searchInput = document.getElementById('search');
    let searchTimeout;
    searchInput.addEventListener('input', () => {
        clearTimeout(searchTimeout);
        showLoading();
        searchTimeout = setTimeout(searchProducts, 300); // Debounce da pesquisa
    });

    // Adicionar event listener para ordenação
    const sortSelect = document.getElementById('sort-select');
    sortSelect.addEventListener('change', () => {
        const sortedProducts = sortProducts(
            products.filter(p => p.title.toLowerCase().includes(searchInput.value.toLowerCase())),
            sortSelect.value
        );
        renderProducts(sortedProducts);
    });

    // Controles do painel de filtros mobile
    const filterToggle = document.getElementById('filter-toggle');
    const filtersPanel = document.getElementById('filters-panel');
    const closeFilters = document.getElementById('close-filters');

    filterToggle.addEventListener('click', () => {
        filtersPanel.classList.add('active');
        document.body.style.overflow = 'hidden'; // Previne rolagem do body
    });

    closeFilters.addEventListener('click', () => {
        filtersPanel.classList.remove('active');
        document.body.style.overflow = ''; // Restaura rolagem do body
    });

    // Fecha os filtros ao clicar fora em dispositivos móveis
    document.addEventListener('click', (e) => {
        if (window.innerWidth <= 768) {
            if (!filtersPanel.contains(e.target) && !filterToggle.contains(e.target) && filtersPanel.classList.contains('active')) {
                filtersPanel.classList.remove('active');
                document.body.style.overflow = '';
            }
        }
    });

});






