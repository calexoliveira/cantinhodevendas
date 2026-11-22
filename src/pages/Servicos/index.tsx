import { useEffect, useState, type FormEvent } from 'react';
import { Link } from 'react-router-dom';
import { ServiceListingCard } from '../../components/ServiceListingCard';
import { apiRequest, errorMessage } from '../../api';
import { getLegacyServices, importLegacyServices, serviceCategories, type ServiceListing, type ServiceProviderType, type ServiceRegistration } from '../../data/services';
import { useServices } from '../../context/useServices';
import { serviceRegistrationSchema } from '../../../shared/services';
import { parseSocialLinks } from '../../../shared/socialLinks';
import {
  formatBrazilianDocument,
  getDocumentDigits,
  identifyBrazilianDocument,
  isValidBrazilianDocument,
} from '../../utils/brazilianDocument';
import './styles.css';

const services = [
  {
    icon: '✦',
    title: 'Ajuda para escolher',
    description:
      'Encontre peças que combinam com seu estilo e sua rotina. Explore o catálogo e compare opções com calma.',
    detail: 'Uma escolha mais fácil',
  },
  {
    icon: '↗',
    title: 'Acompanhamento do pedido',
    description:
      'Consulte as informações de entrega e acompanhe os detalhes do seu pedido durante a compra.',
    detail: 'Mais clareza em cada etapa',
  },
  {
    icon: '↺',
    title: 'Trocas e devoluções',
    description:
      'Precisa solicitar uma troca ou devolução? Confira as condições e orientações aplicáveis ao seu pedido.',
    detail: 'Orientação sem complicação',
  },
  {
    icon: '♡',
    title: 'Suporte ao cliente',
    description:
      'Conte com informações claras para navegar pela loja, finalizar sua compra e consultar seus pedidos.',
    detail: 'A gente ajuda você',
  },
];

type ServiceForm = {
  providerType: ServiceProviderType;
  providerName: string;
  businessName: string;
  documentNumber: string;
  serviceName: string;
  category: string;
  description: string;
  phone: string;
  city: string;
  startingPrice: string;
  socialLinks: string;
};

const initialForm: ServiceForm = {
  providerType: 'individual',
  providerName: '',
  businessName: '',
  documentNumber: '',
  serviceName: '',
  category: serviceCategories[0],
  description: '',
  phone: '',
  city: '',
  startingPrice: '',
  socialLinks: '',
};

export function Servicos() {
  const [form, setForm] = useState(initialForm);
  const { services: registeredServices, error: loadError, loading, addServices, retry } = useServices();
  const [legacyServices, setLegacyServices] = useState<{ legacyId: string; service: ServiceRegistration }[]>([]);
  const [legacyError, setLegacyError] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const documentType = identifyBrazilianDocument(form.documentNumber);
  const documentDigits = getDocumentDigits(form.documentNumber);
  const documentIsValid =
    isValidBrazilianDocument(form.documentNumber) &&
    documentType === (form.providerType === 'individual' ? 'cpf' : 'cnpj');

  useEffect(() => {
    try {
      const { services, invalidCount } = getLegacyServices();
      setLegacyServices(services);
      if (invalidCount) {
        setLegacyError(`${invalidCount} serviço(s) antigo(s) possuem dados inválidos e não serão importados. Os dados locais foram preservados.`);
      }
    } catch {
      setLegacyError('Não foi possível ler os serviços antigos deste navegador. Os dados locais foram preservados.');
    }
  }, []);

  const updateForm = <K extends keyof ServiceForm>(field: K, value: ServiceForm[K]) => {
    setForm((current) => ({ ...current, [field]: value }));
    setSuccessMessage('');
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError('');
    setSuccessMessage('');

    if (!documentIsValid) {
      setError(
        form.providerType === 'individual'
          ? 'Informe um CPF válido para pessoa física.'
          : 'Informe um CNPJ válido para pessoa jurídica.',
      );
      return;
    }

    const links = parseSocialLinks(form.socialLinks);
    if (!links.success) {
      setError('Informe até 10 links de redes sociais completos, iniciados por http:// ou https://.');
      return;
    }

    const listing = {
      providerType: form.providerType,
      providerName: form.providerName.trim(),
      businessName: form.businessName.trim() || undefined,
      documentNumber: getDocumentDigits(form.documentNumber),
      serviceName: form.serviceName.trim(),
      category: form.category,
      description: form.description.trim(),
      phone: form.phone.trim(),
      city: form.city.trim(),
      startingPrice: form.startingPrice ? Number(form.startingPrice) : undefined,
      socialLinks: links.data,
    };

    const parsed = serviceRegistrationSchema.safeParse(listing);
    if (!parsed.success) {
      setError('Confira os campos informados, incluindo o telefone e o valor inicial.');
      return;
    }
    setBusy(true);
    try {
      const saved = await apiRequest<ServiceListing>('/services', {
        method: 'POST',
        body: JSON.stringify(parsed.data),
      });
      addServices([saved]);
      setForm(initialForm);
      setSuccessMessage('Serviço cadastrado e publicado no catálogo.');
    } catch (reason) {
      setError(errorMessage(reason));
    } finally {
      setBusy(false);
    }
  };

  const handleImport = async () => {
    if (!window.confirm('Os serviços locais serão publicados para todos, incluindo nome, cidade e telefone. CPF e CNPJ não serão exibidos. Os dados locais serão mantidos. Deseja continuar?')) return;
    setError('');
    setSuccessMessage('');
    setBusy(true);
    try {
      for (let index = 0; index < legacyServices.length; index += 100) {
        const imported = await importLegacyServices(legacyServices.slice(index, index + 100));
        addServices(imported);
      }
      setSuccessMessage('Serviços locais válidos importados. Os dados originais continuam neste navegador.');
    } catch (reason) {
      setError(`Não foi possível concluir a importação: ${errorMessage(reason)} Os dados locais foram preservados; você pode tentar novamente.`);
    } finally {
      setBusy(false);
    }
  };

  return (
    <main className="page-shell services-page">
      <section className="registered-services" aria-labelledby="registered-services-title">
        <div className="registered-services-heading">
          <div className="services-section-heading">
            <span className="eyebrow">Profissionais e Parceiros Credenciados</span>
            <h1 id="registered-services-title">Rede de Serviços</h1>
            <p>Conheça os prestadores e encontre um serviço para a sua necessidade.</p>
          </div>
          <a href="#cadastrar-servico" className="secondary-btn">
            Anuncie seu serviço
          </a>
        </div>

        {loading ? (
          <p>Carregando serviços...</p>
        ) : loadError ? (
          <div role="alert">
            <p>Não foi possível carregar os serviços: {loadError}</p>
            <button type="button" className="secondary-btn" onClick={retry}>Tentar novamente</button>
          </div>
        ) : registeredServices.length ? (
          <div className="registered-services-grid">
            {registeredServices.map((service) => (
              <ServiceListingCard key={service.id} service={service} />
            ))}
          </div>
        ) : (
          <p className="registered-services-empty">
            Ainda não há serviços cadastrados. Seja o primeiro prestador a divulgar seu trabalho.
          </p>
        )}
      </section>

      <section className="services-section" aria-labelledby="services-title">
        <div className="services-section-heading">
          <span className="eyebrow">Como podemos ajudar</span>
          <h2 id="services-title">Serviços pensados para você</h2>
          <p>Veja como podemos tornar sua experiência na loja mais tranquila.</p>
        </div>

        <div className="services-grid">
          {services.map((service, index) => (
            <article className="service-card" key={service.title}>
              <div className="service-card-top">
                <span className="service-icon" aria-hidden="true">{service.icon}</span>
                <span className="service-number">0{index + 1}</span>
              </div>
              <h3>{service.title}</h3>
              <p>{service.description}</p>
              <span className="service-detail">{service.detail}</span>
            </article>
          ))}
        </div>
      </section>

      <section className="service-provider-section" id="cadastrar-servico">
        <div className="services-section-heading">
          <span className="eyebrow">Para profissionais e empresas</span>
          <h2>Cadastre seu serviço</h2>
          <p>Divulgue seu trabalho como pessoa física ou jurídica e apareça no catálogo.</p>
          <p>Nome, cidade e telefone serão públicos. CPF ou CNPJ não aparecem no catálogo.</p>
        </div>

        <form className="service-registration-form" onSubmit={handleSubmit}>
          <fieldset className="service-fields" disabled={busy}>
          <fieldset className="service-provider-type">
            <legend>Você está cadastrando como</legend>
            <label>
              <input
                type="radio"
                name="providerType"
                value="individual"
                checked={form.providerType === 'individual'}
                onChange={() => {
                  updateForm('providerType', 'individual');
                  setError('');
                }}
              />
              Pessoa física
            </label>
            <label>
              <input
                type="radio"
                name="providerType"
                value="company"
                checked={form.providerType === 'company'}
                onChange={() => {
                  updateForm('providerType', 'company');
                  setError('');
                }}
              />
              Pessoa jurídica
            </label>
          </fieldset>

          <div className="service-form-grid">
            <label>
              {form.providerType === 'individual' ? 'Nome completo' : 'Razão social'}
              <input
                type="text"
                autoComplete="name"
                maxLength={120}
                value={form.providerName}
                onChange={(event) => updateForm('providerName', event.target.value)}
                required
              />
            </label>

            {form.providerType === 'company' ? (
              <label>
                Nome fantasia
                <input
                  type="text"
                  autoComplete="organization"
                  maxLength={120}
                  value={form.businessName}
                  onChange={(event) => updateForm('businessName', event.target.value)}
                />
              </label>
            ) : null}

            <label>
              {form.providerType === 'individual' ? 'CPF' : 'CNPJ'}
              <input
                type="text"
                inputMode="numeric"
                autoComplete="off"
                placeholder={form.providerType === 'individual' ? '000.000.000-00' : '00.000.000/0000-00'}
                value={form.documentNumber}
                onChange={(event) => {
                  updateForm('documentNumber', formatBrazilianDocument(event.target.value));
                  setError('');
                }}
                aria-describedby="service-document-feedback"
                required
              />
              <small
                id="service-document-feedback"
                className={`service-document-feedback${documentDigits.length ? (documentIsValid ? ' valid' : ' invalid') : ''}`}
                aria-live="polite"
              >
                {!documentDigits.length
                  ? `Informe o ${form.providerType === 'individual' ? 'CPF' : 'CNPJ'} do prestador.`
                  : !documentType
                    ? 'Confira o número informado.'
                    : documentType !== (form.providerType === 'individual' ? 'cpf' : 'cnpj')
                      ? `Para este cadastro, informe ${form.providerType === 'individual' ? 'CPF' : 'CNPJ'}.`
                      : documentIsValid
                        ? `${documentType.toUpperCase()} válido.`
                        : `${documentType.toUpperCase()} inválido.`}
              </small>
            </label>

            <label>
              Telefone de contato
              <input
                type="tel"
                autoComplete="tel"
                maxLength={30}
                value={form.phone}
                onChange={(event) => updateForm('phone', event.target.value)}
                required
              />
            </label>

            <label>
              Nome do serviço
              <input
                type="text"
                maxLength={200}
                value={form.serviceName}
                onChange={(event) => updateForm('serviceName', event.target.value)}
                required
              />
            </label>

            <label>
              Categoria
              <select value={form.category} onChange={(event) => updateForm('category', event.target.value)}>
                {serviceCategories.map((category) => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </label>

            <label>
              Cidade / região
              <input
                type="text"
                autoComplete="address-level2"
                maxLength={120}
                value={form.city}
                onChange={(event) => updateForm('city', event.target.value)}
                required
              />
            </label>

            <label>
              Valor inicial (opcional)
              <input
                type="number"
                min="0"
                max="9999999999"
                step="0.01"
                inputMode="decimal"
                placeholder="A combinar"
                value={form.startingPrice}
                onChange={(event) => updateForm('startingPrice', event.target.value)}
              />
            </label>

            <label className="service-description-field">
              Descrição do serviço
              <textarea
                rows={4}
                maxLength={5000}
                value={form.description}
                onChange={(event) => updateForm('description', event.target.value)}
                required
              />
            </label>

            <label className="service-description-field">
              Redes sociais (opcional)
              <textarea
                rows={3}
                placeholder={'Um link por linha, por exemplo:\nhttps://instagram.com/seuperfil'}
                value={form.socialLinks}
                onChange={(event) => updateForm('socialLinks', event.target.value)}
              />
              <small>Informe até 10 links completos, um por linha.</small>
            </label>
          </div>
          </fieldset>

          {error ? <p className="service-form-error" role="alert">{error}</p> : null}
          {successMessage ? <p className="service-form-success" role="status">{successMessage}</p> : null}
          <button type="submit" className="primary-btn" disabled={busy || loading || Boolean(loadError)}>Publicar serviço</button>
        </form>
        {legacyError ? <p className="service-form-error" role="alert">{legacyError}</p> : null}
        {legacyServices.length ? (
          <div>
            <p>Este navegador contém {legacyServices.length} serviço(s) antigo(s) válido(s). A importação é opcional e não apaga os dados locais.</p>
            <button type="button" className="secondary-btn" disabled={busy || loading || Boolean(loadError)} onClick={() => void handleImport()}>
              Importar serviços deste navegador
            </button>
          </div>
        ) : null}
      </section>

      <section className="services-guidance">
        <div className="services-guidance-mark" aria-hidden="true">i</div>
        <div>
          <h2>Informações importantes</h2>
          <p>
            Prazos, custos de entrega e condições para trocas ou devoluções podem variar conforme
            o pedido. Consulte os detalhes disponíveis durante a compra e antes de concluir sua
            solicitação.
          </p>
        </div>
        <Link to="/carrinho" className="secondary-btn">
          Ver meu carrinho
        </Link>
      </section>

      <section className="services-cta">
        <span className="eyebrow">Pronto para encontrar seu próximo favorito?</span>
        <h2>Seu próximo look começa por aqui.</h2>
        <p>Descubra a seleção do Cantinho de Vendas e escolha o que combina com você.</p>
        <Link to="/produtos" className="primary-btn">
          Ver catálogo <span aria-hidden="true">→</span>
        </Link>
      </section>
    </main>
  );
}
