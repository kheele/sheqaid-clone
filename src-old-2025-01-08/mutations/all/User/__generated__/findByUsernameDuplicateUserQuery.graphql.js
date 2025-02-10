/**
 * @generated SignedSource<<143b17825e431025419c7d9cb3a84c97>>
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
                "name": "_neq",
                "variableName": "id"
              }
            ],
            "kind": "ObjectValue",
            "name": "id"
          },
          {
            "fields": [
              {
                "kind": "Variable",
                "name": "_eq",
                "variableName": "username"
              }
            ],
            "kind": "ObjectValue",
            "name": "username"
          }
        ],
        "kind": "ObjectValue",
        "name": "where"
      }
    ],
    "concreteType": "default_usersConnection",
    "kind": "LinkedField",
    "name": "default_users_connection",
    "plural": false,
    "selections": [
      {
        "alias": null,
        "args": null,
        "concreteType": "default_usersEdge",
        "kind": "LinkedField",
        "name": "edges",
        "plural": true,
        "selections": [
          {
            "alias": null,
            "args": null,
            "concreteType": "default_users",
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
    "name": "findByUsernameDuplicateUserQuery",
    "selections": (v1/*: any*/),
    "type": "query_root",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "findByUsernameDuplicateUserQuery",
    "selections": (v1/*: any*/)
  },
  "params": {
    "cacheID": "323a17903072dc84741f62ea78538185",
    "id": null,
    "metadata": {},
    "name": "findByUsernameDuplicateUserQuery",
    "operationKind": "query",
    "text": "query findByUsernameDuplicateUserQuery(\n  $id: bigint\n  $username: String\n) {\n  default_users_connection(where: {id: {_neq: $id}, username: {_eq: $username}}) {\n    edges {\n      node {\n        id\n        auth_id\n      }\n    }\n  }\n}\n"
  }
};
})();

node.hash = "5a34e04b7fc100bba7de1462a7b6adaa";

module.exports = node;
