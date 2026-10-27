import { redirect, type LoaderFunctionArgs } from 'react-router';
import { bundledRepository } from '@/data/repository';
import { defaultVersionId } from '@/data/versions';
import type { EventCatalog, VersionConfig } from '@/domain/types';
import { addDays } from '@/engine/time';
import { useSettings } from '@/state/settings';
import { paths } from '../paths';

const repository = bundledRepository;

export interface VersionLoaderData {
  version: VersionConfig;
  catalog: EventCatalog;
}

/** `/` → last used version's Today. */
export async function rootLoader() {
  const versions = await repository.getVersions();
  const last = useSettings.getState().versionId;
  const id = versions.some((v) => v.id === last) ? last : defaultVersionId;
  return redirect(paths.today(id));
}

export async function versionLoader({ params }: LoaderFunctionArgs): Promise<VersionLoaderData> {
  const version = params.versionId ? await repository.getVersion(params.versionId) : undefined;
  if (!version) throw new Response('Unknown version', { status: 404 });
  return { version, catalog: await repository.getCatalog() };
}

export function isValidLocalDate(date: string | undefined): date is string {
  if (!date || !/^\d{4}-\d{2}-\d{2}$/.test(date)) return false;
  return addDays(date, 0) === date;
}

/** `/:versionId/day/:date` with a malformed date → Today. */
export function dayLoader({ params }: LoaderFunctionArgs) {
  if (!isValidLocalDate(params.date))
    return redirect(paths.today(params.versionId ?? defaultVersionId));
  return null;
}

/** `/:versionId` → its Today view. */
export function versionIndexLoader({ params }: LoaderFunctionArgs) {
  return redirect(paths.today(params.versionId ?? defaultVersionId));
}
