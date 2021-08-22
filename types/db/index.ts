// @generated
// Automatically generated. Don't change this file manually.

import Account, { AccountId } from './Account';
import AccountAPIKey, { AccountAPIKeyId } from './AccountAPIKey';
import AccountEndpoint, { AccountEndpointId } from './AccountEndpoint';
import AccountTree, { AccountTreeId } from './AccountTree';
import Endpoint, { EndpointId } from './Endpoint';
import Meter, { MeterId } from './Meter';
import Tree, { TreeId } from './Tree';

type Model =
  | Account
  | AccountAPIKey
  | AccountEndpoint
  | AccountTree
  | Endpoint
  | Meter
  | Tree

interface ModelTypeMap {
  'account': Account;
  'account_api_key': AccountAPIKey;
  'account_endpoint': AccountEndpoint;
  'account_tree': AccountTree;
  'endpoint': Endpoint;
  'meter': Meter;
  'tree': Tree;
}

type ModelId =
  | AccountId
  | AccountAPIKeyId
  | AccountEndpointId
  | AccountTreeId
  | EndpointId
  | MeterId
  | TreeId

interface ModelIdTypeMap {
  'account': AccountId;
  'account_api_key': AccountAPIKeyId;
  'account_endpoint': AccountEndpointId;
  'account_tree': AccountTreeId;
  'endpoint': EndpointId;
  'meter': MeterId;
  'tree': TreeId;
}

type Initializer =

interface InitializerTypeMap {
}

export type {
  Account, AccountId,
  AccountAPIKey, AccountAPIKeyId,
  AccountEndpoint, AccountEndpointId,
  AccountTree, AccountTreeId,
  Endpoint, EndpointId,
  Meter, MeterId,
  Tree, TreeId,

  Model,
  ModelTypeMap,
  ModelId,
  ModelIdTypeMap,
  Initializer,
  InitializerTypeMap
};
