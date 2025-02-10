/**
 * @generated SignedSource<<f7f562a9ca049fbdd29a52b1ed948ca2>>
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
    "concreteType": "hira_sopConnection",
    "kind": "LinkedField",
    "name": "hira_sop_connection",
    "plural": false,
    "selections": [
      {
        "alias": null,
        "args": null,
        "concreteType": "hira_sopEdge",
        "kind": "LinkedField",
        "name": "edges",
        "plural": true,
        "selections": [
          {
            "alias": null,
            "args": null,
            "concreteType": "hira_sop",
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
    "name": "findByFirestoreIdSOPQuery",
    "selections": (v1/*: any*/),
    "type": "query_root",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "findByFirestoreIdSOPQuery",
    "selections": (v1/*: any*/)
  },
  "params": {
    "cacheID": "2942250976ed956c58c83695c464eb0d",
    "id": null,
    "metadata": {},
    "name": "findByFirestoreIdSOPQuery",
    "operationKind": "query",
    "text": "query findByFirestoreIdSOPQuery(\n  $firestore_id: String\n) {\n  hira_sop_connection(where: {firestore_id: {_eq: $firestore_id}}) {\n    edges {\n      node {\n        id\n      }\n    }\n  }\n}\n"
  }
};
})();

node.hash = "514e9ef7f77ce2e111240d2c14d16390";

module.exports = node;
