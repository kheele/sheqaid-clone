/**
 * @generated SignedSource<<c4bd960e70f899d688cb8ee7d008182e>>
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
          "name": "asc"
        }
      }
    ],
    "concreteType": "default_company_categoriesConnection",
    "kind": "LinkedField",
    "name": "default_company_categories_connection",
    "plural": false,
    "selections": [
      {
        "alias": null,
        "args": null,
        "concreteType": "default_company_categoriesEdge",
        "kind": "LinkedField",
        "name": "edges",
        "plural": true,
        "selections": [
          {
            "alias": null,
            "args": null,
            "concreteType": "default_company_categories",
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
                "name": "name",
                "storageKey": null
              }
            ],
            "storageKey": null
          }
        ],
        "storageKey": null
      }
    ],
    "storageKey": "default_company_categories_connection(order_by:{\"name\":\"asc\"})"
  }
];
return {
  "fragment": {
    "argumentDefinitions": [],
    "kind": "Fragment",
    "metadata": null,
    "name": "listAllCompanyCategoryQuery",
    "selections": (v0/*: any*/),
    "type": "query_root",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": [],
    "kind": "Operation",
    "name": "listAllCompanyCategoryQuery",
    "selections": (v0/*: any*/)
  },
  "params": {
    "cacheID": "ea88ced8b5f9248a14b43f6a5bccf17a",
    "id": null,
    "metadata": {},
    "name": "listAllCompanyCategoryQuery",
    "operationKind": "query",
    "text": "query listAllCompanyCategoryQuery {\n  default_company_categories_connection(order_by: {name: asc}) {\n    edges {\n      node {\n        id\n        name\n      }\n    }\n  }\n}\n"
  }
};
})();

node.hash = "9703fa604f2460b1f12489b1fad182a6";

module.exports = node;
