/**
 * @generated SignedSource<<ca83a2d375256c79cca53e139874400e>>
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
    "name": "value"
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
                "variableName": "value"
              }
            ],
            "kind": "ObjectValue",
            "name": "value"
          }
        ],
        "kind": "ObjectValue",
        "name": "where"
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
    "name": "findByValuePermissionOtherKeyQuery",
    "selections": (v1/*: any*/),
    "type": "query_root",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "findByValuePermissionOtherKeyQuery",
    "selections": (v1/*: any*/)
  },
  "params": {
    "cacheID": "cd23cafa6afedf1cea59ffc762b533d2",
    "id": null,
    "metadata": {},
    "name": "findByValuePermissionOtherKeyQuery",
    "operationKind": "query",
    "text": "query findByValuePermissionOtherKeyQuery(\n  $value: String\n) {\n  sheq_permissions_other_keys_connection(where: {value: {_eq: $value}}) {\n    edges {\n      node {\n        id\n      }\n    }\n  }\n}\n"
  }
};
})();

node.hash = "7a8ecb197f90fda18affd018f85f4175";

module.exports = node;
