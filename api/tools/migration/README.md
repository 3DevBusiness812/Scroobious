# Bubble Data Migration

- Un-scrub user.email and user.password
- Export all data from Bubble to fresh CSVs and put in the `/data` directory
- Make sure we're aimed at the `Local` environment and run `./tools/migration/run.sh`

## Steps to actually run migration

### Give Direct access to the DB in Render

- [Staging](https://dashboard.render.com/d/dpg-c86i4tf9re0jh7g681eg)
- [Production](https://dashboard.render.com/d/dpg-c4ng1cc1nokd81strv8g)

### Drop all of the tables

Run this to get the drop statement:

```sql
SELECT 'DROP TABLE IF EXISTS "' || tablename || '" CASCADE;'
FROM pg_tables
WHERE schemaname = 'public'
ORDER BY tablename;
```

This will give you a bunch of `DROP TABLE` statements.

```sql
DROP TABLE IF EXISTS "accreditation_status" CASCADE;
DROP TABLE IF EXISTS "auth_account" CASCADE;
```

### Run DB schema migrations/seeds

In Staging, set `SKIP_USER_REGISTRATION_CHECKS` to true.

Go into render and re-deploy the API to run all migrations and seeds.

- [Staging](https://dashboard.render.com/web/srv-c86iauv9re0jh7g68570)
- [Production](https://dashboard.render.com/web/srv-c4ng2os1nokd81strvog)

Then in Staging, set `SKIP_USER_REGISTRATION_CHECKS` to false.

### Run Bubble migration

Run the migration run command found at the bottom of `.env.local` for the environment you're migrating
