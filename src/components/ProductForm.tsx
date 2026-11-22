import { useState, type FormEvent } from 'react';
import { errorMessage } from '../api';
import { isValidGtin } from '../../shared/gtin';
import { discountedPrice } from '../../shared/productPrice';
import { parseProductCategory, productCategories, type NewProduct } from '../data/products';

const initialForm = {
  name: '', category: 'Roupas', price: '', discount: '', gtin: '',
  brand: '', model: '', color: '', size: '', weightKg: '', packageLengthCm: '',
  packageWidthCm: '', packageHeightCm: '', description: '', stock: '10', sku: '',
  warrantyMonths: '12', deliveryDays: '3', freeShipping: false,
  rating: '4.8', reviews: '0', badge: '',
};

export function ProductForm({ isAdmin, onSubmit }: {
  isAdmin: boolean;
  onSubmit: (product: NewProduct) => Promise<void>;
}) {
  const [form, setForm] = useState(initialForm);
  const [condition, setCondition] = useState<'novo' | 'usado' | 'recondicionado'>('novo');
  const [image, setImage] = useState('');
  const [imageKey, setImageKey] = useState(0);
  const [imageLoading, setImageLoading] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  const setField = <K extends keyof typeof initialForm>(field: K, value: (typeof initialForm)[K]) => {
    setForm((current) => ({ ...current, [field]: value }));
  };
  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError('');
    if (!image) {
      setError('Selecione uma imagem do produto.');
      return;
    }
    if (condition === 'novo' && !isValidGtin(form.gtin.trim())) {
      setError('Informe um código universal (GTIN) válido para o produto novo.');
      return;
    }
    const optionalNumber = (value: string) => value ? Number(value) : undefined;
    const product: NewProduct = {
      name: form.name.trim(), category: parseProductCategory(form.category),
      price: Number(form.price), discountPercent: optionalNumber(form.discount),
      condition,
      gtin: condition === 'novo' ? form.gtin.trim() : undefined,
      image, brand: form.brand.trim() || undefined, model: form.model.trim() || undefined,
      color: form.color.trim() || undefined, size: form.size.trim() || undefined,
      weightKg: optionalNumber(form.weightKg), packageLengthCm: optionalNumber(form.packageLengthCm),
      packageWidthCm: optionalNumber(form.packageWidthCm), packageHeightCm: optionalNumber(form.packageHeightCm),
      stock: Number(form.stock), sku: form.sku.trim() || undefined,
      warrantyMonths: Number(form.warrantyMonths), deliveryDays: Number(form.deliveryDays),
      freeShipping: form.freeShipping, description: form.description.trim() || 'Produto cadastrado pela loja.',
      rating: isAdmin ? Number(form.rating) : 0, reviews: isAdmin ? Number(form.reviews) : 0,
      badge: isAdmin ? form.badge.trim() || undefined : undefined, featured: true,
    };
    setBusy(true);
    try {
      await onSubmit(product);
      setForm(initialForm);
      setCondition('novo');
      setImage('');
      setImageKey((current) => current + 1);
    } catch (reason) {
      setError(errorMessage(reason));
    } finally {
      setBusy(false);
    }
  };

  const price = Number(form.price);
  const discount = Number(form.discount);
  const showFinalPrice = form.price !== '' && form.discount !== '' && Number.isFinite(price)
    && Number.isFinite(discount) && price >= 0 && price <= 9999999999 && discount >= 0 && discount <= 100;

  return (
    <form className="admin-form" onSubmit={handleSubmit}>
      <fieldset className="product-form-fields" disabled={busy || imageLoading}>
        <label>Nome
          <input value={form.name} maxLength={200} onChange={(event) => setField('name', event.target.value)} required />
        </label>
        <label>Imagem do produto
          <input key={imageKey} type="file" accept="image/png,image/jpeg,image/webp,image/gif" required
            onChange={(event) => {
              const input = event.currentTarget;
              const file = input.files?.[0];
              input.setCustomValidity('');
              setImage('');
              setError('');
              if (!file) return;
              if (!['image/png', 'image/jpeg', 'image/webp', 'image/gif'].includes(file.type) || !file.size || file.size > 2 * 1024 * 1024) {
                const message = 'Escolha uma imagem PNG, JPEG, WebP ou GIF de até 2 MB.';
                input.setCustomValidity(message);
                setError(message);
                return;
              }
              const reader = new FileReader();
              setImageLoading(true);
              reader.onload = () => {
                if (typeof reader.result === 'string') setImage(reader.result);
              };
              reader.onerror = () => {
                const message = 'Não foi possível ler a imagem. Tente novamente.';
                input.setCustomValidity(message);
                setError(message);
              };
              reader.onloadend = () => setImageLoading(false);
              reader.readAsDataURL(file);
            }}
          />
          <small>PNG, JPEG, WebP ou GIF, até 2 MB.</small>
        </label>
        {image ? <img className="product-upload-preview" src={image} alt="Prévia da imagem do produto" /> : null}
        <div className="two-column">
          <label>Categoria
            <select value={form.category} onChange={(event) => setField('category', event.target.value)}>
              {productCategories.map((category) => <option key={category} value={category}>{category}</option>)}
            </select>
          </label>
          <label>Condição
            <select value={condition} onChange={(event) => {
              const value = event.target.value;
              if (value === 'novo' || value === 'usado' || value === 'recondicionado') setCondition(value);
            }}>
              <option value="novo">Novo</option>
              <option value="usado">Usado</option>
              <option value="recondicionado">Recondicionado</option>
            </select>
          </label>
        </div>
        {condition === 'novo' ? (
          <label>Código universal do produto (GTIN)
            <input value={form.gtin} inputMode="numeric" maxLength={14} onChange={(event) => setField('gtin', event.target.value)} required />
            <small>Informe o código de barras com 8, 12, 13 ou 14 dígitos.</small>
          </label>
        ) : null}
        <div className="two-column">
          <label>Preço (R$)
            <input type="number" min="0" max="9999999999" step="0.01" value={form.price} onChange={(event) => setField('price', event.target.value)} required />
          </label>
          <label>Desconto (%)
            <input type="number" min="0" max="100" step="0.01" value={form.discount} onChange={(event) => setField('discount', event.target.value)} />
          </label>
        </div>
        {showFinalPrice ? <p>Preço após desconto: {discountedPrice(price, discount).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</p> : null}
        <div className="two-column">
          <label>Marca (opcional)
            <input value={form.brand} maxLength={100} onChange={(event) => setField('brand', event.target.value)} />
          </label>
          <label>Modelo (opcional)
            <input value={form.model} maxLength={100} onChange={(event) => setField('model', event.target.value)} />
          </label>
        </div>
        <div className="two-column">
          <label>Cor (opcional)
            <input value={form.color} maxLength={100} onChange={(event) => setField('color', event.target.value)} />
          </label>
          <label>Tamanho (opcional)
            <input value={form.size} maxLength={100} onChange={(event) => setField('size', event.target.value)} />
          </label>
        </div>
        <div className="two-column">
          <label>Estoque
            <input type="number" min="0" max="100000000" step="1" value={form.stock} onChange={(event) => setField('stock', event.target.value)} required />
          </label>
          <label>SKU (opcional)
            <input value={form.sku} maxLength={100} onChange={(event) => setField('sku', event.target.value)} />
          </label>
        </div>
        <div className="two-column">
          <label>Peso da embalagem (kg, opcional)
            <input type="number" min="0.001" max="9999999.999" step="0.001" value={form.weightKg} onChange={(event) => setField('weightKg', event.target.value)} />
          </label>
          <label>Comprimento da embalagem (cm, opcional)
            <input type="number" min="0.01" max="99999999.99" step="0.01" value={form.packageLengthCm} onChange={(event) => setField('packageLengthCm', event.target.value)} />
          </label>
        </div>
        <div className="two-column">
          <label>Largura da embalagem (cm, opcional)
            <input type="number" min="0.01" max="99999999.99" step="0.01" value={form.packageWidthCm} onChange={(event) => setField('packageWidthCm', event.target.value)} />
          </label>
          <label>Altura da embalagem (cm, opcional)
            <input type="number" min="0.01" max="99999999.99" step="0.01" value={form.packageHeightCm} onChange={(event) => setField('packageHeightCm', event.target.value)} />
          </label>
        </div>
        <div className="two-column">
          <label>Garantia (meses)
            <input type="number" min="0" max="1200" step="1" value={form.warrantyMonths} onChange={(event) => setField('warrantyMonths', event.target.value)} required />
          </label>
          <label>Prazo de entrega (dias)
            <input type="number" min="1" max="3650" step="1" value={form.deliveryDays} onChange={(event) => setField('deliveryDays', event.target.value)} required />
          </label>
        </div>
        <label>Frete grátis
          <input type="checkbox" checked={form.freeShipping} onChange={(event) => setField('freeShipping', event.target.checked)} />
        </label>
        {isAdmin ? (
          <>
            <div className="two-column">
              <label>Avaliação
                <input type="number" min="0" max="5" step="0.1" value={form.rating} onChange={(event) => setField('rating', event.target.value)} required />
              </label>
              <label>Avaliações
                <input type="number" min="0" max="100000000" step="1" value={form.reviews} onChange={(event) => setField('reviews', event.target.value)} required />
              </label>
            </div>
            <label>Badge
              <input value={form.badge} maxLength={100} onChange={(event) => setField('badge', event.target.value)} />
            </label>
          </>
        ) : null}
        <label>Descrição
          <textarea rows={4} maxLength={5000} value={form.description} onChange={(event) => setField('description', event.target.value)} />
        </label>
      </fieldset>
      {error ? <p className="auth-error" role="alert">{error}</p> : null}
      <button type="submit" className="primary-btn" disabled={busy || imageLoading}>Publicar produto</button>
    </form>
  );
}
