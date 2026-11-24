import { useCallback, useEffect, useState } from 'react';
import { apiRequest, errorMessage } from '../../api';

type PendingStore = {
  id: string;
  name: string;
  address: string;
  ownerName: string;
  ownerEmail: string;
};

export function StoreApprovals() {
  const [stores, setStores] = useState<PendingStore[]>([]);
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [error, setError] = useState('');

  const loadStores = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      setStores(await apiRequest<PendingStore[]>('/admin/stores/pending'));
    } catch (reason) {
      setError(errorMessage(reason));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadStores();
  }, [loadStores]);

  const approveStore = async (store: PendingStore) => {
    setBusyId(store.id);
    setError('');
    try {
      await apiRequest(`/admin/stores/${encodeURIComponent(store.id)}/approval`, { method: 'PATCH' });
      setStores((current) => current.filter((item) => item.id !== store.id));
    } catch (reason) {
      setError(errorMessage(reason));
    } finally {
      setBusyId(null);
    }
  };

  return (
    <section className="admin-products store-approvals">
      <h2>Aprovação de lojas</h2>
      {error ? <p className="auth-error" role="alert">{error}</p> : null}
      {loading ? <p>Carregando solicitações...</p> : stores.length ? (
        <div className="admin-product-list">
          {stores.map((store) => (
            <article key={store.id} className="admin-product-item">
              <div>
                <strong>{store.name}</strong>
                <span>Responsável: {store.ownerName}</span>
                <small>{store.ownerEmail}</small>
                <small>{store.address}</small>
              </div>
              <button type="button" className="primary-btn" disabled={busyId !== null}
                onClick={() => void approveStore(store)}>
                {busyId === store.id ? 'Aprovando...' : 'Aprovar loja'}
              </button>
            </article>
          ))}
        </div>
      ) : (
        <div>
          <p>Não há lojas aguardando aprovação.</p>
          <button type="button" className="secondary-btn" onClick={() => void loadStores}>Atualizar</button>
        </div>
      )}
    </section>
  );
}
