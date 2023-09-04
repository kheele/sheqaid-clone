/**
 * @generated SignedSource<<6312f1140d2cce3f2242a13dc7fcdb50>>
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
    "name": "object"
  }
],
v1 = [
  {
    "alias": null,
    "args": [
      {
        "kind": "Variable",
        "name": "object",
        "variableName": "object"
      }
    ],
    "concreteType": "default_document_categories",
    "kind": "LinkedField",
    "name": "insert_default_document_categories_one",
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
];
return {
  "fragment": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Fragment",
    "metadata": null,
    "name": "insertDocumentCategoryMutation",
    "selections": (v1/*: any*/),
    "type": "mutation_root",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "insertDocumentCategoryMutation",
    "selections": (v1/*: any*/)
  },
  "params": {
    "cacheID": "73646d6349538b801034edf0b40e202e",
    "id": null,
    "metadata": {},
    "name": "insertDocumentCategoryMutation",
    "operationKind": "mutation",
    "text": "mutation insertDocumentCategoryMutation(\n  $object: default_document_categories_insert_input!\n) {\n  insert_default_document_categories_one(object: $object) {\n    id\n  }\n}\n"
  }
};
})();

node.hash = "abe0b2661164302ae689e86e20e986dc";

module.exports = node;
