/**
 * @generated SignedSource<<94c8753eecd8e0b2d116c5926d9bc6ac>>
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
                "variableName": "id"
              }
            ],
            "kind": "ObjectValue",
            "name": "id"
          }
        ],
        "kind": "ObjectValue",
        "name": "where"
      }
    ],
    "concreteType": "proxy_coida_claims__wcl_5Connection",
    "kind": "LinkedField",
    "name": "proxy_coida_claims__wcl_5_connection",
    "plural": false,
    "selections": [
      {
        "alias": null,
        "args": null,
        "concreteType": "proxy_coida_claims__wcl_5Edge",
        "kind": "LinkedField",
        "name": "edges",
        "plural": true,
        "selections": [
          {
            "alias": null,
            "args": null,
            "concreteType": "proxy_coida_claims__wcl_5",
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
    "name": "findByIdWCL5ProxyQuery",
    "selections": (v1/*: any*/),
    "type": "query_root",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "findByIdWCL5ProxyQuery",
    "selections": (v1/*: any*/)
  },
  "params": {
    "cacheID": "c976364eb761180a5b66ef6304e133da",
    "id": null,
    "metadata": {},
    "name": "findByIdWCL5ProxyQuery",
    "operationKind": "query",
    "text": "query findByIdWCL5ProxyQuery(\n  $id: bigint\n) {\n  proxy_coida_claims__wcl_5_connection(where: {id: {_eq: $id}}) {\n    edges {\n      node {\n        id\n      }\n    }\n  }\n}\n"
  }
};
})();

node.hash = "2b8e619e46f9fdad0df7774c78a13380";

module.exports = node;
