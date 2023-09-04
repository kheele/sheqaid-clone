/**
 * @generated SignedSource<<6f4be87a27f85e2520f0cdeee926e5f9>>
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
    "name": "name"
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
                "variableName": "name"
              }
            ],
            "kind": "ObjectValue",
            "name": "name"
          }
        ],
        "kind": "ObjectValue",
        "name": "where"
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
    "name": "findByNameDocumentCategoryQuery",
    "selections": (v1/*: any*/),
    "type": "query_root",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "findByNameDocumentCategoryQuery",
    "selections": (v1/*: any*/)
  },
  "params": {
    "cacheID": "a7e93443ac053b9826c25e5de3630e55",
    "id": null,
    "metadata": {},
    "name": "findByNameDocumentCategoryQuery",
    "operationKind": "query",
    "text": "query findByNameDocumentCategoryQuery(\n  $name: String\n) {\n  default_document_categories_connection(where: {name: {_eq: $name}}) {\n    edges {\n      node {\n        id\n      }\n    }\n  }\n}\n"
  }
};
})();

node.hash = "280b2ba4a312094db32a788969abd4d7";

module.exports = node;
