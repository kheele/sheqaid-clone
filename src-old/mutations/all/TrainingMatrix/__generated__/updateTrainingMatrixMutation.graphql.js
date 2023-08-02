/**
 * @generated SignedSource<<be29afd79f5c638052c07a705122afed>>
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
    "concreteType": "sheq_training_matrices",
    "kind": "LinkedField",
    "name": "update_sheq_training_matrices_by_pk",
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
    "name": "updateTrainingMatrixMutation",
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
    "name": "updateTrainingMatrixMutation",
    "selections": (v2/*: any*/)
  },
  "params": {
    "cacheID": "b2ccecfff6b867d67bcac92c6ce2abc1",
    "id": null,
    "metadata": {},
    "name": "updateTrainingMatrixMutation",
    "operationKind": "mutation",
    "text": "mutation updateTrainingMatrixMutation(\n  $id: sheq_training_matrices_pk_columns_input!\n  $_set: sheq_training_matrices_set_input!\n) {\n  update_sheq_training_matrices_by_pk(pk_columns: $id, _set: $_set) {\n    id\n  }\n}\n"
  }
};
})();

node.hash = "350db14097547d6a54e55bb22a00fd19";

module.exports = node;
