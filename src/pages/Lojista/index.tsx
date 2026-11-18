import { Link, Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { formatBrazilianDocument } from '../../utils/brazilianDocument';

export function PainelLojista() {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (user.accountType !== 'merchant') {
    return <Navigate to="/conta" replace />;
  }

  return (
    <main className="page-shell merchant-dashboard">
      <header className="page-header">
        <h1>Área do lojista</h1>
        <p>Gerencie seu perfil comercial no Cantinho de Vendas.</p>
      </header>

      <section className="merchant-card merchant-profile-card">
        <span className="account-label">Perfil comercial</span>
        <h2>{user.storeName}</h2>
        <div className="account-profile-details">
          <p><strong>Responsável:</strong> {user.name}</p>
          <p><strong>E-mail:</strong> {user.email}</p>
          <p><strong>Telefone:</strong> {user.phone || 'Não informado'}</p>
          <p>
            <strong>{user.documentType?.toUpperCase() ?? 'CPF/CNPJ'}:</strong>{' '}
            {user.documentNumber ? formatBrazilianDocument(user.documentNumber) : 'Não informado'}
          </p>
          <p><strong>Endereço comercial:</strong> {user.businessAddress || 'Não informado'}</p>
        </div>
        <div className="account-actions">
          <Link to="/lojistas" className="secondary-btn">Ver catálogo de lojistas</Link>
          <Link to="/produtos" className="primary-btn">Ver catálogo de produtos</Link>
        </div>
      </section>
    </main>
  );
}
