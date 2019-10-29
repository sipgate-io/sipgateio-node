import axios from "axios";
import {createSettingsModule} from "./settings";

describe('Settings Module', () => {
    const instance = axios.create();
    const settingsModule = createSettingsModule(instance);
    it('should exist on client object', () => {
        expect(settingsModule instanceof Function);
    });

    it('should contain getSettings method', () => {
        expect(settingsModule.getSettings() instanceof Function);
    });
});

describe('getSettings Method', () => {

    it('should return a successfully Response 200', () => {

    })

    it('should return a Bad Request Response 403', () => {
    });
})


