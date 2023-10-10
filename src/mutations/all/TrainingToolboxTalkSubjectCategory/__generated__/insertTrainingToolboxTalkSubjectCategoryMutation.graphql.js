/**
 * @generated SignedSource<<db458062ecc15627893ac5f12ce6a99f>>
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
    "concreteType": "sheq_training_toolbox_talk_subject_categories",
    "kind": "LinkedField",
    "name": "insert_sheq_training_toolbox_talk_subject_categories_one",
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
    "name": "insertTrainingToolboxTalkSubjectCategoryMutation",
    "selections": (v1/*: any*/),
    "type": "mutation_root",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "insertTrainingToolboxTalkSubjectCategoryMutation",
    "selections": (v1/*: any*/)
  },
  "params": {
    "cacheID": "936395707706c55e8288c599a1ceceec",
    "id": null,
    "metadata": {},
    "name": "insertTrainingToolboxTalkSubjectCategoryMutation",
    "operationKind": "mutation",
    "text": "mutation insertTrainingToolboxTalkSubjectCategoryMutation(\n  $object: sheq_training_toolbox_talk_subject_categories_insert_input!\n) {\n  insert_sheq_training_toolbox_talk_subject_categories_one(object: $object) {\n    id\n  }\n}\n"
  }
};
})();

node.hash = "a949816ce31245f952ef41774839716f";

module.exports = node;
