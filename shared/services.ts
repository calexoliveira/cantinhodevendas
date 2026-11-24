import { z } from 'zod';
import { getDocumentDigits, identifyBrazilianDocument, isValidBrazilianDocument } from '../src/utils/brazilianDocument';
import { socialLinksSchema } from './socialLinks';

export const serviceCategories = [
  'Casa e manutenção',
  'Beleza e bem-estar',
  'Consultoria',
  'Educação',
  'Tecnologia',
  'Outros',
] as const;

const serviceFields = {
  providerType: z.enum(['individual', 'company']),
  providerName: z.string().trim().min(1).max(120),
  businessName: z.string().trim().max(120).optional(),
  serviceName: z.string().trim().min(1).max(200),
  category: z.enum(serviceCategories),
  description: z.string().trim().min(1).max(5000),
  phone: z.string().trim().min(1).max(30).refine((value) => /\d/.test(value)),
  city: z.string().trim().min(1).max(120),
  startingPrice: z.number().finite().min(0).max(9999999999).multipleOf(0.01).optional(),
  socialLinks: socialLinksSchema.optional(),
};

export const serviceAdminUpdateSchema = z.object(serviceFields).strict();

export const serviceRegistrationSchema = z.object({
  providerType: serviceFields.providerType,
  providerName: serviceFields.providerName,
  businessName: serviceFields.businessName,
  documentNumber: z.string().max(32).refine(isValidBrazilianDocument).transform(getDocumentDigits),
  serviceName: serviceFields.serviceName,
  category: serviceFields.category,
  description: serviceFields.description,
  phone: serviceFields.phone,
  city: serviceFields.city,
  startingPrice: serviceFields.startingPrice,
  socialLinks: serviceFields.socialLinks,
}).strict().refine(
  (service) => identifyBrazilianDocument(service.documentNumber) === (service.providerType === 'individual' ? 'cpf' : 'cnpj'),
  { message: 'Informe um CPF ou CNPJ válido para o tipo de prestador.', path: ['documentNumber'] },
);

export type ServiceRegistration = z.infer<typeof serviceRegistrationSchema>;
export type ServiceProviderType = ServiceRegistration['providerType'];
export type ServiceAdminUpdate = z.infer<typeof serviceAdminUpdateSchema>;

export type ServiceListing = Omit<ServiceRegistration, 'documentNumber' | 'socialLinks'> & { id: string; socialLinks: string[] };
