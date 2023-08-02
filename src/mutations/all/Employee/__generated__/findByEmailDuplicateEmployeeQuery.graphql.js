/**
 * @generated SignedSource<<20ac507a135b3411ac57ee3509648aa0>>
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
  },
  {
    "defaultValue": null,
    "kind": "LocalArgument",
    "name": "username"
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
                "variableName": "username"
              }
            ],
            "kind": "ObjectValue",
            "name": "email"
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
    "concreteType": "hr_employeesConnection",
    "kind": "LinkedField",
    "name": "hr_employees_connection",
    "plural": false,
    "selections": [
      {
        "alias": null,
        "args": null,
        "concreteType": "hr_employeesEdge",
        "kind": "LinkedField",
        "name": "edges",
        "plural": true,
        "selections": [
          {
            "alias": null,
            "args": null,
            "concreteType": "hr_employees",
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
    "name": "findByEmailDuplicateEmployeeQuery",
    "selections": (v1/*: any*/),
    "type": "query_root",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "findByEmailDuplicateEmployeeQuery",
    "selections": (v1/*: any*/)
  },
  "params": {
    "cacheID": "a964f1b30aa2ed806d1a851ba4424f44",
    "id": null,
    "metadata": {},
    "name": "findByEmailDuplicateEmployeeQuery",
    "operationKind": "query",
    "text": "query findByEmailDuplicateEmployeeQuery(\n  $id: bigint\n  $username: String\n) {\n  hr_employees_connection(where: {id: {_neq: $id}, email: {_eq: $username}}) {\n    edges {\n      node {\n        id\n      }\n    }\n  }\n}\n"
  }
};
})();

node.hash = "89cace6b4ca7c66d1e5b317d01d48705";

module.exports = node;
