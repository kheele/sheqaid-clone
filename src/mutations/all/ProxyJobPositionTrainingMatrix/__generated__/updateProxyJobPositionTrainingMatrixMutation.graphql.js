/**
 * @generated SignedSource<<bbacf7ef3de46f1f01f06b61f4c73a66>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* eslint-disable */

'use strict';

var node = (function(){
var v0 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "_set"
},
v1 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "id"
},
v2 = [
  {
    "alias": null,
    "args": [
      {
        "kind": "Variable",
        "name": "_set",
        "variableName": "_set"
      },
      {
        "kind": "Variable",
        "name": "pk_columns",
        "variableName": "id"
      }
    ],
    "concreteType": "proxy_job_position__training_matrix",
    "kind": "LinkedField",
    "name": "update_proxy_job_position__training_matrix_by_pk",
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
    "argumentDefinitions": [
      (v0/*: any*/),
      (v1/*: any*/)
    ],
    "kind": "Fragment",
    "metadata": null,
    "name": "updateProxyJobPositionTrainingMatrixMutation",
    "selections": (v2/*: any*/),
    "type": "mutation_root",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": [
      (v1/*: any*/),
      (v0/*: any*/)
    ],
    "kind": "Operation",
    "name": "updateProxyJobPositionTrainingMatrixMutation",
    "selections": (v2/*: any*/)
  },
  "params": {
    "cacheID": "e55ded1db303b6ed856485a88abad5d1",
    "id": null,
    "metadata": {},
    "name": "updateProxyJobPositionTrainingMatrixMutation",
    "operationKind": "mutation",
    "text": "mutation updateProxyJobPositionTrainingMatrixMutation(\n  $id: proxy_job_position__training_matrix_pk_columns_input!\n  $_set: proxy_job_position__training_matrix_set_input!\n) {\n  update_proxy_job_position__training_matrix_by_pk(pk_columns: $id, _set: $_set) {\n    id\n  }\n}\n"
  }
};
})();

node.hash = "742f6476743cd7b5c5cc2a0d925de0f1";

module.exports = node;
