import { Service } from 'typedi';
import { Config } from 'warthog';

@Service('WarthogConfigService')
export class WarthogConfigService extends Config {}
