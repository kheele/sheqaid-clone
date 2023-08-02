/**
 * @generated SignedSource<<340c2256ad39213c7ad9283029683c01>>
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
                "name": "username"
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
    "name": "findByUsernameUserQuery",
    "selections": (v2/*: any*/),
    "type": "query_root",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "findByUsernameUserQuery",
    "selections": (v2/*: any*/)
  },
  "params": {
    "cacheID": "1a0b87d6eea8d0dff185ff66341ca876",
    "id": null,
    "metadata": {},
    "name": "findByUsernameUserQuery",
    "operationKind": "query",
    "text": "query findByUsernameUserQuery(\n  $username: String\n) {\n  default_users_connection(where: {_or: {username: {_eq: $username}}, phone: {_eq: $username}}) {\n    edges {\n      node {\n        id\n        auth_id\n      }\n    }\n  }\n}\n"
  }
};
})();

node.hash = "df79770a948f6102429a6915cfb17b8a";

module.exports = node;
