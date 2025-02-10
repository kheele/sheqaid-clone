/**
 * @generated SignedSource<<7a7d7f6976ce4c8a81ffacc825e16fe3>>
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
    "concreteType": "sheq_incident_investigationConnection",
    "kind": "LinkedField",
    "name": "sheq_incident_investigation_connection",
    "plural": false,
    "selections": [
      {
        "alias": null,
        "args": null,
        "concreteType": "sheq_incident_investigationEdge",
        "kind": "LinkedField",
        "name": "edges",
        "plural": true,
        "selections": [
          {
            "alias": null,
            "args": null,
            "concreteType": "sheq_incident_investigation",
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
    "name": "findByIdIncidentQuery",
    "selections": (v1/*: any*/),
    "type": "query_root",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "findByIdIncidentQuery",
    "selections": (v1/*: any*/)
  },
  "params": {
    "cacheID": "3d5f7a73f787dc41d07753b74d87934e",
    "id": null,
    "metadata": {},
    "name": "findByIdIncidentQuery",
    "operationKind": "query",
    "text": "query findByIdIncidentQuery(\n  $id: bigint\n) {\n  sheq_incident_investigation_connection(where: {id: {_eq: $id}}) {\n    edges {\n      node {\n        id\n      }\n    }\n  }\n}\n"
  }
};
})();

node.hash = "9e287f646c77ded14eb5778ff69d7cde";

module.exports = node;
