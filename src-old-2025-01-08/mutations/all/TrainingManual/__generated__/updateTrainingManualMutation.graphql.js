/**
 * @generated SignedSource<<7d22470b3be4856d605683ded045938c>>
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
    "concreteType": "sheq_training_manuals",
    "kind": "LinkedField",
    "name": "update_sheq_training_manuals_by_pk",
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
    "name": "updateTrainingManualMutation",
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
    "name": "updateTrainingManualMutation",
    "selections": (v2/*: any*/)
  },
  "params": {
    "cacheID": "844c876477796e6fbe6cc7f6f5fb2f66",
    "id": null,
    "metadata": {},
    "name": "updateTrainingManualMutation",
    "operationKind": "mutation",
    "text": "mutation updateTrainingManualMutation(\n  $id: sheq_training_manuals_pk_columns_input!\n  $_set: sheq_training_manuals_set_input!\n) {\n  update_sheq_training_manuals_by_pk(pk_columns: $id, _set: $_set) {\n    id\n  }\n}\n"
  }
};
})();

node.hash = "5f35e0c5112ee00db95421a0eba6900c";

module.exports = node;
