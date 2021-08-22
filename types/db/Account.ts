// @generated
// Automatically generated. Don't change this file manually.

export type AccountId = string & { " __flavor"?: 'account' };

export default interface Account {
  /** Primary key. Index: account_pkey */
  account_id: AccountId | null;

  /** Index: account_account_num_key */
  account_num: number | null;

  /** Index: account_account_name_key */
  account_name: string | null;

  /** Index: account_email_key */
  email: string | null;

  auth0_id: string | null;

  last_active_at: Date | null;

  created_at: Date | null;
}
