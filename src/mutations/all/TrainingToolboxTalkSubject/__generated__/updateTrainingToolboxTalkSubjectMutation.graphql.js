/**
 * @generated SignedSource<<6b170e0ff654a51633570c823cb3431d>>
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
    "concreteType": "sheq_training_toolbox_talk_subjects",
    "kind": "LinkedField",
    "name": "update_sheq_training_toolbox_talk_subjects_by_pk",
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
    "name": "updateTrainingToolboxTalkSubjectMutation",
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
    "name": "updateTrainingToolboxTalkSubjectMutation",
    "selections": (v2/*: any*/)
  },
  "params": {
    "cacheID": "bb13d9c6c74b37224c107ba3860ebb36",
    "id": null,
    "metadata": {},
    "name": "updateTrainingToolboxTalkSubjectMutation",
    "operationKind": "mutation",
    "text": "mutation updateTrainingToolboxTalkSubjectMutation(\n  $id: sheq_training_toolbox_talk_subjects_pk_columns_input!\n  $_set: sheq_training_toolbox_talk_subjects_set_input!\n) {\n  update_sheq_training_toolbox_talk_subjects_by_pk(pk_columns: $id, _set: $_set) {\n    id\n  }\n}\n"
  }
};
})();

node.hash = "2594e44bdbd46074dd1ea0fc33bf4554";

module.exports = node;
