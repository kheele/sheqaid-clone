/**
 * @generated SignedSource<<b90b228ae2d9472a8220ba230290ba03>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* eslint-disable */

'use strict';

var node = (function(){
var v0 = [
  {
    "defaultValue": null,
    "kind": "LocalArgument",
    "name": "object"
  }
],
v1 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "id",
  "storageKey": null
},
v2 = [
  (v1/*: any*/),
  {
    "alias": null,
    "args": null,
    "kind": "ScalarField",
    "name": "name",
    "storageKey": null
  }
],
v3 = [
  {
    "alias": null,
    "args": [
      {
        "kind": "Variable",
        "name": "object",
        "variableName": "object"
      }
    ],
    "concreteType": "coida_claims_coid_provider_requests",
    "kind": "LinkedField",
    "name": "insert_coida_claims_coid_provider_requests_one",
    "plural": false,
    "selections": [
      (v1/*: any*/),
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
        "selections": (v2/*: any*/),
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
          (v1/*: any*/)
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
        "selections": (v2/*: any*/),
        "storageKey": null
      },
      {
        "alias": null,
        "args": null,
        "concreteType": "default_clients",
        "kind": "LinkedField",
        "name": "client",
        "plural": false,
        "selections": (v2/*: any*/),
        "storageKey": null
      }
    ],
    "storageKey": null
  }
];
return {
  "fragment": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Fragment",
    "metadata": null,
    "name": "insertClaimsProviderRequestMutation",
    "selections": (v3/*: any*/),
    "type": "mutation_root",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "insertClaimsProviderRequestMutation",
    "selections": (v3/*: any*/)
  },
  "params": {
    "cacheID": "de538a02b16600d851eee402c052c77e",
    "id": null,
    "metadata": {},
    "name": "insertClaimsProviderRequestMutation",
    "operationKind": "mutation",
    "text": "mutation insertClaimsProviderRequestMutation(\n  $object: coida_claims_coid_provider_requests_insert_input!\n) {\n  insert_coida_claims_coid_provider_requests_one(object: $object) {\n    id\n    created_at\n    status\n    receipient_coid_provider {\n      id\n      name\n    }\n    user {\n      id\n    }\n    company {\n      id\n      name\n    }\n    client {\n      id\n      name\n    }\n  }\n}\n"
  }
};
})();

node.hash = "e17202cb0106a22c830916c3fbe2af58";

module.exports = node;
