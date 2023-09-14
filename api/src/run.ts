// Need to call `useContainer` before we import Database or any of our Models/Services
import { Container } from 'typedi';
import { useContainer } from 'typeorm';
import { getContainer } from './core';
import { getDBConnection } from './db/connection';
import { PitchService } from './modules/index';
useContainer(Container);

getDBConnection()
  .then(() => {
    // Need to have DB connection before we access any of our services
    const pitchService = getContainer(PitchService);
    return pitchService.query({}, '123');
  })
  .catch((error: Error) => {
    console.error(error);
  })
  .finally(process.exit);
