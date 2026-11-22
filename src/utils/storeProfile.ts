import type { StoreProfile } from '../context/AuthContext';

export type StoreProfileForm = {
  logo: string | null;
  website: string;
  socialLinks: string;
};

export function parseStoreProfile(form: StoreProfileForm): StoreProfile {
  const website = form.website.trim();
  const socialLinks = form.socialLinks.split('\n').map((link) => link.trim()).filter(Boolean);
  const isWebLink = (value: string) => {
    try {
      const url = new URL(value);
      return /^https?:\/\//i.test(value) && value.length <= 2048 && (url.protocol === 'http:' || url.protocol === 'https:');
    } catch {
      return false;
    }
  };
  if ((website && !isWebLink(website)) || socialLinks.some((link) => !isWebLink(link))) {
    throw new Error('Informe links completos iniciados por http:// ou https://.');
  }
  if (socialLinks.length > 10) throw new Error('Informe no máximo 10 redes sociais.');
  return { storeLogo: form.logo, storeWebsite: website || null, storeSocialLinks: socialLinks };
}
