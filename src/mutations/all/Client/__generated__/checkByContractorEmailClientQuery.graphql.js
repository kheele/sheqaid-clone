/**
 * @generated SignedSource<<9e9f8d16d3051904536ad6b3137d6731>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* eslint-disable */

'use strict';

var node = (function(){
var v0 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "contractor_email"
},
v1 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "id"
},
v2 = [
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
                "variableName": "contractor_email"
              }
            ],
            "kind": "ObjectValue",
            "name": "contractor_email"
          },
          {
            "fields": [
              {
                "kind": "Variable",
                "name": "_neq",
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
    "concreteType": "default_clientsConnection",
    "kind": "LinkedField",
    "name": "default_clients_connection",
    "plural": false,
    "selections": [
      {
        "alias": null,
        "args": null,
        "concreteType": "default_clientsEdge",
        "kind": "LinkedField",
        "name": "edges",
        "plural": true,
        "selections": [
          {
            "alias": null,
            "args": null,
            "concreteType": "default_clients",
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
    "argumentDefinitions": [
      (v0/*: any*/),
      (v1/*: any*/)
    ],
    "kind": "Fragment",
    "metadata": null,
    "name": "checkByContractorEmailClientQuery",
    "selections": (v2/*: any*/),
    "type": "query_root",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": [
      (v1/*: any*/),
      (v0/*: any*/)
    ],
    "kind": "Operation",
    "name": "checkByContractorEmailClientQuery",
    "selections": (v2/*: any*/)
  },
  "params": {
    "cacheID": "7b022a6e4e37e3c88867e9f32f3a5cd0",
    "id": null,
    "metadata": {},
    "name": "checkByContractorEmailClientQuery",
    "operationKind": "query",
    "text": "query checkByContractorEmailClientQuery(\n  $id: bigint\n  $contractor_email: String\n) {\n  default_clients_connection(where: {id: {_neq: $id}, contractor_email: {_eq: $contractor_email}}) {\n    edges {\n      node {\n        id\n      }\n    }\n  }\n}\n"
  }
};
})();

node.hash = "b22192aef20327ed4760e1209ab796b3";

module.exports = node;
