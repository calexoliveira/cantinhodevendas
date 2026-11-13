import { useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { ProductCard } from '../../components/ProductCard';
import { categories, products } from '../../data/products';

export function Produtos() {
  const [searchParams] = useSearchParams();
  const [selectedCategory, setSelectedCategory] = useState('Todos');
  const [sortBy, setSortBy] = useState<'featured' | 'priceAsc' | 'priceDesc'>('featured');

  const query = (searchParams.get('search') ?? '').trim().toLowerCase();

  const visibleProducts = useMemo(() => {
    const filteredProducts = (selectedCategory === 'Todos' ? [...products] : products.filter((product) => product.category === selectedCategory)).filter((product) => {
      if (!query) {
        return true;
      }

      return (
        product.name.toLowerCase().includes(query) ||
        product.category.toLowerCase().includes(query) ||
        product.description.toLowerCase().includes(query)
      );
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
  }, [selectedCategory, query, sortBy]);

  return (
    <main className="page-shell">
      <header className="page-header">
        <h1>Catálogo completo</h1>
        <p>
          Descubra roupas, acessórios e itens modernos para o seu dia a dia. Filtre por categoria e
          encontre a opção ideal para o seu estilo.
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
              <input type="checkbox" defaultChecked />
            </label>
            <label>
              <span>Ofertas</span>
              <input type="checkbox" />
            </label>
            <label>
              <span>Novos</span>
              <input type="checkbox" defaultChecked />
            </label>
          </div>
        </aside>

        <div className="catalog-content">
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

          <div className="product-grid">
            {visibleProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
