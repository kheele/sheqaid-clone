/**
 * @generated SignedSource<<82737175e2ba5db7d09f5d8ddd56a3c1>>
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
v1 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "id",
  "storageKey": null
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
    "concreteType": "sheq_incident_investigation_test_type_listConnection",
    "kind": "LinkedField",
    "name": "sheq_incident_investigation_test_type_list_connection",
    "plural": false,
    "selections": [
      {
        "alias": null,
        "args": null,
        "concreteType": "sheq_incident_investigation_test_type_listEdge",
        "kind": "LinkedField",
        "name": "edges",
        "plural": true,
        "selections": [
          {
            "alias": null,
            "args": null,
            "concreteType": "sheq_incident_investigation_test_type_list",
            "kind": "LinkedField",
            "name": "node",
            "plural": false,
            "selections": [
              (v1/*: any*/),
              {
                "alias": null,
                "args": null,
                "kind": "ScalarField",
                "name": "name",
                "storageKey": null
              },
              {
                "alias": null,
                "args": null,
                "kind": "ScalarField",
                "name": "incident_id",
                "storageKey": null
              },
              {
                "alias": null,
                "args": null,
                "concreteType": "sheq_incident_investigation",
                "kind": "LinkedField",
                "name": "incident",
                "plural": false,
                "selections": [
                  (v1/*: any*/)
                ],
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
    "name": "findByIdIncidentTestTypeQuery",
    "selections": (v2/*: any*/),
    "type": "query_root",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "findByIdIncidentTestTypeQuery",
    "selections": (v2/*: any*/)
  },
  "params": {
    "cacheID": "3c6dffac6c2210e3d60936caa5e234fe",
    "id": null,
    "metadata": {},
    "name": "findByIdIncidentTestTypeQuery",
    "operationKind": "query",
    "text": "query findByIdIncidentTestTypeQuery(\n  $id: bigint\n) {\n  sheq_incident_investigation_test_type_list_connection(where: {id: {_eq: $id}}) {\n    edges {\n      node {\n        id\n        name\n        incident_id\n        incident {\n          id\n        }\n      }\n    }\n  }\n}\n"
  }
};
})();

node.hash = "97de9111929b130fc8b87c6b3213d34d";

module.exports = node;
