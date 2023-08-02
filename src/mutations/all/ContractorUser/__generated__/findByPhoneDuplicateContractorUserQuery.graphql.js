/**
 * @generated SignedSource<<05e882a15300c0db4f97a33cacaa85e7>>
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
            "name": "phone"
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
    "name": "findByPhoneDuplicateContractorUserQuery",
    "selections": (v1/*: any*/),
    "type": "query_root",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "findByPhoneDuplicateContractorUserQuery",
    "selections": (v1/*: any*/)
  },
  "params": {
    "cacheID": "72e66d311a144f25ac219136556b2aca",
    "id": null,
    "metadata": {},
    "name": "findByPhoneDuplicateContractorUserQuery",
    "operationKind": "query",
    "text": "query findByPhoneDuplicateContractorUserQuery(\n  $id: bigint\n  $username: String\n) {\n  default_contractor_users_connection(where: {id: {_neq: $id}, phone: {_eq: $username}}) {\n    edges {\n      node {\n        id\n        auth_id\n      }\n    }\n  }\n}\n"
  }
};
})();

node.hash = "18ca5c196f08662d3b54565c64fa691e";

module.exports = node;
