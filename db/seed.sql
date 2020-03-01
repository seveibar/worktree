INSERT INTO account DEFAULT VALUES;
INSERT INTO account DEFAULT VALUES;
INSERT INTO account DEFAULT VALUES;

INSERT INTO tree (tree_name, tree_key, owner_id, tree_def)
  SELECT
    'Test Tree',
    'test_tree',
    (
      SELECT account_id FROM account where account_name='user_1'
    ),
    '{
      "Test Tree Start": {
        "name": "Test Tree Start",
        "order": 0,
        "description": "Some description",
        "requirements": {
          "category1.meter1": {
            "mustBeAtleast": 15
          },
          "category1.meter2": {
            "mustIncreaseBy": 50
          }
        }
      },
      "Test Tree End": {
        "name": "Test Tree End",
        "order": 0,
        "parent": "Test Tree Start",
        "requirements": {
          "category1.meter1": {
            "mustBeAtleast": 50
          },
          "category2.meter1": {
            "mustBeAtleast": 100
          }
        }
      }
    }';

INSERT INTO meter (account_id, endpoint_name, meter_name, meter_key, output_type, description)
  SELECT
    (SELECT account_id FROM account WHERE account_name='user_1'),
    category,
    meter_name,
    meter_key,
    'integer',
    ''
  FROM (
    VALUES ('category1', 'meter1', 'category1.meter1'),
           ('category1', 'meter2', 'category1.meter2'),
           ('category2', 'meter1', 'category2.meter1')
  ) as t (category, meter_name, meter_key);
