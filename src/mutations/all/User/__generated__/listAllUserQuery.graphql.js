/**
 * @generated SignedSource<<67dc2b70c657359264189aecbd73e7bb>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* eslint-disable */

'use strict';

var node = (function(){
var v0 = [
  {
    "alias": null,
    "args": null,
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
    "argumentDefinitions": [],
    "kind": "Fragment",
    "metadata": null,
    "name": "listAllUserQuery",
    "selections": (v0/*: any*/),
    "type": "query_root",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": [],
    "kind": "Operation",
    "name": "listAllUserQuery",
    "selections": (v0/*: any*/)
  },
  "params": {
    "cacheID": "90fa2e0b13b22f5749ba9383d278dd5f",
    "id": null,
    "metadata": {},
    "name": "listAllUserQuery",
    "operationKind": "query",
    "text": "query listAllUserQuery {\n  default_users_connection {\n    edges {\n      node {\n        id\n      }\n    }\n  }\n}\n"
  }
};
})();

node.hash = "909fabcc72ee10dc20ae5c67dc948d88";

module.exports = node;
