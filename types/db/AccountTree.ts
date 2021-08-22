// @generated
// Automatically generated. Don't change this file manually.

export type AccountTreeId = string & { " __flavor"?: "account_tree" };

export default interface AccountTree {
  /** Primary key. Index: account_tree_pkey */
  account_tree_id: AccountTreeId | null;

  account_id: string | null;

  tree_id: string | null;

  state: unknown | null;

  complete: boolean | null;

  last_modified_at: Date | null;

  created_at: Date | null;

  tree_key: string | null;

  tree_name: string | null;

  tree_path: string | null;
}
