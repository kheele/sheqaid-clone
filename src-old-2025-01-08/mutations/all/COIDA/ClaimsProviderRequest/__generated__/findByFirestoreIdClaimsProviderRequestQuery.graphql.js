/**
 * @generated SignedSource<<dc516a5beeb9157615d359f43004cd48>>
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
    "name": "firestore_id"
  }
],
v1 = [
  {
    "alias": null,
    "args": [
      {
        "fields": [
          {
            "fields": [
              {
                "kind": "Variable",
                "name": "_eq",
                "variableName": "firestore_id"
              }
            ],
            "kind": "ObjectValue",
            "name": "firestore_id"
          }
        ],
        "kind": "ObjectValue",
        "name": "where"
      }
    ],
    "concreteType": "coida_claims_coid_provider_requestsConnection",
    "kind": "LinkedField",
    "name": "coida_claims_coid_provider_requests_connection",
    "plural": false,
    "selections": [
      {
        "alias": null,
        "args": null,
        "concreteType": "coida_claims_coid_provider_requestsEdge",
        "kind": "LinkedField",
        "name": "edges",
        "plural": true,
        "selections": [
          {
            "alias": null,
            "args": null,
            "concreteType": "coida_claims_coid_provider_requests",
            "kind": "LinkedField",
            "name": "node",
            "plural": false,
            "selections": [
              {
                "alias": null,
                "args": null,
                "kind": "ScalarField",
                "name": "id",
                "storageKey": null
              }
            ],
            "storageKey": null
          }
        ],
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
    "name": "findByFirestoreIdClaimsProviderRequestQuery",
    "selections": (v1/*: any*/),
    "type": "query_root",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "findByFirestoreIdClaimsProviderRequestQuery",
    "selections": (v1/*: any*/)
  },
  "params": {
    "cacheID": "48010d4b5c8e1ed6cf463d65c78ad945",
    "id": null,
    "metadata": {},
    "name": "findByFirestoreIdClaimsProviderRequestQuery",
    "operationKind": "query",
    "text": "query findByFirestoreIdClaimsProviderRequestQuery(\n  $firestore_id: String\n) {\n  coida_claims_coid_provider_requests_connection(where: {firestore_id: {_eq: $firestore_id}}) {\n    edges {\n      node {\n        id\n      }\n    }\n  }\n}\n"
  }
};
})();

node.hash = "89bd0de0f627a1228b0f96846a6b0670";

module.exports = node;
