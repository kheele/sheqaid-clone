/**
 * @generated SignedSource<<a126e2348ee9cf9372c1768a0925b074>>
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
    "concreteType": "sheq_training_toolbox_talk_subjects",
    "kind": "LinkedField",
    "name": "insert_sheq_training_toolbox_talk_subjects_one",
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
    "name": "insertTrainingToolboxTalkSubjectMutation",
    "selections": (v1/*: any*/),
    "type": "mutation_root",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "insertTrainingToolboxTalkSubjectMutation",
    "selections": (v1/*: any*/)
  },
  "params": {
    "cacheID": "3445f85e44d3e75154af766110ca56ee",
    "id": null,
    "metadata": {},
    "name": "insertTrainingToolboxTalkSubjectMutation",
    "operationKind": "mutation",
    "text": "mutation insertTrainingToolboxTalkSubjectMutation(\n  $object: sheq_training_toolbox_talk_subjects_insert_input!\n) {\n  insert_sheq_training_toolbox_talk_subjects_one(object: $object) {\n    id\n  }\n}\n"
  }
};
})();

node.hash = "bdb2f72e8a53f4e0c217c99e37177e59";

module.exports = node;
