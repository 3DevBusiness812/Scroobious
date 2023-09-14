import standardConfig from './ormconfig';

// console.log('standardConfig :>> ', standardConfig);

const seedConfig = {
  ...standardConfig,
  migrations: [process.env.WARTHOG_DB_SEEDS],
  cli: {
    migrationsDir: process.env.WARTHOG_DB_SEEDS_DIR,
  },
};

// console.log('seedConfig :>> ', seedConfig);

export default seedConfig;
