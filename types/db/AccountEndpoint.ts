// @generated
// Automatically generated. Don't change this file manually.

export type AccountEndpointId = string & { " __flavor"?: 'account_endpoint' };

export default interface AccountEndpoint {
  /** Primary key. Index: account_endpoint_pkey */
  account_endpoint_id: AccountEndpointId | null;

  account_id: string | null;

  endpoint_id: string | null;

  params: unknown | null;

  run_frequency_secs: number | null;

  error: string | null;

  last_run_at: Date | null;

  created_at: Date | null;
}
