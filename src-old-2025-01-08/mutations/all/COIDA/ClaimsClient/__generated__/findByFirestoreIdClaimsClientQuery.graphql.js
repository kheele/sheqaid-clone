/**
 * @generated SignedSource<<a198315cf2cbb696b35c2f5b9293309a>>
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
    "concreteType": "coida_claimsConnection",
    "kind": "LinkedField",
    "name": "coida_claims_connection",
    "plural": false,
    "selections": [
      {
        "alias": null,
        "args": null,
        "concreteType": "coida_claimsEdge",
        "kind": "LinkedField",
        "name": "edges",
        "plural": true,
        "selections": [
          {
            "alias": null,
            "args": null,
            "concreteType": "coida_claims",
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
    "name": "findByFirestoreIdClaimsClientQuery",
    "selections": (v1/*: any*/),
    "type": "query_root",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "findByFirestoreIdClaimsClientQuery",
    "selections": (v1/*: any*/)
  },
  "params": {
    "cacheID": "c7d4191988813fd1623e2595dfbf68d6",
    "id": null,
    "metadata": {},
    "name": "findByFirestoreIdClaimsClientQuery",
    "operationKind": "query",
    "text": "query findByFirestoreIdClaimsClientQuery(\n  $firestore_id: String\n) {\n  coida_claims_connection(where: {firestore_id: {_eq: $firestore_id}}) {\n    edges {\n      node {\n        id\n      }\n    }\n  }\n}\n"
  }
};
})();

node.hash = "909aea089e92f901c91d602a8a8ad911";

module.exports = node;
