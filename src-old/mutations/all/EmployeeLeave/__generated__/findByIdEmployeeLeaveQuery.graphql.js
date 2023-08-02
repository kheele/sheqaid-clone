/**
 * @generated SignedSource<<cdb6958afda9a0b3a584a388a00f598e>>
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
    "concreteType": "hr_employees_docs_leavesConnection",
    "kind": "LinkedField",
    "name": "hr_employees_docs_leaves_connection",
    "plural": false,
    "selections": [
      {
        "alias": null,
        "args": null,
        "concreteType": "hr_employees_docs_leavesEdge",
        "kind": "LinkedField",
        "name": "edges",
        "plural": true,
        "selections": [
          {
            "alias": null,
            "args": null,
            "concreteType": "hr_employees_docs_leaves",
            "kind": "LinkedField",
            "name": "node",
            "plural": false,
            "selections": [
              (v1/*: any*/),
              {
                "alias": null,
                "args": null,
                "concreteType": "hr_employees",
                "kind": "LinkedField",
                "name": "employee",
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
    "name": "findByIdEmployeeLeaveQuery",
    "selections": (v2/*: any*/),
    "type": "query_root",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "findByIdEmployeeLeaveQuery",
    "selections": (v2/*: any*/)
  },
  "params": {
    "cacheID": "6d17664879a6855476668b303ce8080a",
    "id": null,
    "metadata": {},
    "name": "findByIdEmployeeLeaveQuery",
    "operationKind": "query",
    "text": "query findByIdEmployeeLeaveQuery(\n  $id: bigint\n) {\n  hr_employees_docs_leaves_connection(where: {id: {_eq: $id}}) {\n    edges {\n      node {\n        id\n        employee {\n          id\n        }\n      }\n    }\n  }\n}\n"
  }
};
})();

node.hash = "d2dd0d1fb771019f8d546c35bac3a765";

module.exports = node;
