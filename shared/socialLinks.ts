import { z } from 'zod';

export const webLink = z.string().trim().max(2048).url().refine(
  (value) => /^https?:\/\//i.test(value),
  'Use um endereço iniciado por http:// ou https://.',
);

export const socialLinksSchema = z.array(webLink).max(10);

export function parseSocialLinks(value: string) {
  return socialLinksSchema.safeParse(value.split('\n').map((link) => link.trim()).filter(Boolean));
}
