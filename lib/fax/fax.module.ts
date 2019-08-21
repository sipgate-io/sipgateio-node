import { Fax } from '../core/models';

export interface FaxModule {
  send: (fax: Fax) => Promise<boolean>;
}
