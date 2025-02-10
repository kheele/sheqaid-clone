/**
 * @generated SignedSource<<62425ee3327da21be01799416ecbb2ec>>
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
    "cacheID": "b6ca3a7536fdb3789eebe44ffadcb99d",
    "id": null,
    "metadata": {},
    "name": "insertTrainingToolboxTalkSubjectMutation",
    "operationKind": "mutation",
    "text": "mutation insertTrainingToolboxTalkSubjectMutation(\n  $object: sheq_training_toolbox_talk_subjects_insert_input!\n) {\n  insert_sheq_training_toolbox_talk_subjects_one(object: $object) {\n    id\n    name\n  }\n}\n"
  }
};
})();

node.hash = "b27baffabace1bf8229c99d372af65e6";

module.exports = node;
