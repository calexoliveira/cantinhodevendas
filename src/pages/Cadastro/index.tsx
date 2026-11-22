import { useState, type FormEvent } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import type { AccountType } from '../../context/AuthContext';
import { useAuth } from '../../context/useAuth';
import { errorMessage } from '../../api';
import { StoreProfileFields } from '../../components/StoreProfileFields';
import { parseStoreProfile, type StoreProfileForm } from '../../utils/storeProfile';
import {
  formatBrazilianDocument,
  getDocumentDigits,
  identifyBrazilianDocument,
  isValidBrazilianDocument,
} from '../../utils/brazilianDocument';

function Cadastro({ accountType }: { accountType: AccountType }) {
  const navigate = useNavigate();
  const { user, register } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [documentNumber, setDocumentNumber] = useState('');
  const [storeName, setStoreName] = useState('');
  const [businessAddress, setBusinessAddress] = useState('');
  const [storeProfile, setStoreProfile] = useState<StoreProfileForm>({ logo: null, website: '', socialLinks: '' });
  const [logoLoading, setLogoLoading] = useState(false);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const isMerchant = accountType === 'merchant';
  const accountPath = isMerchant ? '/lojista/painel' : '/conta';
  const documentType = identifyBrazilianDocument(documentNumber);
  const documentDigits = getDocumentDigits(documentNumber);
  const documentIsValid = isValidBrazilianDocument(documentNumber);

  if (user) {
    return <Navigate to={user.accountType === 'merchant' ? '/lojista/painel' : '/conta'} replace />;
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError('');

    if (!documentIsValid) {
      setError('Informe um CPF ou CNPJ válido.');
      return;
    }

    setBusy(true);
    try {
      await register({
        name,
        email,
        password,
        accountType,
        documentNumber,
        phone,
        storeName,
        businessAddress,
        ...(isMerchant ? parseStoreProfile(storeProfile) : {}),
      });
      navigate(accountPath);
    } catch (reason) {
      setError(errorMessage(reason));
    } finally {
      setBusy(false);
    }
  };

  return (
    <main className="login-shell">
      <section className="login-card registration-card">
        <h1>{isMerchant ? 'Cadastro de lojista' : 'Cadastro de usuário'}</h1>
        <p>
          {isMerchant
            ? 'Informe seus dados e os dados da sua loja para criar seu perfil comercial.'
            : 'Crie sua conta para comprar e acompanhar seus pedidos.'}
        </p>

        <form className="login-form" onSubmit={handleSubmit}>
          <label>
            Nome completo
            <input
              type="text"
              autoComplete="name"
              placeholder="Seu nome"
              value={name}
              onChange={(event) => setName(event.target.value)}
              required
            />
          </label>

          <label>
            Telefone
            <input
              type="tel"
              autoComplete="tel"
              inputMode="tel"
              placeholder="(00) 00000-0000"
              value={phone}
              onChange={(event) => setPhone(event.target.value)}
              required
            />
          </label>

          <label>
            {documentType === 'cpf' ? 'CPF' : documentType === 'cnpj' ? 'CNPJ' : 'CPF ou CNPJ'}
            <input
              type="text"
              inputMode="numeric"
              autoComplete="off"
              placeholder="Digite seu CPF ou CNPJ"
              value={documentNumber}
              onChange={(event) => {
                setDocumentNumber(formatBrazilianDocument(event.target.value));
                setError('');
              }}
              required
            />
            <small
              className={`document-feedback${documentDigits.length ? (documentIsValid ? ' valid' : ' invalid') : ''}`}
              aria-live="polite"
            >
              {!documentDigits.length
                ? 'O tipo será identificado automaticamente.'
                : !documentType
                  ? 'Informe 11 dígitos para CPF ou 14 para CNPJ.'
                  : documentIsValid
                    ? `${documentType.toUpperCase()} válido.`
                    : `${documentType.toUpperCase()} inválido.`}
            </small>
          </label>

          {isMerchant ? (
            <>
              <label>
                Nome da loja
                <input
                  type="text"
                  autoComplete="organization"
                  placeholder="Nome da sua loja"
                  value={storeName}
                  onChange={(event) => setStoreName(event.target.value)}
                  required
                />
              </label>

              <label>
                Endereço comercial
                <input
                  type="text"
                  autoComplete="street-address"
                  placeholder="Rua, número, bairro, cidade e CEP"
                  value={businessAddress}
                  onChange={(event) => setBusinessAddress(event.target.value)}
                  required
                />
              </label>
              <StoreProfileFields value={storeProfile} onChange={setStoreProfile} onReadingChange={setLogoLoading} />
            </>
          ) : null}

          <label>
            E-mail
            <input
              type="email"
              autoComplete="email"
              placeholder="seu@email.com"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
            />
          </label>

          <label>
            Senha
            <input
              type="password"
              autoComplete="new-password"
              placeholder="Crie uma senha"
              minLength={8}
              maxLength={72}
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              required
            />
          </label>

          {error ? <p className="auth-error" role="alert">{error}</p> : null}

          <button type="submit" className="login-btn" disabled={busy || logoLoading}>
            {isMerchant ? 'Criar cadastro da loja' : 'Criar conta'}
          </button>
        </form>

        <p className="registration-login-link">
          Já tem cadastro? <Link to="/login">Entrar</Link>
        </p>
      </section>
    </main>
  );
}

export function CadastroUsuario() {
  return <Cadastro accountType="customer" />;
}

export function CadastroLojista() {
  return <Cadastro accountType="merchant" />;
}
