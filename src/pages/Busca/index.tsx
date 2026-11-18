import { useMemo, useState } from 'react';
import { ProductCard } from '../../components/ProductCard';
import { ServiceListingCard } from '../../components/ServiceListingCard';
import { getServiceListings, type ServiceListing } from '../../data/services';
import { products } from '../../data/products';
import { useSearchParams } from 'react-router-dom';
import './styles.css';

const normalizeSearchText = (value: string) =>
  value.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();

export function Busca() {
  const [searchParams] = useSearchParams();
  const [services] = useState<ServiceListing[]>(getServiceListings);
  const searchTerm = (searchParams.get('search') ?? '').trim();
  const normalizedSearchTerm = normalizeSearchText(searchTerm);

  const matchingProducts = useMemo(
    () => {
      if (!normalizedSearchTerm) {
        return [];
      }

      return products.filter((product) =>
        [product.name, product.category, product.description].some((value) =>
          normalizeSearchText(value).includes(normalizedSearchTerm),
        ),
      );
    },
    [normalizedSearchTerm],
  );

  const matchingServices = useMemo(
    () => {
      if (!normalizedSearchTerm) {
        return [];
      }

      return services.filter((service) =>
        [
          service.serviceName,
          service.category,
          service.description,
          service.providerName,
          service.businessName ?? '',
          service.city,
        ].some((value) => normalizeSearchText(value).includes(normalizedSearchTerm)),
      );
    },
    [normalizedSearchTerm, services],
  );

  const hasResults = matchingProducts.length + matchingServices.length > 0;

  return (
    <main className="page-shell search-page">
      <header className="page-header">
        <span className="eyebrow">Produtos e serviços</span>
        <h1>Resultados da busca</h1>
        {searchTerm ? (
          <p>
            Resultados para: <strong>“{searchTerm}”</strong>
          </p>
        ) : (
          <p>Digite um termo para pesquisar produtos e serviços.</p>
        )}
      </header>

      {searchTerm && hasResults ? (
        <>
          {matchingProducts.length ? (
            <section className="search-results-section" aria-labelledby="product-results-title">
              <div className="search-results-heading">
                <h2 id="product-results-title">Produtos</h2>
                <span>{matchingProducts.length} encontrados</span>
              </div>
              <div className="product-grid">
                {matchingProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            </section>
          ) : null}

          {matchingServices.length ? (
            <section className="search-results-section" aria-labelledby="service-results-title">
              <div className="search-results-heading">
                <h2 id="service-results-title">Serviços</h2>
                <span>{matchingServices.length} encontrados</span>
              </div>
              <div className="search-service-grid">
                {matchingServices.map((service) => (
                  <ServiceListingCard key={service.id} service={service} />
                ))}
              </div>
            </section>
          ) : null}
        </>
      ) : searchTerm ? (
        <section className="search-empty" aria-live="polite">
          <h2>Nenhum resultado encontrado</h2>
          <p>Tente buscar por outro nome, categoria, descrição ou cidade.</p>
        </section>
      ) : (
        <section className="search-empty">
          <h2>Encontre o que você procura</h2>
          <p>Use a busca no menu para pesquisar no catálogo de produtos e serviços.</p>
        </section>
      )}
    </main>
  );
}
