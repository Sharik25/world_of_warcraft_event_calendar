import type { EventCatalog, VersionConfig, VersionId } from '@/domain/types';
import { eventCatalog } from './events';
import { versions } from './versions';

/**
 * Data access boundary. v1 reads bundled data; a later implementation can fetch JSON from a
 * CDN with no UI changes, which is why the methods are async.
 */
export interface EventRepository {
  getCatalog(): Promise<EventCatalog>;
  getVersions(): Promise<VersionConfig[]>;
  getVersion(id: VersionId): Promise<VersionConfig | undefined>;
}

export const bundledRepository: EventRepository = {
  getCatalog: async () => eventCatalog,
  getVersions: async () => versions,
  getVersion: async (id) => versions.find((v) => v.id === id),
};
