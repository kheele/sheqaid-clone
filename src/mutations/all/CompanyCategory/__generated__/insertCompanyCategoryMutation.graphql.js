/**
 * @generated SignedSource<<2cd9d6ceb0ac86333d47fe58655cc870>>
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
    "concreteType": "default_company_categories",
    "kind": "LinkedField",
    "name": "insert_default_company_categories_one",
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
    "name": "insertCompanyCategoryMutation",
    "selections": (v1/*: any*/),
    "type": "mutation_root",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "insertCompanyCategoryMutation",
    "selections": (v1/*: any*/)
  },
  "params": {
    "cacheID": "cf5d78a16321d24f19ce8a76025c31da",
    "id": null,
    "metadata": {},
    "name": "insertCompanyCategoryMutation",
    "operationKind": "mutation",
    "text": "mutation insertCompanyCategoryMutation(\n  $object: default_company_categories_insert_input!\n) {\n  insert_default_company_categories_one(object: $object) {\n    id\n  }\n}\n"
  }
};
})();

node.hash = "5035448f02ed3a42ae943003486d9327";

module.exports = node;
