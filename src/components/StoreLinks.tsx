export function StoreLinks({ website, socialLinks }: { website?: string | null; socialLinks?: string[] | null }) {
  const links = [
    ...(website ? [{ label: 'Site', url: website }] : []),
    ...(socialLinks ?? []).map((url, index) => ({ label: `Rede social ${index + 1}`, url })),
  ];
  if (!links.length) return null;

  return (
    <div className="store-links">
      {links.map(({ label, url }, index) => (
        <a key={`${index}-${url}`} href={url} target="_blank" rel="noopener noreferrer">{label}</a>
      ))}
    </div>
  );
}
