import { useState, type FormEvent } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export function Login() {
  const navigate = useNavigate();
  const { user, login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  if (user) {
    return <Navigate to={user.accountType === 'merchant' ? '/lojista/painel' : '/conta'} replace />;
  }

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError('');

    const accountType = login(email, password);

    if (!accountType) {
      setError('E-mail ou senha inválidos.');
      return;
    }

    navigate(accountType === 'merchant' ? '/lojista/painel' : '/conta');
  };

  return (
    <main className="login-shell">
      <section className="login-card">
        <h1>Entrar</h1>
        <p>Acesse sua conta para continuar no Cantinho de Vendas.</p>

        <form className="login-form" onSubmit={handleSubmit}>
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
              autoComplete="current-password"
              placeholder="Sua senha"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              required
            />
          </label>

          {error ? <p className="auth-error" role="alert">{error}</p> : null}

          <button type="submit" className="login-btn">
            Fazer login
          </button>
        </form>

        <div className="registration-links">
          <span>Primeiro acesso?</span>
          <Link to="/cadastro/usuario" className="secondary-btn">Criar conta de usuário</Link>
          <Link to="/cadastro/lojista" className="secondary-btn">Cadastrar minha loja</Link>
        </div>
      </section>
    </main>
  );
}
