# Eastern Western database setup

The API stores products, blogs, orders, customers, site content and system flags in MySQL/MariaDB. Six `ew_*` tables keep each entity's JSON fields intact, including variants, nested content, password hashes and existing IDs. Queries and writes use bound parameters.

## Hostinger environment

Create a MySQL database and user under Databases → Management. Set these **server** environment variables in hPanel:

- `DB_HOST`: the internal hostname provided by Hostinger (normally `localhost`)
- `DB_PORT`: `3306`
- `DB_NAME`, `DB_USER`, `DB_PASSWORD`: full prefixed credentials
- Keep `ADMIN_PASSWORD`, `ADMIN_TOKEN`, and `CUSTOMER_TOKEN_SECRET` unchanged.

Alternatively set `DATABASE_URL=mysql://user:percent-encoded-password@host:3306/database`. It takes precedence over individual variables. Use `DB_SSL=true` only with a remote server providing a trusted certificate. Never commit real credentials.

The API creates its own tables. Database failures return HTTP 503; a configured database never silently falls back to local JSON files. Local JSON mode remains available only for development without MySQL configuration.

## One-time MongoDB migration

1. Back up the source and pause writes during cutover. Keep existing MongoDB variables, customer signing secret, and uploaded media intact.
2. Point the MySQL variables at a **new empty database**. Set `MIGRATE_FROM_MONGODB=true` and retain the existing `MONGODB_URI` / `MONGODB_DB`.
3. Deploy. Before accepting traffic, startup reads the six source collections in a MongoDB snapshot, includes any existing local fallback records, and imports into a MySQL transaction. Existing IDs, password hashes, Unicode and nested values survive. The MongoDB source is read-only.
4. The importer verifies each document and each collection's count before committing, then records `mysqlMigrationV1`. An error rolls back the import and prevents the new API from serving traffic. Nonempty destinations without that marker are rejected. Restarting after success skips the import.
5. Check `/api/health` returns `{"ok":true,"database":"mysql"}`, then verify public data, customer login and existing orders. Set `MIGRATE_FROM_MONGODB=false` after verification. Preserve the old database for rollback; remove the source URI from the environment when rollback is no longer needed.

Do not switch back to the old MongoDB release after new MySQL writes without reconciling those writes first. MongoDB remains an application dependency only for the import utility; normal requests use MySQL exclusively.

## Validation

`npm test` runs configuration and SQL-injection checks.

For the integration suite, set `TEST_DATABASE_URL` to a **local disposable MySQL/MariaDB server** whose user can create/drop databases, then run `npm test`. The suite creates a random `ew_test_*` database and drops only that database afterward. It checks transactional rollback, import fidelity/idempotence, customer authentication, order ownership, admin CRUD and database-outage behavior.

`npm run build` checks the frontend build.
