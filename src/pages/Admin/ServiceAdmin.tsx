import { useState, type FormEvent } from 'react';
import { errorMessage } from '../../api';
import { useServices } from '../../context/useServices';
import type { ServiceListing } from '../../data/services';
import { serviceAdminUpdateSchema, serviceCategories, type ServiceAdminUpdate } from '../../../shared/services';
import { parseSocialLinks } from '../../../shared/socialLinks';

type ServiceEditForm = {
  providerName: string;
  businessName: string;
  serviceName: string;
  category: string;
  description: string;
  phone: string;
  city: string;
  startingPrice: string;
  socialLinks: string;
};

function createServiceForm(service: ServiceListing): ServiceEditForm {
  return {
    providerName: service.providerName,
    businessName: service.businessName ?? '',
    serviceName: service.serviceName,
    category: service.category,
    description: service.description,
    phone: service.phone,
    city: service.city,
    startingPrice: service.startingPrice === undefined ? '' : String(service.startingPrice),
    socialLinks: service.socialLinks.join('\n'),
  };
}

function ServiceEditor({ service, onSave, onCancel }: {
  service: ServiceListing;
  onSave: (id: string, values: ServiceAdminUpdate) => Promise<void>;
  onCancel: () => void;
}) {
  const [form, setForm] = useState(() => createServiceForm(service));
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  const updateForm = <K extends keyof ServiceEditForm>(field: K, value: ServiceEditForm[K]) => {
    setForm((current) => ({ ...current, [field]: value }));
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError('');
    const links = parseSocialLinks(form.socialLinks);
    if (!links.success) {
      setError('Informe até 10 links completos, iniciados por http:// ou https://.');
      return;
    }
    const parsed = serviceAdminUpdateSchema.safeParse({
      providerType: service.providerType,
      providerName: form.providerName.trim(),
      businessName: form.businessName.trim() || undefined,
      serviceName: form.serviceName.trim(),
      category: form.category,
      description: form.description.trim(),
      phone: form.phone.trim(),
      city: form.city.trim(),
      startingPrice: form.startingPrice ? Number(form.startingPrice) : undefined,
      socialLinks: links.data,
    });
    if (!parsed.success) {
      setError(parsed.error.issues[0]?.message ?? 'Confira os dados do serviço.');
      return;
    }
    setBusy(true);
    try {
      await onSave(service.id, parsed.data);
    } catch (reason) {
      setError(errorMessage(reason));
    } finally {
      setBusy(false);
    }
  };

  return (
    <article className="service-social-admin-item">
      <h3>Editar serviço: {service.serviceName}</h3>
      <p>Tipo de prestador: {service.providerType === 'individual' ? 'Pessoa física' : 'Pessoa jurídica'}. O tipo é vinculado ao documento cadastrado.</p>
      <form className="admin-form" onSubmit={(event) => void handleSubmit(event)}>
        <fieldset className="service-fields" disabled={busy}>
          <div className="service-form-grid">
            <label>
              Nome do prestador
              <input value={form.providerName} maxLength={120} onChange={(event) => updateForm('providerName', event.target.value)} required />
            </label>
            {service.providerType === 'company' ? (
              <label>
                Nome fantasia
                <input value={form.businessName} maxLength={120} onChange={(event) => updateForm('businessName', event.target.value)} />
              </label>
            ) : null}
            <label>
              Nome do serviço
              <input value={form.serviceName} maxLength={200} onChange={(event) => updateForm('serviceName', event.target.value)} required />
            </label>
            <label>
              Categoria
              <select value={form.category} onChange={(event) => updateForm('category', event.target.value)}>
                {serviceCategories.map((category) => <option key={category} value={category}>{category}</option>)}
              </select>
            </label>
            <label>
              Telefone
              <input type="tel" value={form.phone} maxLength={30} onChange={(event) => updateForm('phone', event.target.value)} required />
            </label>
            <label>
              Cidade / região
              <input value={form.city} maxLength={120} onChange={(event) => updateForm('city', event.target.value)} required />
            </label>
            <label>
              Valor inicial
              <input type="number" min="0" max="9999999999" step="0.01" value={form.startingPrice}
                onChange={(event) => updateForm('startingPrice', event.target.value)} />
            </label>
            <label className="service-description-field">
              Descrição
              <textarea rows={4} maxLength={5000} value={form.description}
                onChange={(event) => updateForm('description', event.target.value)} required />
            </label>
            <label className="service-description-field">
              Redes sociais
              <textarea rows={3} value={form.socialLinks} onChange={(event) => updateForm('socialLinks', event.target.value)} />
              <small>Até 10 links completos, um por linha.</small>
            </label>
          </div>
        </fieldset>
        {error ? <p className="auth-error" role="alert">{error}</p> : null}
        <div className="product-form-actions">
          <button type="submit" className="primary-btn" disabled={busy}>Salvar alterações</button>
          <button type="button" className="secondary-btn" onClick={onCancel} disabled={busy}>Cancelar</button>
        </div>
      </form>
    </article>
  );
}

export function ServiceAdmin() {
  const { services, loading, error, retry, updateService, removeService } = useServices();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [actionError, setActionError] = useState('');

  const handleSave = async (id: string, values: ServiceAdminUpdate) => {
    setActionError('');
    await updateService(id, values);
    setEditingId(null);
  };

  const handleRemove = async (service: ServiceListing) => {
    if (!window.confirm(`Deseja excluir o serviço "${service.serviceName}"?`)) return;
    setActionError('');
    try {
      await removeService(service.id);
    } catch (reason) {
      setActionError(errorMessage(reason));
    }
  };

  return (
    <section className="admin-products service-social-admin">
      <h2>Serviços cadastrados</h2>
      {actionError ? <p className="auth-error" role="alert">{actionError}</p> : null}
      {loading ? <p>Carregando serviços...</p> : error ? (
        <div role="alert">
          <p>Não foi possível carregar os serviços: {error}</p>
          <button type="button" className="secondary-btn" onClick={retry}>Tentar novamente</button>
        </div>
      ) : services.length ? services.map((service) => (
        editingId === service.id ? (
          <ServiceEditor key={service.id} service={service} onSave={handleSave} onCancel={() => setEditingId(null)} />
        ) : (
          <article key={service.id} className="service-social-admin-item">
            <h3>{service.serviceName}</h3>
            <p>{service.businessName || service.providerName} · {service.city}</p>
            <div className="product-form-actions">
              <button type="button" className="secondary-btn" onClick={() => setEditingId(service.id)}>Editar</button>
              <button type="button" className="remove-item" onClick={() => void handleRemove(service)}>Excluir</button>
            </div>
          </article>
        )
      )) : <p>Ainda não há serviços cadastrados.</p>}
    </section>
  );
}
