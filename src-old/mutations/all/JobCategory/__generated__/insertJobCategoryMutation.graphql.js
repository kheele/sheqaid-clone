/**
 * @generated SignedSource<<43761e92763481e9cceb21145b3416c1>>
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
    "concreteType": "default_job_categories",
    "kind": "LinkedField",
    "name": "insert_default_job_categories_one",
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
    "name": "insertJobCategoryMutation",
    "selections": (v1/*: any*/),
    "type": "mutation_root",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "insertJobCategoryMutation",
    "selections": (v1/*: any*/)
  },
  "params": {
    "cacheID": "6d8616fe3d99c09aaedd594d3ccb7f07",
    "id": null,
    "metadata": {},
    "name": "insertJobCategoryMutation",
    "operationKind": "mutation",
    "text": "mutation insertJobCategoryMutation(\n  $object: default_job_categories_insert_input!\n) {\n  insert_default_job_categories_one(object: $object) {\n    id\n  }\n}\n"
  }
};
})();

node.hash = "7ae5c3afe5414efab3d63f76aa9d9b75";

module.exports = node;
