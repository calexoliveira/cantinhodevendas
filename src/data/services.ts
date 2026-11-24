import { z } from 'zod';
import { apiRequest } from '../api';
import {
  serviceRegistrationSchema,
  type ServiceAdminUpdate,
  type ServiceRegistration,
} from '../../shared/services';

export { serviceCategories } from '../../shared/services';
export type { ServiceListing, ServiceProviderType, ServiceRegistration } from '../../shared/services';

const SERVICES_STORAGE_KEY = 'minhaloja.services';

export function getServiceListings() {
  return apiRequest<import('../../shared/services').ServiceListing[]>('/services');
}

export function updateServiceListing(id: string, service: ServiceAdminUpdate) {
  return apiRequest<import('../../shared/services').ServiceListing>(`/services/${encodeURIComponent(id)}`, {
    method: 'PUT',
    body: JSON.stringify(service),
  });
}

export function deleteServiceListing(id: string) {
  return apiRequest<void>(`/services/${encodeURIComponent(id)}`, { method: 'DELETE' });
}

export function getLegacyServices(): { services: { legacyId: string; service: ServiceRegistration }[]; invalidCount: number } {
  return parseLegacyServices(window.localStorage.getItem(SERVICES_STORAGE_KEY));
}

export function parseLegacyServices(storedValue: string | null): { services: { legacyId: string; service: ServiceRegistration }[]; invalidCount: number } {
  if (!storedValue) return { services: [], invalidCount: 0 };

  const entries = z.array(z.unknown()).parse(JSON.parse(storedValue));
  const services: { legacyId: string; service: ServiceRegistration }[] = [];
  let invalidCount = 0;
  for (const entry of entries) {
    const parsedEntry = z.object({ id: z.string().min(1).max(200) }).passthrough().safeParse(entry);
    if (!parsedEntry.success) {
      invalidCount++;
      continue;
    }
    const { id, ...service } = parsedEntry.data;
    const parsedService = serviceRegistrationSchema.safeParse(service);
    if (!parsedService.success) {
      invalidCount++;
      continue;
    }
    services.push({ legacyId: id, service: parsedService.data });
  }
  return { services, invalidCount };
}

export function importLegacyServices(entries: { legacyId: string; service: ServiceRegistration }[]) {
  return apiRequest<import('../../shared/services').ServiceListing[]>('/services/import', {
    method: 'POST',
    body: JSON.stringify({ services: entries }),
  });
}
