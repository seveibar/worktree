-- ---------------------- --
-- THIS FILE IS GENERATED --
-- DO NOT EDIT            --
-- ---------------------- --

DO $MAIN$
DECLARE
    db_version integer;
BEGIN
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

CREATE TABLE IF NOT EXISTS "qspg_metakeystore" (
    key_id character varying(255) PRIMARY KEY,
    integer_value integer,
    string_value character varying(255)
);

IF NOT EXISTS (SELECT 1 FROM qspg_metakeystore WHERE key_id='db_version') THEN
    RAISE NOTICE 'Setting db_version to 0';
    INSERT INTO qspg_metakeystore (key_id, integer_value) VALUES ('db_version', 0);
END IF;

db_version := (SELECT integer_value FROM qspg_metakeystore WHERE key_id='db_version');

RAISE NOTICE 'DATABASE VERSION = %', db_version;

-- --------------------------------------------
-- VERSION 1
-- --------------------------------------------

IF (db_version=0) THEN
    RAISE NOTICE 'Migrating db_version to 1';

    -- File Name: v01.sql
    
    CREATE EXTENSION IF NOT EXISTS "pgcrypto";
    
    IF NOT EXISTS (SELECT FROM pg_catalog.pg_roles WHERE rolname='api_user') THEN
      CREATE USER api_user;
    END IF;
    
    GRANT api_user to postgres;
    
    CREATE SCHEMA api;
    
    CREATE TABLE account (
      account_id uuid NOT NULL PRIMARY KEY DEFAULT gen_random_uuid(),
      account_num serial NOT NULL UNIQUE,
      account_name text NOT NULL UNIQUE,
      auth0_id text,
      last_active_at timestamptz NOT NULL DEFAULT current_timestamp,
      created_at timestamptz NOT NULL DEFAULT current_timestamp
    );
    
    CREATE OR REPLACE FUNCTION account_preinsert()
      RETURNS trigger AS $TRIG$
      BEGIN
        IF NEW.account_name IS NULL THEN
          NEW.account_name := 'user_' || NEW.account_num;
        END IF;
        RETURN NEW;
      END
      $TRIG$ LANGUAGE plpgsql;
    
    CREATE TRIGGER account_preinsert_trigger
      BEFORE INSERT ON account
      FOR EACH ROW EXECUTE PROCEDURE account_preinsert();
    
    CREATE TABLE account_api_key (
      account_api_key_id uuid NOT NULL PRIMARY KEY DEFAULT gen_random_uuid(),
      account_id uuid references account NOT NULL,
      key_string text NOT NULL DEFAULT md5(random()::text),
      purpose text,
      last_used_at timestamptz NOT NULL DEFAULT current_timestamp,
      created_at timestamptz NOT NULL DEFAULT current_timestamp
    );
    
    CREATE TABLE tree (
      tree_id uuid NOT NULL PRIMARY KEY DEFAULT gen_random_uuid(),
      tree_name text NOT NULL,
      tree_key text NOT NULL,
      owner_id uuid references account NOT NULL,
      tree_def jsonb NOT NULL,
      public boolean NOT NULL DEFAULT FALSE,
      last_modified_at timestamptz NOT NULL DEFAULT current_timestamp,
      created_at timestamptz NOT NULL DEFAULT current_timestamp
    );
    
    CREATE OR REPLACE FUNCTION change_last_modified()
      RETURNS trigger AS $TRIG$
      BEGIN
        NEW.last_modified_at := current_timestamp;
        RETURN NEW;
      END
      $TRIG$ LANGUAGE plpgsql;
    
    CREATE TRIGGER tree_change_last_modified_trigger
      BEFORE UPDATE ON tree
      FOR EACH ROW EXECUTE PROCEDURE change_last_modified();
    
    CREATE TABLE account_tree (
      account_tree_id uuid NOT NULL PRIMARY KEY DEFAULT gen_random_uuid(),
      account_id uuid references account NOT NULL,
      tree_id uuid references tree NOT NULL,
      state jsonb NOT NULL,
      complete boolean NOT NULL DEFAULT FALSE,
      last_modified_at timestamptz NOT NULL DEFAULT current_timestamp,
      created_at timestamptz NOT NULL DEFAULT current_timestamp
    );
    
    CREATE TRIGGER account_tree_change_last_modified_trigger
      BEFORE UPDATE ON account_tree
      FOR EACH ROW EXECUTE PROCEDURE change_last_modified();
    
    CREATE TABLE endpoint (
      endpoint_id uuid NOT NULL PRIMARY KEY DEFAULT gen_random_uuid(),
      endpoint_name text NOT NULL,
      endpoint_key text NOT NULL,
      endpoint_def jsonb NOT NULL,
      owner_account_id uuid references account,
      public boolean NOT NULL DEFAULT FALSE,
      created_at timestamptz NOT NULL DEFAULT current_timestamp
    );
    
    CREATE TABLE account_endpoint (
      account_endpoint_id uuid NOT NULL PRIMARY KEY DEFAULT gen_random_uuid(),
      account_id uuid references account NOT NULL,
      endpoint_id uuid references endpoint NOT NULL,
      params jsonb NOT NULL DEFAULT '{}',
      error text,
      created_at timestamptz NOT NULL DEFAULT current_timestamp
    );
    
    CREATE TABLE meter (
      meter_id uuid NOT NULL PRIMARY KEY DEFAULT gen_random_uuid(),
      account_id uuid NOT NULL,
      endpoint_id uuid references endpoint,
      endpoint_name text,
      meter_name text NOT NULL,
      meter_key text NOT NULL,
      description text NOT NULL,
      output_type text NOT NULL,
      output jsonb,
      last_modified_at timestamptz NOT NULL DEFAULT current_timestamp,
      created_at timestamptz NOT NULL DEFAULT current_timestamp
    );
    
    CREATE VIEW api.meter AS SELECT * FROM meter;
    CREATE VIEW api.tree AS SELECT * FROM tree;
    CREATE VIEW api.account AS SELECT * FROM account;
    CREATE VIEW api.account_tree AS SELECT * FROM account_tree;
    CREATE VIEW api.account_api_key AS SELECT * FROM account_api_key;
    CREATE VIEW api.account_endpoint AS SELECT * FROM account_endpoint;
    CREATE VIEW api.endpoint AS SELECT * FROM endpoint;
    
    ALTER VIEW api.meter OWNER TO api_user;
    ALTER VIEW api.tree OWNER TO api_user;
    ALTER VIEW api.account OWNER TO api_user;
    ALTER VIEW api.account_tree OWNER TO api_user;
    ALTER VIEW api.account_api_key OWNER TO api_user;
    ALTER VIEW api.account_endpoint OWNER TO api_user;
    ALTER VIEW api.endpoint OWNER TO api_user;
    
    GRANT ALL PRIVILEGES ON SCHEMA api TO api_user;
    GRANT ALL ON ALL TABLES IN SCHEMA api TO api_user;
    
    GRANT ALL PRIVILEGES ON SCHEMA public TO api_user;
    GRANT ALL ON ALL TABLES IN SCHEMA public TO api_user;
    

    UPDATE qspg_metakeystore SET integer_value=1 WHERE key_id='db_version';
    db_version := (SELECT integer_value FROM qspg_metakeystore WHERE key_id='db_version');
END IF;



END
$MAIN$ LANGUAGE plpgsql;
