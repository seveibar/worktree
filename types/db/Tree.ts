// @generated
// Automatically generated. Don't change this file manually.

export type TreeId = string & { " __flavor"?: 'tree' };

export default interface Tree {
  /** Primary key. Index: tree_pkey */
  tree_id: TreeId | null;

  tree_name: string | null;

  /** Index: tree_owner_id_tree_key_key */
  tree_key: string | null;

  /** Index: tree_owner_id_tree_key_key */
  owner_id: string | null;

  tree_def: unknown | null;

  public: boolean | null;

  last_modified_at: Date | null;

  created_at: Date | null;

  tree_path: string | null;

  owner_name: string | null;

  owner_meter_defs: unknown | null;
}
