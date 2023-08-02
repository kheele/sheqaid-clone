/**
 * @generated SignedSource<<7d0620d30916919b515b7ffef2d04c56>>
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
    "name": "id"
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
                "variableName": "id"
              }
            ],
            "kind": "ObjectValue",
            "name": "id"
          }
        ],
        "kind": "ObjectValue",
        "name": "where"
      }
    ],
    "concreteType": "sheq_non_conformance_progressConnection",
    "kind": "LinkedField",
    "name": "sheq_non_conformance_progress_connection",
    "plural": false,
    "selections": [
      {
        "alias": null,
        "args": null,
        "concreteType": "sheq_non_conformance_progressEdge",
        "kind": "LinkedField",
        "name": "edges",
        "plural": true,
        "selections": [
          {
            "alias": null,
            "args": null,
            "concreteType": "sheq_non_conformance_progress",
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
              },
              {
                "alias": null,
                "args": null,
                "kind": "ScalarField",
                "name": "outstanding",
                "storageKey": null
              },
              {
                "alias": null,
                "args": null,
                "kind": "ScalarField",
                "name": "notes",
                "storageKey": null
              },
              {
                "alias": null,
                "args": null,
                "kind": "ScalarField",
                "name": "date",
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
    "name": "findByIdNCRProgressQuery",
    "selections": (v1/*: any*/),
    "type": "query_root",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "findByIdNCRProgressQuery",
    "selections": (v1/*: any*/)
  },
  "params": {
    "cacheID": "6ed8cf7201fdeb7a5b40d41b697dc1eb",
    "id": null,
    "metadata": {},
    "name": "findByIdNCRProgressQuery",
    "operationKind": "query",
    "text": "query findByIdNCRProgressQuery(\n  $id: bigint\n) {\n  sheq_non_conformance_progress_connection(where: {id: {_eq: $id}}) {\n    edges {\n      node {\n        id\n        outstanding\n        notes\n        date\n      }\n    }\n  }\n}\n"
  }
};
})();

node.hash = "c83fd45530b624ede17d5cd8429d83cc";

module.exports = node;
