/**
 * @generated SignedSource<<032b99534ee356253dc44108eb1c8f33>>
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
            "items": [
              {
                "fields": [
                  {
                    "fields": (v1/*: any*/),
                    "kind": "ObjectValue",
                    "name": "email"
                  }
                ],
                "kind": "ObjectValue",
                "name": "_or.0"
              },
              {
                "fields": [
                  {
                    "fields": (v1/*: any*/),
                    "kind": "ObjectValue",
                    "name": "phone"
                  }
                ],
                "kind": "ObjectValue",
                "name": "_or.1"
              }
            ],
            "kind": "ListValue",
            "name": "_or"
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
              },
              {
                "alias": null,
                "args": null,
                "kind": "ScalarField",
                "name": "auth_id",
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
    "cacheID": "8c171631fa5772aa7ceeed5ebaeee3a8",
    "id": null,
    "metadata": {},
    "name": "findByUsernameEmployeeQuery",
    "operationKind": "query",
    "text": "query findByUsernameEmployeeQuery(\n  $username: String\n) {\n  hr_employees_connection(where: {_or: [{email: {_eq: $username}}, {phone: {_eq: $username}}]}) {\n    edges {\n      node {\n        id\n        auth_id\n      }\n    }\n  }\n}\n"
  }
};
})();

node.hash = "28c36375628cd7fdd992237a0963c3b2";

module.exports = node;
