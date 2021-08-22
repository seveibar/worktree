// @generated
// Automatically generated. Don't change this file manually.

export type MeterId = string & { " __flavor"?: "meter" };

export default interface Meter {
  /** Primary key. Index: meter_pkey */
  meter_id: MeterId | null;

  /** Index: meter_account_id_meter_key_key */
  account_id: string | null;

  endpoint_id: string | null;

  endpoint_name: string | null;

  meter_name: string | null;

  /** Index: meter_account_id_meter_key_key */
  meter_key: string | null;

  description: string | null;

  output_type: string | null;

  output: unknown | null;

  last_modified_at: Date | null;

  created_at: Date | null;
}
