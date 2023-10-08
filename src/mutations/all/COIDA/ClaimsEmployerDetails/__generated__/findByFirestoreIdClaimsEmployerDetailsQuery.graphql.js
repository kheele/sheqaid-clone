/**
 * @generated SignedSource<<7c29d8a62d25970a20ea14162ce99180>>
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
    "concreteType": "coida_claims_employer_detailsConnection",
    "kind": "LinkedField",
    "name": "coida_claims_employer_details_connection",
    "plural": false,
    "selections": [
      {
        "alias": null,
        "args": null,
        "concreteType": "coida_claims_employer_detailsEdge",
        "kind": "LinkedField",
        "name": "edges",
        "plural": true,
        "selections": [
          {
            "alias": null,
            "args": null,
            "concreteType": "coida_claims_employer_details",
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
    "name": "findByFirestoreIdClaimsEmployerDetailsQuery",
    "selections": (v1/*: any*/),
    "type": "query_root",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "findByFirestoreIdClaimsEmployerDetailsQuery",
    "selections": (v1/*: any*/)
  },
  "params": {
    "cacheID": "d4a66f3e88dd47cfbcb9af62ff8107f7",
    "id": null,
    "metadata": {},
    "name": "findByFirestoreIdClaimsEmployerDetailsQuery",
    "operationKind": "query",
    "text": "query findByFirestoreIdClaimsEmployerDetailsQuery(\n  $firestore_id: String\n) {\n  coida_claims_employer_details_connection(where: {firestore_id: {_eq: $firestore_id}}) {\n    edges {\n      node {\n        id\n      }\n    }\n  }\n}\n"
  }
};
})();

node.hash = "abd7439787e7365401380bdfa5454d88";

module.exports = node;
