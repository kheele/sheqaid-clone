/**
 * @generated SignedSource<<de0489e8462ffa888e423235e3fcc039>>
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
    "concreteType": "proxy_sector__training_matrix",
    "kind": "LinkedField",
    "name": "update_proxy_sector__training_matrix_by_pk",
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
    "name": "updateProxySectorTrainingMatrixMutation",
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
    "name": "updateProxySectorTrainingMatrixMutation",
    "selections": (v2/*: any*/)
  },
  "params": {
    "cacheID": "9e785c70bc0efae97a0b4450aaf408eb",
    "id": null,
    "metadata": {},
    "name": "updateProxySectorTrainingMatrixMutation",
    "operationKind": "mutation",
    "text": "mutation updateProxySectorTrainingMatrixMutation(\n  $id: proxy_sector__training_matrix_pk_columns_input!\n  $_set: proxy_sector__training_matrix_set_input!\n) {\n  update_proxy_sector__training_matrix_by_pk(pk_columns: $id, _set: $_set) {\n    id\n  }\n}\n"
  }
};
})();

node.hash = "668ce50590bcaa6b1019fef7d6cab1a6";

module.exports = node;
