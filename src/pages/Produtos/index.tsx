import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { ProductCard } from '../../components/ProductCard';
import { categories, getCatalogProducts } from '../../data/products';

export function Produtos() {
  const [searchParams] = useSearchParams();
  const products = getCatalogProducts();
  const storeId = searchParams.get('storeId');
  const storeName = searchParams.get('storeName');
  const [selectedCategory, setSelectedCategory] = useState('Todos');
  const [sortBy, setSortBy] = useState<'featured' | 'priceAsc' | 'priceDesc'>('featured');
  const [maxPrice, setMaxPrice] = useState(500);
  const [freeShippingOnly, setFreeShippingOnly] = useState(false);
  const [offersOnly, setOffersOnly] = useState(false);
  const [newOnly, setNewOnly] = useState(false);
  const [usedOnly, setUsedOnly] = useState(searchParams.get('condition') === 'used');

  useEffect(() => {
    setUsedOnly(searchParams.get('condition') === 'used');
  }, [searchParams]);

  const query = (searchParams.get('search') ?? '').trim().toLowerCase();

  const visibleProducts = useMemo(() => {
    const filteredProducts = (selectedCategory === 'Todos' ? [...products] : products.filter((product) => product.category === selectedCategory))
      .filter((product) => !storeId || product.storeId === storeId)
      .filter((product) => {
      const matchesSearch =
        !query ||
        product.name.toLowerCase().includes(query) ||
        product.category.toLowerCase().includes(query) ||
        product.description.toLowerCase().includes(query) ||
        (product.storeName ?? '').toLowerCase().includes(query);

      const matchesPrice = product.price <= maxPrice;
      const matchesShipping = !freeShippingOnly || product.price >= 200;
      const matchesOffers = !offersOnly || Boolean(product.originalPrice && product.originalPrice > product.price);
      const matchesNew = !newOnly || (product.badge ? ['Novidade', 'Novo', 'Oferta', 'Mais vendido', 'Top review'].includes(product.badge) : false);
      const matchesUsed = !usedOnly || product.condition !== undefined;

      return matchesSearch && matchesPrice && matchesShipping && matchesOffers && matchesNew && matchesUsed;
    });

    const sortedProducts = [...filteredProducts];

    if (sortBy === 'priceAsc') {
      sortedProducts.sort((a, b) => a.price - b.price);
    }

    if (sortBy === 'priceDesc') {
      sortedProducts.sort((a, b) => b.price - a.price);
    }

    if (sortBy === 'featured') {
      sortedProducts.sort((a, b) => Number(b.featured ?? false) - Number(a.featured ?? false));
    }

    return sortedProducts;
  }, [selectedCategory, query, sortBy, maxPrice, freeShippingOnly, offersOnly, newOnly, usedOnly, storeId, products]);

  const usedProducts = products.filter((product) => product.condition);

  return (
    <main className="page-shell">
      <header className="page-header">
        <h1>Catálogo completo</h1>
        <p>
          {storeName
            ? `Produtos da loja ${storeName}.`
            : 'Descubra roupas, acessórios e itens modernos para o seu dia a dia. Filtre por categoria e encontre a opção ideal para o seu estilo.'}
        </p>
        {query ? <p className="search-summary">Resultados para: “{query}”</p> : null}
      </header>

      <div className="catalog-layout">
        <aside className="filters-panel">
          <h3>Filtrar</h3>

          <div className="filter-list">
            {categories.map((category) => (
              <button
                key={category}
                type="button"
                className={`filter-btn${selectedCategory === category ? ' active' : ''}`}
                onClick={() => setSelectedCategory(category)}
              >
                {category}
              </button>
            ))}
          </div>

          <div className="filter-group">
            <label>
              <span>Frete grátis</span>
              <input type="checkbox" checked={freeShippingOnly} onChange={() => setFreeShippingOnly((value) => !value)} />
            </label>
            <label>
              <span>Ofertas</span>
              <input type="checkbox" checked={offersOnly} onChange={() => setOffersOnly((value) => !value)} />
            </label>
            <label>
              <span>Novos</span>
              <input type="checkbox" checked={newOnly} onChange={() => setNewOnly((value) => !value)} />
            </label>
            <label>
              <span>Bazar colaborativo</span>
              <input type="checkbox" checked={usedOnly} onChange={() => setUsedOnly((value) => !value)} />
            </label>
          </div>

          <div className="filter-price">
            <label htmlFor="price-limit">Máximo: R$ {maxPrice}</label>
            <input
              id="price-limit"
              type="range"
              min={50}
              max={500}
              step={10}
              value={maxPrice}
              onChange={(event) => setMaxPrice(Number(event.target.value))}
            />
          </div>
        </aside>

        <div className="catalog-content">
          {usedOnly && usedProducts.length > 0 ? (
            <section className="bazar-banner">
              <div>
                <span className="eyebrow bazar-eyebrow">Bazar Colaborativo</span>
                <h2>Uma segunda vida para boas peças.</h2>
              </div>
              <p>
                Encontre itens de segunda mão anunciados pela comunidade. Confira a condição de cada
                peça e descubra seu próximo achado.
              </p>
            </section>
          ) : null}

          <div className="catalog-toolbar">
            <span>{visibleProducts.length} produtos encontrados</span>
            <label>
              <span>Ordenar por </span>
              <select value={sortBy} onChange={(event) => setSortBy(event.target.value as 'featured' | 'priceAsc' | 'priceDesc')}>
                <option value="featured">Relevância</option>
                <option value="priceAsc">Menor preço</option>
                <option value="priceDesc">Maior preço</option>
              </select>
            </label>
          </div>

          <div className={`product-grid${usedOnly ? ' bazar-grid' : ''}`}>
            {visibleProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
