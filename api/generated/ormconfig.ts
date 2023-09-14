import {Container} from 'typedi';
import { Database } from 'warthog';
Container.import([Database]);
const database = Container.get('Database') as Database;

module.exports = database.getBaseConfig();    
