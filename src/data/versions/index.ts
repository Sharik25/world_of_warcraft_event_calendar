import type { VersionConfig } from '@/domain/types';
import { anniversary } from './anniversary/version';
import { forever } from './forever/version';

/** Version registry. Add a new version: create its folder, then add it to this list. */
export const versions: VersionConfig[] = [anniversary, forever];

export const defaultVersionId = 'anniversary';
