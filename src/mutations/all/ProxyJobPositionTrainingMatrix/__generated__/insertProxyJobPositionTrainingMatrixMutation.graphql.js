/**
 * @generated SignedSource<<b9e3d8998a04c3500eb8e08b2080f9af>>
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
    "concreteType": "proxy_job_position__training_matrix",
    "kind": "LinkedField",
    "name": "insert_proxy_job_position__training_matrix_one",
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
    "name": "insertProxyJobPositionTrainingMatrixMutation",
    "selections": (v1/*: any*/),
    "type": "mutation_root",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "insertProxyJobPositionTrainingMatrixMutation",
    "selections": (v1/*: any*/)
  },
  "params": {
    "cacheID": "cc731e6a8d2942232939ebc7e4348e71",
    "id": null,
    "metadata": {},
    "name": "insertProxyJobPositionTrainingMatrixMutation",
    "operationKind": "mutation",
    "text": "mutation insertProxyJobPositionTrainingMatrixMutation(\n  $object: proxy_job_position__training_matrix_insert_input!\n) {\n  insert_proxy_job_position__training_matrix_one(object: $object) {\n    id\n  }\n}\n"
  }
};
})();

node.hash = "9ba8c7b6204d0aa982ded94fe78e4f83";

module.exports = node;
