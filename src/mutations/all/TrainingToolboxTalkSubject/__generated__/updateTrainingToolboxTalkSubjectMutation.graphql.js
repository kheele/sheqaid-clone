/**
 * @generated SignedSource<<94e17e5ebfe306374e9703c9327f9f54>>
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
      },
      {
        "alias": null,
        "args": null,
        "kind": "ScalarField",
        "name": "name",
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
    "cacheID": "5a43d4b3b5b1b36ebbb0511c808143c9",
    "id": null,
    "metadata": {},
    "name": "updateTrainingToolboxTalkSubjectMutation",
    "operationKind": "mutation",
    "text": "mutation updateTrainingToolboxTalkSubjectMutation(\n  $id: sheq_training_toolbox_talk_subjects_pk_columns_input!\n  $_set: sheq_training_toolbox_talk_subjects_set_input!\n) {\n  update_sheq_training_toolbox_talk_subjects_by_pk(pk_columns: $id, _set: $_set) {\n    id\n    name\n  }\n}\n"
  }
};
})();

node.hash = "bdd560d854154d302f3b9dbc73f9dad9";

module.exports = node;
