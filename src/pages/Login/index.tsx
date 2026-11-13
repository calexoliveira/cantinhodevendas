import { useState, type FormEvent } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export function Login() {
  const navigate = useNavigate();
  const { user, login, register } = useAuth();
  const [isRegistering, setIsRegistering] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  if (user) {
    return <Navigate to="/" replace />;
  }

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError('');

    if (isRegistering) {
      const success = register(name, email, password);

      if (!success) {
        setError('Usuário já existe ou os dados estão inválidos.');
        return;
      }

      navigate('/');
      return;
    }

    const success = login(email, password);

    if (!success) {
      setError('E-mail ou senha inválidos. Use admin@minhaloja.com / admin123');
      return;
    }

    navigate('/');
  };

  return (
    <main className="login-shell">
      <section className="login-card">
        <div className="auth-toggle">
          <button type="button" className={!isRegistering ? 'active' : ''} onClick={() => setIsRegistering(false)}>
            Entrar
          </button>
          <button type="button" className={isRegistering ? 'active' : ''} onClick={() => setIsRegistering(true)}>
            Criar conta
          </button>
        </div>

        <h1>{isRegistering ? 'Criar conta' : 'Entrar'}</h1>
        <p>Continue sua jornada na Minhaloja.</p>

        <form className="login-form" onSubmit={handleSubmit}>
          {isRegistering ? (
            <label>
              Nome
              <input type="text" placeholder="Seu nome" value={name} onChange={(event) => setName(event.target.value)} required />
            </label>
          ) : null}

          <label>
            E-mail
            <input type="email" placeholder="seu@email.com" value={email} onChange={(event) => setEmail(event.target.value)} required />
          </label>

          <label>
            Senha
            <input type="password" placeholder="••••••••" value={password} onChange={(event) => setPassword(event.target.value)} required />
          </label>

          {error ? <p className="auth-error">{error}</p> : null}

          <button type="submit" className="login-btn">
            {isRegistering ? 'Criar conta' : 'Fazer login'}
          </button>
        </form>
      </section>
    </main>
  );
}
