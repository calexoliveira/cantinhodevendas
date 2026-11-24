import { useCallback, useEffect, useState } from 'react';
import { apiRequest, errorMessage } from '../../api';
import type { ServiceListing } from '../../data/services';

type PendingService = ServiceListing & {
  ownerName: string;
  ownerEmail: string;
};

export function ServiceApprovals() {
  const [services, setServices] = useState<PendingService[]>([]);
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [error, setError] = useState('');

  const loadServices = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      setServices(await apiRequest<PendingService[]>('/admin/services/pending'));
    } catch (reason) {
      setError(errorMessage(reason));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadServices();
  }, [loadServices]);

  const approveService = async (service: PendingService) => {
    setBusyId(service.id);
    setError('');
    try {
      await apiRequest(`/admin/services/${encodeURIComponent(service.id)}/approval`, { method: 'PATCH' });
      setServices((current) => current.filter((item) => item.id !== service.id));
    } catch (reason) {
      setError(errorMessage(reason));
    } finally {
      setBusyId(null);
    }
  };

  return (
    <section className="admin-products service-social-admin">
      <h2>Aprovação de serviços</h2>
      {error ? <p className="auth-error" role="alert">{error}</p> : null}
      {loading ? <p>Carregando solicitações...</p> : services.length ? (
        <div className="admin-product-list">
          {services.map((service) => (
            <article key={service.id} className="admin-product-item">
              <div>
                <strong>{service.serviceName}</strong>
                <span>{service.businessName || service.providerName} · {service.city}</span>
                <small>{service.category}</small>
                <small>Responsável: {service.ownerName} ({service.ownerEmail})</small>
                <small>{service.description}</small>
              </div>
              <button type="button" className="primary-btn" disabled={busyId !== null}
                onClick={() => void approveService(service)}>
                {busyId === service.id ? 'Aprovando...' : 'Aprovar serviço'}
              </button>
            </article>
          ))}
        </div>
      ) : (
        <div>
          <p>Não há serviços aguardando aprovação.</p>
          <button type="button" className="secondary-btn" onClick={() => void loadServices()}>Atualizar</button>
        </div>
      )}
    </section>
  );
}
