type SocialLink = {
  label: string;
  icon: 'website' | 'facebook' | 'instagram' | 'linkedin' | 'whatsapp' | 'youtube' | 'x' | 'tiktok' | 'pinterest' | 'telegram' | 'link';
  url: string;
};

function getSocialLink(url: string): Omit<SocialLink, 'url'> {
  const hostname = new URL(url).hostname.toLowerCase().replace(/^www\./, '');
  const matches = [
    [['facebook.com', 'fb.com'], 'facebook', 'Facebook'],
    [['instagram.com'], 'instagram', 'Instagram'],
    [['linkedin.com'], 'linkedin', 'LinkedIn'],
    [['whatsapp.com', 'wa.me'], 'whatsapp', 'WhatsApp'],
    [['youtube.com', 'youtu.be'], 'youtube', 'YouTube'],
    [['twitter.com', 'x.com'], 'x', 'X / Twitter'],
    [['tiktok.com'], 'tiktok', 'TikTok'],
    [['pinterest.com', 'pin.it'], 'pinterest', 'Pinterest'],
    [['telegram.me', 'telegram.org', 't.me'], 'telegram', 'Telegram'],
  ] as const;

  for (const [domains, icon, label] of matches) {
    if (domains.some((domain) => hostname === domain || hostname.endsWith(`.${domain}`))) return { icon, label };
  }
  return { icon: 'link', label: 'Rede social' };
}

function StoreLinkIcon({ icon }: { icon: SocialLink['icon'] }) {
  if (icon === 'website') {
    return <svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="9" /><path d="M3 12h18M12 3a15 15 0 0 1 0 18M12 3a15 15 0 0 0 0 18" /></svg>;
  }
  if (icon === 'instagram') {
    return <svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="3" width="18" height="18" rx="5" /><circle cx="12" cy="12" r="4" /><circle cx="17.5" cy="6.5" r=".75" className="social-icon-fill" /></svg>;
  }
  if (icon === 'youtube') {
    return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M21 8.2a3 3 0 0 0-2.1-2.1C17 5.6 12 5.6 12 5.6s-5 0-6.9.5A3 3 0 0 0 3 8.2 31 31 0 0 0 2.5 12 31 31 0 0 0 3 15.8a3 3 0 0 0 2.1 2.1c1.9.5 6.9.5 6.9.5s5 0 6.9-.5a3 3 0 0 0 2.1-2.1 31 31 0 0 0 .5-3.8 31 31 0 0 0-.5-3.8Z" /><path d="m10 15 5-3-5-3Z" /></svg>;
  }
  if (icon === 'whatsapp') {
    return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M20 11.5a8 8 0 0 1-11.8 7L4 20l1.5-4.1A8 8 0 1 1 20 11.5Z" /><path d="M9 8c.4 2.5 2.5 4.6 5 5l1-1.2" /></svg>;
  }
  if (icon === 'facebook') return <span className="social-icon-letter" aria-hidden="true">f</span>;
  if (icon === 'linkedin') return <span className="social-icon-letter social-icon-linkedin" aria-hidden="true">in</span>;
  if (icon === 'x') return <span className="social-icon-letter" aria-hidden="true">X</span>;
  if (icon === 'telegram') {
    return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="m21 4-3 16-5-4-3 3v-5l9-7-11 6-5-2Z" /></svg>;
  }
  if (icon === 'pinterest') return <span className="social-icon-letter" aria-hidden="true">p</span>;
  if (icon === 'tiktok') {
    return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M14 4v10.5a4.5 4.5 0 1 1-4-4.5M14 4c.7 3 2.4 4.5 5 5" /></svg>;
  }
  return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="m9 15 6-6M7.5 17.5l-1 1a3.5 3.5 0 0 1-5-5l4-4a3.5 3.5 0 0 1 5 0M16.5 6.5l1-1a3.5 3.5 0 0 1 5 5l-4 4a3.5 3.5 0 0 1-5 0" /></svg>;
}

export function StoreLinks({ website, socialLinks }: { website?: string | null; socialLinks?: string[] | null }) {
  const links = [
    ...(website ? [{ label: 'Site', icon: 'website' as const, url: website }] : []),
    ...(socialLinks ?? []).map((url) => ({ ...getSocialLink(url), url })),
  ];
  if (!links.length) return null;

  return (
    <div className="store-links">
      {links.map(({ label, icon, url }, index) => (
        <a key={`${index}-${url}`} href={url} target="_blank" rel="noopener noreferrer" aria-label={label} title={label}>
          <StoreLinkIcon icon={icon} />
        </a>
      ))}
    </div>
  );
}
