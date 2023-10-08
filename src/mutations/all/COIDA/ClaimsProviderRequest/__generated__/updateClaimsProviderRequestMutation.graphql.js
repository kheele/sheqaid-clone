/**
 * @generated SignedSource<<f31a6c15a9ef5af1b2170854f16bfc6a>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* eslint-disable */

'use strict';

var node = (function(){
var v0 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "_set"
},
v1 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "id"
},
v2 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "id",
  "storageKey": null
},
v3 = [
  (v2/*: any*/),
  {
    "alias": null,
    "args": null,
    "kind": "ScalarField",
    "name": "name",
    "storageKey": null
  }
],
v4 = [
  {
    "alias": null,
    "args": [
      {
        "kind": "Variable",
        "name": "_set",
        "variableName": "_set"
      },
      {
        "kind": "Variable",
        "name": "pk_columns",
        "variableName": "id"
      }
    ],
    "concreteType": "coida_claims_coid_provider_requests",
    "kind": "LinkedField",
    "name": "update_coida_claims_coid_provider_requests_by_pk",
    "plural": false,
    "selections": [
      (v2/*: any*/),
      {
        "alias": null,
        "args": null,
        "kind": "ScalarField",
        "name": "created_at",
        "storageKey": null
      },
      {
        "alias": null,
        "args": null,
        "kind": "ScalarField",
        "name": "status",
        "storageKey": null
      },
      {
        "alias": null,
        "args": null,
        "concreteType": "default_companies",
        "kind": "LinkedField",
        "name": "receipient_coid_provider",
        "plural": false,
        "selections": (v3/*: any*/),
        "storageKey": null
      },
      {
        "alias": null,
        "args": null,
        "concreteType": "default_users",
        "kind": "LinkedField",
        "name": "user",
        "plural": false,
        "selections": [
          (v2/*: any*/)
        ],
        "storageKey": null
      },
      {
        "alias": null,
        "args": null,
        "concreteType": "default_companies",
        "kind": "LinkedField",
        "name": "company",
        "plural": false,
        "selections": (v3/*: any*/),
        "storageKey": null
      },
      {
        "alias": null,
        "args": null,
        "concreteType": "default_clients",
        "kind": "LinkedField",
        "name": "client",
        "plural": false,
        "selections": (v3/*: any*/),
        "storageKey": null
      }
    ],
    "storageKey": null
  }
];
return {
  "fragment": {
    "argumentDefinitions": [
      (v0/*: any*/),
      (v1/*: any*/)
    ],
    "kind": "Fragment",
    "metadata": null,
    "name": "updateClaimsProviderRequestMutation",
    "selections": (v4/*: any*/),
    "type": "mutation_root",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": [
      (v1/*: any*/),
      (v0/*: any*/)
    ],
    "kind": "Operation",
    "name": "updateClaimsProviderRequestMutation",
    "selections": (v4/*: any*/)
  },
  "params": {
    "cacheID": "56325f5414a240a5bbf92e8b1b264f20",
    "id": null,
    "metadata": {},
    "name": "updateClaimsProviderRequestMutation",
    "operationKind": "mutation",
    "text": "mutation updateClaimsProviderRequestMutation(\n  $id: coida_claims_coid_provider_requests_pk_columns_input!\n  $_set: coida_claims_coid_provider_requests_set_input!\n) {\n  update_coida_claims_coid_provider_requests_by_pk(pk_columns: $id, _set: $_set) {\n    id\n    created_at\n    status\n    receipient_coid_provider {\n      id\n      name\n    }\n    user {\n      id\n    }\n    company {\n      id\n      name\n    }\n    client {\n      id\n      name\n    }\n  }\n}\n"
  }
};
})();

node.hash = "fce3793008e58ec573024e4cb12956be";

module.exports = node;
