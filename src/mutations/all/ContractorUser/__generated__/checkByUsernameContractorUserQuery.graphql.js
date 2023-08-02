/**
 * @generated SignedSource<<5a23730ea7cf55bbf806dbe3a5d5d23f>>
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
              (v1/*: any*/),
              {
                "alias": null,
                "args": null,
                "kind": "ScalarField",
                "name": "auth_id",
                "storageKey": null
              },
              {
                "alias": null,
                "args": null,
                "concreteType": "default_contractors",
                "kind": "LinkedField",
                "name": "contractor",
                "plural": false,
                "selections": [
                  (v1/*: any*/),
                  {
                    "alias": null,
                    "args": null,
                    "kind": "ScalarField",
                    "name": "username",
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
    ],
    "storageKey": null
  }
];
return {
  "fragment": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Fragment",
    "metadata": null,
    "name": "checkByUsernameContractorUserQuery",
    "selections": (v2/*: any*/),
    "type": "query_root",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "checkByUsernameContractorUserQuery",
    "selections": (v2/*: any*/)
  },
  "params": {
    "cacheID": "232115253fd2d3bf96b12138f3a6bf50",
    "id": null,
    "metadata": {},
    "name": "checkByUsernameContractorUserQuery",
    "operationKind": "query",
    "text": "query checkByUsernameContractorUserQuery(\n  $username: String\n) {\n  default_contractor_users_connection(where: {username: {_eq: $username}}) {\n    edges {\n      node {\n        id\n        auth_id\n        contractor {\n          id\n          username\n        }\n      }\n    }\n  }\n}\n"
  }
};
})();

node.hash = "20c7d4db15bd5fa1f2773b3f9ada8f67";

module.exports = node;
