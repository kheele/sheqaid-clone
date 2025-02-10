/**
 * @generated SignedSource<<d5b4da80ed0d8c4ef59fb4f06197594d>>
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
    "name": "fname"
  },
  {
    "defaultValue": null,
    "kind": "LocalArgument",
    "name": "lname"
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
                "variableName": "fname"
              }
            ],
            "kind": "ObjectValue",
            "name": "fname"
          },
          {
            "fields": [
              {
                "kind": "Variable",
                "name": "_eq",
                "variableName": "lname"
              }
            ],
            "kind": "ObjectValue",
            "name": "lname"
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
    "name": "findByNameEmployeeQuery",
    "selections": (v1/*: any*/),
    "type": "query_root",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "findByNameEmployeeQuery",
    "selections": (v1/*: any*/)
  },
  "params": {
    "cacheID": "5a0b18b9f7597d83052c73c0f58a26ce",
    "id": null,
    "metadata": {},
    "name": "findByNameEmployeeQuery",
    "operationKind": "query",
    "text": "query findByNameEmployeeQuery(\n  $fname: String\n  $lname: String\n) {\n  hr_employees_connection(where: {fname: {_eq: $fname}, lname: {_eq: $lname}}) {\n    edges {\n      node {\n        id\n      }\n    }\n  }\n}\n"
  }
};
})();

node.hash = "7413d0de4555111be95bdcb294bca684";

module.exports = node;
