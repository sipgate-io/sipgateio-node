import { Settings } from '../core/models';

export interface SettingsModule {
    getSettings:  () => Promise<Settings>
}
