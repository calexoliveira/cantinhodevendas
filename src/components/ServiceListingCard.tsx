import type { ServiceListing } from '../data/services';
import './ServiceListingCard.css';

type ServiceListingCardProps = {
  service: ServiceListing;
};

export function ServiceListingCard({ service }: ServiceListingCardProps) {
  const providerName = service.businessName || service.providerName;
  const phoneNumber = service.phone.replace(/\D/g, '');

  return (
    <article className="registered-service-card">
      <div className="registered-service-banner">
        <span className="registered-service-category">{service.category}</span>
        <span className="registered-service-provider-type">
          {service.providerType === 'individual' ? 'Pessoa física' : 'Pessoa jurídica'}
        </span>
      </div>

      <div className="registered-service-card-content">
        <div className="registered-service-provider">
          <span className="registered-service-avatar" aria-hidden="true">
            {providerName.charAt(0).toUpperCase() || '?'}
          </span>
          <div>
            <span className="registered-service-provider-label">Prestador</span>
            <strong>{providerName}</strong>
          </div>
        </div>

        <h3>{service.serviceName}</h3>
        <p className="registered-service-description">{service.description}</p>

        <div className="registered-service-details">
          <span>
            <span aria-hidden="true">⌖</span>
            {service.city}
          </span>
          <span>
            <span aria-hidden="true">R$</span>
            {service.startingPrice === undefined
              ? 'Valor a combinar'
              : `A partir de ${service.startingPrice.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}`}
          </span>
        </div>

        <a className="registered-service-contact" href={`tel:${phoneNumber}`}>
          Entrar em contato <span aria-hidden="true">→</span>
        </a>
      </div>
    </article>
  );
}
