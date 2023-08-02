/**
 * @generated SignedSource<<078a36d781233699e9d36637ec31fdc8>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* eslint-disable */

'use strict';

var node = (function(){
var v0 = [
  {
    "alias": null,
    "args": [
      {
        "kind": "Literal",
        "name": "order_by",
        "value": {
          "value": "asc"
        }
      }
    ],
    "concreteType": "sheq_permissions_other_keysConnection",
    "kind": "LinkedField",
    "name": "sheq_permissions_other_keys_connection",
    "plural": false,
    "selections": [
      {
        "alias": null,
        "args": null,
        "concreteType": "sheq_permissions_other_keysEdge",
        "kind": "LinkedField",
        "name": "edges",
        "plural": true,
        "selections": [
          {
            "alias": null,
            "args": null,
            "concreteType": "sheq_permissions_other_keys",
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
                "name": "value",
                "storageKey": null
              }
            ],
            "storageKey": null
          }
        ],
        "storageKey": null
      }
    ],
    "storageKey": "sheq_permissions_other_keys_connection(order_by:{\"value\":\"asc\"})"
  }
];
return {
  "fragment": {
    "argumentDefinitions": [],
    "kind": "Fragment",
    "metadata": null,
    "name": "listAllPermissionOtherKeyQuery",
    "selections": (v0/*: any*/),
    "type": "query_root",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": [],
    "kind": "Operation",
    "name": "listAllPermissionOtherKeyQuery",
    "selections": (v0/*: any*/)
  },
  "params": {
    "cacheID": "e82a437721fdd3db1d74f223daa62ed9",
    "id": null,
    "metadata": {},
    "name": "listAllPermissionOtherKeyQuery",
    "operationKind": "query",
    "text": "query listAllPermissionOtherKeyQuery {\n  sheq_permissions_other_keys_connection(order_by: {value: asc}) {\n    edges {\n      node {\n        id\n        value\n      }\n    }\n  }\n}\n"
  }
};
})();

node.hash = "730adcf247a42d439bbf46af118874fe";

module.exports = node;
