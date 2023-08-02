/**
 * @generated SignedSource<<077e606a5ff54fcf00307ee14b8f14a0>>
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
    "concreteType": "sheq_training_courses",
    "kind": "LinkedField",
    "name": "update_sheq_training_courses_by_pk",
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
    "name": "updateTrainingCourseMutation",
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
    "name": "updateTrainingCourseMutation",
    "selections": (v2/*: any*/)
  },
  "params": {
    "cacheID": "576e105f9323110e99ac71d63e566f9c",
    "id": null,
    "metadata": {},
    "name": "updateTrainingCourseMutation",
    "operationKind": "mutation",
    "text": "mutation updateTrainingCourseMutation(\n  $id: sheq_training_courses_pk_columns_input!\n  $_set: sheq_training_courses_set_input!\n) {\n  update_sheq_training_courses_by_pk(pk_columns: $id, _set: $_set) {\n    id\n  }\n}\n"
  }
};
})();

node.hash = "fc43d1c0f5c559935c36b24b6b7011d1";

module.exports = node;
