// @generated
// Automatically generated. Don't change this file manually.

export type EndpointId = string & { " __flavor"?: "endpoint" };

export default interface Endpoint {
  /** Primary key. Index: endpoint_pkey */
  endpoint_id: EndpointId | null;

  endpoint_name: string | null;

  endpoint_key: string | null;

  endpoint_options: unknown | null;

  endpoint_url: string | null;

  official: boolean | null;

  owner_account_id: string | null;

  public: boolean | null;

  created_at: Date | null;
}
