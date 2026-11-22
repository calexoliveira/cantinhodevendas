import { useRef, useState, type Dispatch, type SetStateAction } from 'react';
import type { StoreProfileForm } from '../utils/storeProfile';

export function StoreProfileFields({ value, onChange, onReadingChange }: {
  value: StoreProfileForm;
  onChange: Dispatch<SetStateAction<StoreProfileForm>>;
  onReadingChange: (reading: boolean) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const readerRef = useRef<FileReader | null>(null);
  const [fileError, setFileError] = useState('');

  const clearLogo = () => {
    readerRef.current?.abort();
    if (inputRef.current) {
      inputRef.current.value = '';
      inputRef.current.setCustomValidity('');
    }
    setFileError('');
    onChange((current) => ({ ...current, logo: null }));
  };

  return (
    <>
      <label>
        Logo da marca (opcional)
        <input
          ref={inputRef}
          type="file"
          accept="image/png,image/jpeg,image/webp,image/gif"
          onChange={(event) => {
            const input = event.currentTarget;
            readerRef.current?.abort();
            input.setCustomValidity('');
            setFileError('');
            const file = input.files?.[0];
            if (!file) return;
            if (!['image/png', 'image/jpeg', 'image/webp', 'image/gif'].includes(file.type) || file.size === 0 || file.size > 256 * 1024) {
              const message = 'Escolha uma imagem PNG, JPEG, WebP ou GIF de até 256 KB.';
              input.setCustomValidity(message);
              setFileError(message);
              return;
            }
            const reader = new FileReader();
            readerRef.current = reader;
            onReadingChange(true);
            reader.onload = () => {
              const logo = reader.result;
              if (typeof logo === 'string') onChange((current) => ({ ...current, logo }));
            };
            reader.onerror = () => {
              const message = 'Não foi possível ler a imagem. Tente novamente.';
              input.setCustomValidity(message);
              setFileError(message);
            };
            reader.onloadend = () => onReadingChange(false);
            reader.readAsDataURL(file);
          }}
        />
        <small>PNG, JPEG, WebP ou GIF, até 256 KB.</small>
      </label>
      {fileError ? <p className="auth-error" role="alert">{fileError}</p> : null}
      {value.logo ? (
        <div className="store-logo-preview">
          <img className="store-logo" src={value.logo} alt="Prévia do logo da marca" />
          <button type="button" className="secondary-btn" onClick={clearLogo}>Remover logo</button>
        </div>
      ) : null}
      <label>
        Site da loja (opcional)
        <input
          type="url"
          maxLength={2048}
          placeholder="https://www.sualoja.com.br"
          value={value.website}
          onChange={(event) => {
            const website = event.target.value;
            onChange((current) => ({ ...current, website }));
          }}
        />
      </label>
      <label>
        Redes sociais (opcional)
        <textarea
          rows={3}
          placeholder={'Um link por linha, por exemplo:\nhttps://instagram.com/sualoja'}
          value={value.socialLinks}
          onChange={(event) => {
            const socialLinks = event.target.value;
            onChange((current) => ({ ...current, socialLinks }));
          }}
        />
        <small>Informe até 10 links completos, um por linha.</small>
      </label>
    </>
  );
}
