/**
 * @generated SignedSource<<b94848cd58030d96c81478c3e800d363>>
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
    "name": "key"
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
                "variableName": "key"
              }
            ],
            "kind": "ObjectValue",
            "name": "key"
          }
        ],
        "kind": "ObjectValue",
        "name": "where"
      }
    ],
    "concreteType": "default_manager_moduleConnection",
    "kind": "LinkedField",
    "name": "default_manager_module_connection",
    "plural": false,
    "selections": [
      {
        "alias": null,
        "args": null,
        "concreteType": "default_manager_moduleEdge",
        "kind": "LinkedField",
        "name": "edges",
        "plural": true,
        "selections": [
          {
            "alias": null,
            "args": null,
            "concreteType": "default_manager_module",
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
    "name": "findByKeyModuleQuery",
    "selections": (v1/*: any*/),
    "type": "query_root",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "findByKeyModuleQuery",
    "selections": (v1/*: any*/)
  },
  "params": {
    "cacheID": "4b1f997216e6cab9158db4e9fd176424",
    "id": null,
    "metadata": {},
    "name": "findByKeyModuleQuery",
    "operationKind": "query",
    "text": "query findByKeyModuleQuery(\n  $key: String\n) {\n  default_manager_module_connection(where: {key: {_eq: $key}}) {\n    edges {\n      node {\n        id\n      }\n    }\n  }\n}\n"
  }
};
})();

node.hash = "eb1a5cf04678196d61687ee0b6e8dfb3";

module.exports = node;
