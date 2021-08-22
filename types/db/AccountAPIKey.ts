// @generated
// Automatically generated. Don't change this file manually.

export type AccountAPIKeyId = string & { " __flavor"?: "account_api_key" };

export default interface AccountAPIKey {
  /** Primary key. Index: account_api_key_pkey */
  account_api_key_id: AccountAPIKeyId | null;

  account_id: string | null;

  key_string: string | null;

  purpose: string | null;

  last_used_at: Date | null;

  created_at: Date | null;
}
