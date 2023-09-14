export function isProduction() {
  const stagingMode = (process.env.WARTHOG_DB_URL || '').indexOf('_staging') > -1;
  // console.log('stagingMode :>> ', stagingMode);

  const developmentNodeEnv = process.env.NODE_ENV === 'development';
  // console.log('developmentNodeEnv :>> ', developmentNodeEnv);

  return !stagingMode && !developmentNodeEnv;
}
