import getDB, { Knex } from "pgknexlove"

const seedSQL = `
INSERT INTO account DEFAULT VALUES;
INSERT INTO account DEFAULT VALUES;
INSERT INTO account DEFAULT VALUES;

UPDATE account_api_key SET key_string='KEY1' WHERE account_id=(
  SELECT account_id FROM account WHERE account_name='user_1'
);
UPDATE account_api_key SET key_string='KEY2' WHERE account_id=(
  SELECT account_id FROM account WHERE account_name='user_2'
);
UPDATE account_api_key SET key_string='KEY3' WHERE account_id=(
  SELECT account_id FROM account WHERE account_name='user_3'
);

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

INSERT INTO tree (tree_name, tree_key, owner_id, tree_def)
  SELECT
    'Getting Started',
    'getting-started',
    (
      SELECT account_id FROM account where account_name='user_3'
    ),
    $JSON$
    {
      "Start Here": {
        "name": "Start Here",
        "order": 0,
        "description": "Welcome to Work Tree! This is an achievement. In each Work Tree, you'll try to complete achievements to unlock more of the tree. Try to unlock this one now!",
        "requirements": {
          "Work Tree.clicked_a_box_to_achieve_something": {
            "mustBe": true
          }
        }
      },
      "Learn Meters": {
        "name": "Learn Meters",
        "order": 0,
        "parent": "Start Here",
        "description": "Meters are measured units of work. In the last achievement, you checked off a meter to complete the achievement. To get this one you'll need to increase the meter beyond a threshold of 250. Go ahead and try!",
        "requirements": {
          "Work Tree.example_meter": {
            "mustBeAtleast": 250
          }
        }
      },
      "Editing Trees": {
        "name": "Editing Trees",
        "order": 0,
        "parent": "Creating Trees",
        "description": "In Work Tree, you'll usually want to create your own trees that reflect what you want to work on, whether it's your fitness, your job, your hobbies or your projects. In the new tree you created (if you lost it just click the home icon at the top), edit the tree to add some things you want to track!",
        "requirements": {
          "Work Tree.edited_a_tree": {
            "mustBe": true
          },
          "Work Tree.achievements_created_in_edit_mode": {
            "mustBeAtleast": 5
          }
        }
      },
      "Creating Trees": {
        "name": "Creating Trees",
        "order": 1,
        "parent": "Learn Meters",
        "description": "You can create trees by clicking \"Create New\" at the top of your screen. Try to create a tree now, then come back!",
        "requirements": {
          "Work Tree.created_a_tree": {
            "mustBe": true
          }
        }
      },
      "Multiple Meters": {
        "name": "Multiple Meters",
        "order": 0,
        "parent": "Learn Meters",
        "description": "Some achievements will have multiple meters. You have to complete all the meters to unlock an achievement.",
        "requirements": {
          "Work Tree.trees_created": {
            "mustBeAtleast": 3
          },
          "Work Tree.changed_my_username": {
            "mustBe": true
          },
          "Work Tree.followed_@seveibar_on_twitter": {
            "mustBe": true
          }
        }
      }
    }$JSON$;

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
`

export default async (db: Knex = null) => {
  if (!db) db = await getDB.default()
  await db.raw(seedSQL)
}
