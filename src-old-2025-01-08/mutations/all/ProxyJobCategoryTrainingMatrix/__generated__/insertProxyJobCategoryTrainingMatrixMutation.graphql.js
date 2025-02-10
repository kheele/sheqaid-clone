/**
 * @generated SignedSource<<a280d4333755d8b876ab95bec2e8b513>>
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
    "concreteType": "proxy_job_category__training_matrix",
    "kind": "LinkedField",
    "name": "insert_proxy_job_category__training_matrix_one",
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
    "name": "insertProxyJobCategoryTrainingMatrixMutation",
    "selections": (v1/*: any*/),
    "type": "mutation_root",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "insertProxyJobCategoryTrainingMatrixMutation",
    "selections": (v1/*: any*/)
  },
  "params": {
    "cacheID": "0106050bf47af04952f94086fafcc1df",
    "id": null,
    "metadata": {},
    "name": "insertProxyJobCategoryTrainingMatrixMutation",
    "operationKind": "mutation",
    "text": "mutation insertProxyJobCategoryTrainingMatrixMutation(\n  $object: proxy_job_category__training_matrix_insert_input!\n) {\n  insert_proxy_job_category__training_matrix_one(object: $object) {\n    id\n  }\n}\n"
  }
};
})();

node.hash = "7844242f61d36a9b22e0abbe551a4b3b";

module.exports = node;
