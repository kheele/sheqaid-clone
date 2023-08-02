/**
 * @generated SignedSource<<987b83c58b508fc7e932a2edaa5e202b>>
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
    "concreteType": "default_contractor_usersConnection",
    "kind": "LinkedField",
    "name": "default_contractor_users_connection",
    "plural": false,
    "selections": [
      {
        "alias": null,
        "args": null,
        "concreteType": "default_contractor_usersEdge",
        "kind": "LinkedField",
        "name": "edges",
        "plural": true,
        "selections": [
          {
            "alias": null,
            "args": null,
            "concreteType": "default_contractor_users",
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
    "name": "findByUsernameDuplicateContractorUserQuery",
    "selections": (v1/*: any*/),
    "type": "query_root",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "findByUsernameDuplicateContractorUserQuery",
    "selections": (v1/*: any*/)
  },
  "params": {
    "cacheID": "99566ea5e5f0dfb01e84494571065b20",
    "id": null,
    "metadata": {},
    "name": "findByUsernameDuplicateContractorUserQuery",
    "operationKind": "query",
    "text": "query findByUsernameDuplicateContractorUserQuery(\n  $id: bigint\n  $username: String\n) {\n  default_contractor_users_connection(where: {id: {_neq: $id}, username: {_eq: $username}}) {\n    edges {\n      node {\n        id\n        auth_id\n      }\n    }\n  }\n}\n"
  }
};
})();

node.hash = "86c9467db1ca36893f55f15899f77180";

module.exports = node;
