/**
 * @generated SignedSource<<beb65e54e74a125f191102038d59c3fc>>
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
    "concreteType": "sheq_training_toolbox_talk_subject_categories",
    "kind": "LinkedField",
    "name": "update_sheq_training_toolbox_talk_subject_categories_by_pk",
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
    "name": "updateTrainingToolboxTalkSubjectCategoryMutation",
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
    "name": "updateTrainingToolboxTalkSubjectCategoryMutation",
    "selections": (v2/*: any*/)
  },
  "params": {
    "cacheID": "bcde466ead0e38ddae50b5088558ff33",
    "id": null,
    "metadata": {},
    "name": "updateTrainingToolboxTalkSubjectCategoryMutation",
    "operationKind": "mutation",
    "text": "mutation updateTrainingToolboxTalkSubjectCategoryMutation(\n  $id: sheq_training_toolbox_talk_subject_categories_pk_columns_input!\n  $_set: sheq_training_toolbox_talk_subject_categories_set_input!\n) {\n  update_sheq_training_toolbox_talk_subject_categories_by_pk(pk_columns: $id, _set: $_set) {\n    id\n  }\n}\n"
  }
};
})();

node.hash = "b06c9c8d0c621c3317837256870f123d";

module.exports = node;
