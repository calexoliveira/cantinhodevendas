import { useState, type FormEvent } from 'react';
import { Link } from 'react-router-dom';
import { addServiceListing, getServiceListings, serviceCategories, type ServiceListing, type ServiceProviderType } from '../../data/services';
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
};

export function Servicos() {
  const [form, setForm] = useState(initialForm);
  const [registeredServices, setRegisteredServices] = useState<ServiceListing[]>(getServiceListings);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const documentType = identifyBrazilianDocument(form.documentNumber);
  const documentDigits = getDocumentDigits(form.documentNumber);
  const documentIsValid =
    isValidBrazilianDocument(form.documentNumber) &&
    documentType === (form.providerType === 'individual' ? 'cpf' : 'cnpj');

  const updateForm = <K extends keyof ServiceForm>(field: K, value: ServiceForm[K]) => {
    setForm((current) => ({ ...current, [field]: value }));
    setSuccessMessage('');
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
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

    const listing: ServiceListing = {
      id: `${Date.now()}-${registeredServices.length}`,
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
    };

    try {
      const nextServices = addServiceListing(listing);
      setRegisteredServices(nextServices);
      setForm(initialForm);
      setSuccessMessage('Serviço cadastrado e publicado no catálogo.');
    } catch (storageError) {
      console.error('Não foi possível salvar o cadastro de serviço.', storageError);
      setError('Não foi possível salvar o cadastro. Confira as permissões de armazenamento do navegador.');
    }
  };

  return (
    <main className="page-shell services-page">
      <section className="services-hero">
        <div className="services-hero-copy">
          <span className="eyebrow">Cuidado em cada etapa</span>
          <h1>Uma experiência de compra mais simples, do início ao pós-venda.</h1>
          <p>
            Estamos aqui para ajudar você a escolher, comprar e encontrar as informações de que
            precisa sobre seu pedido.
          </p>
          <Link to="/produtos" className="primary-btn">
            Explorar produtos <span aria-hidden="true">→</span>
          </Link>
          <a href="#cadastrar-servico" className="secondary-btn service-provider-cta">
            Ofereça seu serviço
          </a>
        </div>

        <div className="services-hero-note">
          <span className="services-note-icon" aria-hidden="true">✦</span>
          <p>Seu estilo, suas escolhas e uma loja pronta para acompanhar você.</p>
          <span className="services-note-caption">MINHALOJA · SERVIÇOS</span>
        </div>
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
        </div>

        <form className="service-registration-form" onSubmit={handleSubmit}>
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
                value={form.phone}
                onChange={(event) => updateForm('phone', event.target.value)}
                required
              />
            </label>

            <label>
              Nome do serviço
              <input
                type="text"
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
                value={form.description}
                onChange={(event) => updateForm('description', event.target.value)}
                required
              />
            </label>
          </div>

          {error ? <p className="service-form-error" role="alert">{error}</p> : null}
          {successMessage ? <p className="service-form-success" role="status">{successMessage}</p> : null}
          <button type="submit" className="primary-btn">Publicar serviço</button>
        </form>

        <div className="registered-services">
          <div className="services-section-heading">
            <span className="eyebrow">Encontre um profissional</span>
            <h2>Serviços cadastrados</h2>
          </div>
          {registeredServices.length ? (
            <div className="registered-services-grid">
              {registeredServices.map((service) => (
                <article className="registered-service-card" key={service.id}>
                  <div className="registered-service-topline">
                    <span>{service.category}</span>
                    <span>{service.providerType === 'individual' ? 'Pessoa física' : 'Pessoa jurídica'}</span>
                  </div>
                  <h3>{service.serviceName}</h3>
                  <p>{service.description}</p>
                  <div className="registered-service-details">
                    <span><strong>Prestador:</strong> {service.businessName || service.providerName}</span>
                    <span><strong>Local:</strong> {service.city}</span>
                    <span><strong>Contato:</strong> {service.phone}</span>
                    <span>
                      <strong>Valor inicial:</strong>{' '}
                      {service.startingPrice === undefined
                        ? 'A combinar'
                        : service.startingPrice.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                    </span>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <p className="registered-services-empty">Seja o primeiro prestador a cadastrar um serviço.</p>
          )}
        </div>
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
        <p>Descubra a seleção da Minhaloja e escolha o que combina com você.</p>
        <Link to="/produtos" className="primary-btn">
          Ver catálogo <span aria-hidden="true">→</span>
        </Link>
      </section>
    </main>
  );
}
