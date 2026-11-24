import { useEffect, useState } from 'react';
import { errorMessage } from '../api';
import {
  deleteServiceListing,
  getServiceListings,
  updateServiceListing,
  type ServiceListing,
} from '../data/services';
import type { ServiceAdminUpdate } from '../../shared/services';

export function useServices() {
  const [services, setServices] = useState<ServiceListing[]>([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    let active = true;
    setLoading(true);
    setError('');
    getServiceListings().then((items) => {
      if (active) setServices(items);
    }).catch((reason: unknown) => {
      if (active) setError(errorMessage(reason));
    }).finally(() => {
      if (active) setLoading(false);
    });
    return () => { active = false; };
  }, [attempt]);

  const addServices = (items: ServiceListing[]) => {
    setServices((current) => {
      const unique = [...new Map(items.map((service) => [service.id, service])).values()];
      const ids = new Set(unique.map((service) => service.id));
      return [...unique, ...current.filter((service) => !ids.has(service.id))];
    });
  };
  const updateService = async (id: string, service: ServiceAdminUpdate) => {
    const updated = await updateServiceListing(id, service);
    setServices((current) => current.map((item) => item.id === id ? updated : item));
  };
  const removeService = async (id: string) => {
    await deleteServiceListing(id);
    setServices((current) => current.filter((item) => item.id !== id));
  };
  return {
    services, error, loading, addServices, updateService, removeService,
    retry: () => setAttempt((current) => current + 1),
  };
}
