CREATE EXTENSION IF NOT EXISTS "pgcrypto";

IF NOT EXISTS (SELECT FROM pg_catalog.pg_roles WHERE rolname='api_user') THEN
  CREATE USER api_user;
END IF;

GRANT api_user to postgres;

CREATE SCHEMA api;
CREATE SCHEMA super_api;
ALTER SCHEMA api OWNER TO api_user;

CREATE TABLE account (
  account_id uuid NOT NULL PRIMARY KEY DEFAULT gen_random_uuid(),
  account_num serial NOT NULL UNIQUE,
  account_name text NOT NULL UNIQUE,
  auth0_id text,
  last_active_at timestamptz NOT NULL DEFAULT current_timestamp,
  created_at timestamptz NOT NULL DEFAULT current_timestamp
);

CREATE OR REPLACE FUNCTION new_account()
  RETURNS trigger AS $TRIG$
  BEGIN
    IF NEW.account_name IS NULL THEN
      NEW.account_name := 'user_' || NEW.account_num;
    END IF;
    RETURN NEW;
  END
  $TRIG$ LANGUAGE plpgsql;

CREATE TRIGGER new_account_trigger
  BEFORE INSERT ON account
  FOR EACH ROW EXECUTE PROCEDURE new_account();

CREATE TABLE account_api_key (
  account_api_key_id uuid NOT NULL PRIMARY KEY DEFAULT gen_random_uuid(),
  account_id uuid references account NOT NULL,
  key_string text NOT NULL DEFAULT md5(random()::text),
  purpose text,
  last_used_at timestamptz NOT NULL DEFAULT current_timestamp,
  created_at timestamptz NOT NULL DEFAULT current_timestamp
);

CREATE OR REPLACE FUNCTION create_new_account_api_key()
  RETURNS trigger AS $TRIG$
  BEGIN
    INSERT INTO account_api_key (account_id, purpose) VALUES (NEW.account_id, 'Default');
    RETURN NULL;
  END
  $TRIG$ LANGUAGE plpgsql;

CREATE TRIGGER create_new_account_api_key_trigger
  AFTER INSERT ON account
  FOR EACH ROW EXECUTE PROCEDURE create_new_account_api_key();

CREATE TABLE tree (
  tree_id uuid NOT NULL PRIMARY KEY DEFAULT gen_random_uuid(),
  tree_num serial NOT NULL UNIQUE,
  tree_name text NOT NULL UNIQUE,
  tree_key text NOT NULL UNIQUE,
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

CREATE OR REPLACE FUNCTION new_tree()
  RETURNS trigger AS $TRIG$
  BEGIN
    IF NEW.tree_name IS NULL THEN
      NEW.tree_name := 'Tree ' || NEW.tree_num;
    END IF;
    IF NEW.tree_key IS NULL THEN
      NEW.tree_key := 'tree_' || NEW.tree_num;
    END IF;
    IF NEW.tree_def IS NULL THEN
      NEW.tree_def := '{"New Tree":{"name":"New Tree","description": "What is the first thing you will unlock\?"}}';
    END IF;
    RETURN NEW;
  END
  $TRIG$ LANGUAGE plpgsql;

CREATE TRIGGER new_tree_trigger
  BEFORE INSERT ON tree
  FOR EACH ROW EXECUTE PROCEDURE new_tree();

CREATE TABLE account_tree (
  account_tree_id uuid NOT NULL PRIMARY KEY DEFAULT gen_random_uuid(),
  account_id uuid references account NOT NULL,
  tree_id uuid references tree NOT NULL,
  state jsonb NOT NULL DEFAULT '{}',
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
  endpoint_options jsonb,
  endpoint_url text,
  official boolean NOT NULL DEFAULT FALSE,
  owner_account_id uuid references account,
  public boolean NOT NULL DEFAULT FALSE,
  created_at timestamptz NOT NULL DEFAULT current_timestamp
);

CREATE TABLE account_endpoint (
  account_endpoint_id uuid NOT NULL PRIMARY KEY DEFAULT gen_random_uuid(),
  account_id uuid references account NOT NULL,
  endpoint_id uuid references endpoint NOT NULL,
  params jsonb NOT NULL DEFAULT '{}',
  run_frequency_secs integer NOT NULL DEFAULT 300,
  error text,
  last_run_at timestamptz NOT NULL DEFAULT current_timestamp,
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

CREATE OR REPLACE FUNCTION meter_limit_checker()
  RETURNS trigger AS $TRIG$
  BEGIN
    IF (
      SELECT COUNT(*) FROM meter WHERE meter.account_id = NEW.account_id
    ) >= 1000 THEN
      RAISE EXCEPTION 'You can only have 1,000 meters!';
    END IF;
    RETURN NEW;
  END
  $TRIG$ LANGUAGE plpgsql;

CREATE TRIGGER meter_limit_checker_trigger
  BEFORE INSERT ON meter
  FOR EACH ROW EXECUTE PROCEDURE meter_limit_checker();

CREATE VIEW super_api.account_api_key AS SELECT * FROM account_api_key;
CREATE VIEW super_api.account AS SELECT * FROM account;
CREATE VIEW super_api.meter AS SELECT * FROM meter;

CREATE VIEW api.meter AS SELECT * FROM meter;
CREATE VIEW api.tree AS SELECT
  tree_id,
  tree_name,
  tree_key,
  owner_id,
  tree_def,
  public,
  last_modified_at,
  created_at,
  (
    SELECT account_name || '/' || tree_key FROM super_api.account
      WHERE account.account_id=owner_id
  ) as tree_path,
  (
    SELECT account_name FROM super_api.account
      WHERE account.account_id=owner_id
  ) as owner_name,
  (
    SELECT
      jsonb_object_agg(
        requirements.meter_key,
        (
          SELECT jsonb_build_object(
            'meter_name', meter.meter_name,
            'meter_key', meter.meter_key,
            'endpoint_name', meter.endpoint_name,
            'endpoint_id', meter.endpoint_id,
            'description', meter.description,
            'output_type', meter.output_type
          ) FROM super_api.meter
            WHERE meter.meter_key = requirements.meter_key AND meter.account_id = owner_id
        )
      )
    FROM (
      SELECT
        jsonb_object_keys(tree_def->tree_names_set.tree_name->'requirements') as meter_key
      FROM (
        SELECT jsonb_object_keys(tree.tree_def) as tree_name
      ) as tree_names_set
    ) as requirements
  ) as owner_meter_defs
FROM tree;

CREATE VIEW api.account AS SELECT * FROM account;
CREATE VIEW api.account_tree AS SELECT
  account_tree_id,
  account_id,
  tree_id,
  state,
  complete,
  last_modified_at,
  created_at,
  (
    SELECT tree_key FROM tree WHERE tree.tree_id=account_tree.tree_id
  ) as tree_key,
  (
    SELECT tree_name FROM tree WHERE tree.tree_id=account_tree.tree_id
  ) as tree_name,
  (
    SELECT account_name || '/' || (
      SELECT tree_key FROM tree WHERE tree.tree_id=account_tree.tree_id
    ) FROM account
      WHERE account.account_id=account_tree.account_id
  ) as tree_path
FROM account_tree;
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
ALTER VIEW api.account_api_key OWNER TO api_user;

GRANT ALL PRIVILEGES ON SCHEMA api TO api_user;
GRANT ALL ON ALL TABLES IN SCHEMA api TO api_user;

GRANT ALL PRIVILEGES ON SCHEMA public TO api_user;
GRANT ALL ON ALL TABLES IN SCHEMA public TO api_user;
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO api_user;

GRANT ALL PRIVILEGES ON SCHEMA super_api TO api_user;
GRANT SELECT ON super_api.account_api_key TO api_user;
GRANT SELECT ON super_api.account TO api_user;
GRANT SELECT ON super_api.meter TO api_user;

ALTER TABLE meter ENABLE ROW LEVEL SECURITY;
ALTER TABLE account ENABLE ROW LEVEL SECURITY;
ALTER TABLE account_tree ENABLE ROW LEVEL SECURITY;
ALTER TABLE endpoint ENABLE ROW LEVEL SECURITY;
ALTER TABLE tree ENABLE ROW LEVEL SECURITY;
ALTER TABLE account_endpoint ENABLE ROW LEVEL SECURITY;
ALTER TABLE account_api_key ENABLE ROW LEVEL SECURITY;

CREATE FUNCTION auth_account_id() RETURNS uuid as $BODY$
  DECLARE account_id uuid;
  BEGIN
    account_id := (
      SELECT account_api_key.account_id
        FROM super_api.account_api_key
        WHERE key_string=current_setting('request.header.apikey', 't')
    );
    RETURN account_id;
  END
$BODY$ LANGUAGE plpgsql;

CREATE POLICY account_access ON account FOR ALL TO api_user
  USING (
    account.account_id=auth_account_id()
  );

CREATE POLICY tree_access ON tree FOR ALL TO api_user
  USING (
    tree.public OR
    tree.owner_id=auth_account_id()
  );

CREATE POLICY meter_access ON meter FOR ALL TO api_user
  USING (
    meter.account_id=auth_account_id()
  );

CREATE POLICY account_tree_access ON account_tree FOR ALL TO api_user
  USING (
    account_tree.account_id=auth_account_id()
  );

CREATE POLICY endpoint_access ON endpoint FOR ALL TO api_user
  USING (
    endpoint.official OR
    endpoint.public OR
    endpoint.owner_account_id=auth_account_id()
  );

CREATE POLICY account_endpoint_access ON account_endpoint FOR ALL TO api_user
  USING (
    account_endpoint.account_id=auth_account_id()
  );

CREATE POLICY account_api_key_access ON account_api_key FOR ALL TO api_user
  USING (
    account_api_key.account_id=auth_account_id()
  );
