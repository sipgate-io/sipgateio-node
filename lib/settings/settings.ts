import {SettingsModule} from "./settings.module";
import {Settings} from "../core/models";
import {HttpClientModule} from "../core/httpClient";

export const createSettingsModule = (client: HttpClientModule): SettingsModule => ({
    async getSettings(): Promise<Settings> {
        console.log(client);
        let returnSettings: Settings = {outgoingUrl: '', incomingUrl: '', log:false, whitelist: []};
        return returnSettings;
    }
})