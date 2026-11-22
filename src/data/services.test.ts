import assert from 'node:assert/strict';
import { test } from 'node:test';
import { parseLegacyServices } from './services';

test('preserves valid legacy services while reporting invalid entries', () => {
  const data = [
    {
      id: 'legacy-1', providerType: 'individual', providerName: 'Prestador',
      documentNumber: '529.982.247-25', serviceName: 'Reparo', category: 'Tecnologia',
      description: 'Descrição', phone: '11999999999', city: 'Cidade',
    },
    { id: 'legacy-2', documentNumber: 'invalid' },
  ];
  const result = parseLegacyServices(JSON.stringify(data));
  assert.equal(result.invalidCount, 1);
  assert.equal(result.services.length, 1);
  assert.equal(result.services[0].legacyId, 'legacy-1');
  assert.equal(result.services[0].service.documentNumber, '52998224725');
  assert.deepEqual(parseLegacyServices(null), { services: [], invalidCount: 0 });
});
