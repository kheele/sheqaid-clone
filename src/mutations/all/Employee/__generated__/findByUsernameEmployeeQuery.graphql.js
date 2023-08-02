/**
 * @generated SignedSource<<6d7305289c58877a34f6847706ada3da>>
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
    "name": "username"
  }
],
v1 = [
  {
    "kind": "Variable",
    "name": "_eq",
    "variableName": "username"
  }
],
v2 = [
  {
    "alias": null,
    "args": [
      {
        "fields": [
          {
            "fields": [
              {
                "fields": (v1/*: any*/),
                "kind": "ObjectValue",
                "name": "email"
              }
            ],
            "kind": "ObjectValue",
            "name": "_or"
          },
          {
            "fields": (v1/*: any*/),
            "kind": "ObjectValue",
            "name": "phone"
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
    "name": "findByUsernameEmployeeQuery",
    "selections": (v2/*: any*/),
    "type": "query_root",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "findByUsernameEmployeeQuery",
    "selections": (v2/*: any*/)
  },
  "params": {
    "cacheID": "4f3079f24414cbb842b3bc931c85545b",
    "id": null,
    "metadata": {},
    "name": "findByUsernameEmployeeQuery",
    "operationKind": "query",
    "text": "query findByUsernameEmployeeQuery(\n  $username: String\n) {\n  hr_employees_connection(where: {_or: {email: {_eq: $username}}, phone: {_eq: $username}}) {\n    edges {\n      node {\n        id\n      }\n    }\n  }\n}\n"
  }
};
})();

node.hash = "b238d98127d8fa63c185ea02eea3b494";

module.exports = node;
