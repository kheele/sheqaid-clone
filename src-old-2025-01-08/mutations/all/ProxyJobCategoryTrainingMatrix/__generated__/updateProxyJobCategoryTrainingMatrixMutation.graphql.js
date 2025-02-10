/**
 * @generated SignedSource<<2b5ddbc73b8c6dbba3edbb4781c9c48e>>
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
    "concreteType": "proxy_job_category__training_matrix",
    "kind": "LinkedField",
    "name": "update_proxy_job_category__training_matrix_by_pk",
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
    "name": "updateProxyJobCategoryTrainingMatrixMutation",
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
    "name": "updateProxyJobCategoryTrainingMatrixMutation",
    "selections": (v2/*: any*/)
  },
  "params": {
    "cacheID": "dd884d74c9395120b9f1b6b3c9afe103",
    "id": null,
    "metadata": {},
    "name": "updateProxyJobCategoryTrainingMatrixMutation",
    "operationKind": "mutation",
    "text": "mutation updateProxyJobCategoryTrainingMatrixMutation(\n  $id: proxy_job_category__training_matrix_pk_columns_input!\n  $_set: proxy_job_category__training_matrix_set_input!\n) {\n  update_proxy_job_category__training_matrix_by_pk(pk_columns: $id, _set: $_set) {\n    id\n  }\n}\n"
  }
};
})();

node.hash = "c4ad725b1e67a77c48b1e83f25baeec2";

module.exports = node;
