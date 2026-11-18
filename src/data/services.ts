export type ServiceProviderType = 'individual' | 'company';

export type ServiceListing = {
  id: string;
  providerType: ServiceProviderType;
  providerName: string;
  businessName?: string;
  documentNumber: string;
  serviceName: string;
  category: string;
  description: string;
  phone: string;
  city: string;
  startingPrice?: number;
};

export const serviceCategories = [
  'Casa e manutenção',
  'Beleza e bem-estar',
  'Consultoria',
  'Educação',
  'Tecnologia',
  'Outros',
];

const SERVICES_STORAGE_KEY = 'minhaloja.services';

export function getServiceListings(): ServiceListing[] {
  if (typeof window === 'undefined') {
    return [];
  }

  const storedValue = window.localStorage.getItem(SERVICES_STORAGE_KEY);

  if (!storedValue) {
    return [];
  }

  try {
    const storedServices = JSON.parse(storedValue) as ServiceListing[];
    if (Array.isArray(storedServices)) {
      return storedServices;
    }

    console.error('Os dados salvos de serviços não estão no formato esperado.');
    return [];
  } catch (error) {
    console.error('Não foi possível carregar os serviços cadastrados.', error);
    return [];
  }
}

export function addServiceListing(service: ServiceListing) {
  const nextServices = [service, ...getServiceListings()];
  window.localStorage.setItem(SERVICES_STORAGE_KEY, JSON.stringify(nextServices));
  return nextServices;
}
