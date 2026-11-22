import { useState, type FormEvent } from 'react';
import { apiRequest, errorMessage } from '../../api';
import { useServices } from '../../context/useServices';
import type { ServiceListing } from '../../data/services';
import { parseSocialLinks } from '../../../shared/socialLinks';

function ServiceSocialEditor({ service }: { service: ServiceListing }) {
  const [links, setLinks] = useState(service.socialLinks.join('\n'));
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [saved, setSaved] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError('');
    setSaved(false);
    const parsed = parseSocialLinks(links);
    if (!parsed.success) {
      setError('Informe até 10 links completos, iniciados por http:// ou https://.');
      return;
    }
    setBusy(true);
    try {
      const updated = await apiRequest<ServiceListing>(`/services/${encodeURIComponent(service.id)}/social-links`, {
        method: 'PATCH',
        body: JSON.stringify({ socialLinks: parsed.data }),
      });
      setLinks(updated.socialLinks.join('\n'));
      setSaved(true);
    } catch (reason) {
      setError(errorMessage(reason));
    } finally {
      setBusy(false);
    }
  };

  return (
    <article className="service-social-admin-item">
      <h3>{service.serviceName}</h3>
      <p>{service.businessName || service.providerName} · {service.city}</p>
      <form className="admin-form" onSubmit={handleSubmit}>
        <label>
          Redes sociais
          <textarea
            rows={3}
            disabled={busy}
            value={links}
            placeholder="Um link completo por linha"
            onChange={(event) => { setLinks(event.target.value); setSaved(false); }}
          />
          <small>Até 10 links iniciados por http:// ou https://. Deixe vazio para remover.</small>
        </label>
        {error ? <p className="auth-error" role="alert">{error}</p> : null}
        {saved ? <p role="status">Redes sociais salvas.</p> : null}
        <button type="submit" className="secondary-btn" disabled={busy}>Salvar redes sociais</button>
      </form>
    </article>
  );
}

export function ServiceSocialAdmin() {
  const { services, loading, error, retry } = useServices();

  return (
    <section className="admin-products service-social-admin">
      <h2>Redes sociais dos serviços</h2>
      {loading ? <p>Carregando serviços...</p> : error ? (
        <div role="alert">
          <p>Não foi possível carregar os serviços: {error}</p>
          <button type="button" className="secondary-btn" onClick={retry}>Tentar novamente</button>
        </div>
      ) : services.length ? services.map((service) => (
        <ServiceSocialEditor key={service.id} service={service} />
      )) : <p>Ainda não há serviços cadastrados.</p>}
    </section>
  );
}
