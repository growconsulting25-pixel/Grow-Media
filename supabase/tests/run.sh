#!/usr/bin/env bash
# Runs the schema + RLS tests against a throwaway local Postgres database.
# Requires a local Postgres (psql). Set PGHOST/PGPORT/PGUSER as needed.
set -euo pipefail
cd "$(dirname "$0")/.."
DB="gm_test_$$"
psql -q -c "create database $DB"
trap 'psql -q -c "drop database if exists $DB" >/dev/null' EXIT
psql -q -t -v ON_ERROR_STOP=1 -d "$DB" -f tests/supabase-stubs.sql $(ls migrations/*.sql | sed 's/^/-f /') -f tests/rls.test.sql 2>&1 | grep -E "ok -|ERROR|PASSED"
