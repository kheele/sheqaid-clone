/**
 * @generated SignedSource<<195805bd580b0ba758813b9fd5079538>>
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
    "concreteType": "default_document_categoriesConnection",
    "kind": "LinkedField",
    "name": "default_document_categories_connection",
    "plural": false,
    "selections": [
      {
        "alias": null,
        "args": null,
        "concreteType": "default_document_categoriesEdge",
        "kind": "LinkedField",
        "name": "edges",
        "plural": true,
        "selections": [
          {
            "alias": null,
            "args": null,
            "concreteType": "default_document_categories",
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
              },
              {
                "alias": null,
                "args": null,
                "kind": "ScalarField",
                "name": "document_owner",
                "storageKey": null
              }
            ],
            "storageKey": null
          }
        ],
        "storageKey": null
      }
    ],
    "storageKey": "default_document_categories_connection(order_by:{\"name\":\"asc\"})"
  }
];
return {
  "fragment": {
    "argumentDefinitions": [],
    "kind": "Fragment",
    "metadata": null,
    "name": "listAllDocumentCategoryQuery",
    "selections": (v0/*: any*/),
    "type": "query_root",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": [],
    "kind": "Operation",
    "name": "listAllDocumentCategoryQuery",
    "selections": (v0/*: any*/)
  },
  "params": {
    "cacheID": "8910e7ad7f51898d9f0da4e75e78d097",
    "id": null,
    "metadata": {},
    "name": "listAllDocumentCategoryQuery",
    "operationKind": "query",
    "text": "query listAllDocumentCategoryQuery {\n  default_document_categories_connection(order_by: {name: asc}) {\n    edges {\n      node {\n        id\n        name\n        document_owner\n      }\n    }\n  }\n}\n"
  }
};
})();

node.hash = "b0893ec8970eb44f186f6bbebc1a2ad3";

module.exports = node;
