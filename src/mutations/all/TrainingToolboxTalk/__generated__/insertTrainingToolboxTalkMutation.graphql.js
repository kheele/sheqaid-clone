/**
 * @generated SignedSource<<7edf307e03292216b0211f5b535f5852>>
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
    "concreteType": "sheq_training_toolbox_talks",
    "kind": "LinkedField",
    "name": "insert_sheq_training_toolbox_talks_one",
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
    "name": "insertTrainingToolboxTalkMutation",
    "selections": (v1/*: any*/),
    "type": "mutation_root",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "insertTrainingToolboxTalkMutation",
    "selections": (v1/*: any*/)
  },
  "params": {
    "cacheID": "e15a3f8df1760a40e71e0f285c8228da",
    "id": null,
    "metadata": {},
    "name": "insertTrainingToolboxTalkMutation",
    "operationKind": "mutation",
    "text": "mutation insertTrainingToolboxTalkMutation(\n  $object: sheq_training_toolbox_talks_insert_input!\n) {\n  insert_sheq_training_toolbox_talks_one(object: $object) {\n    id\n  }\n}\n"
  }
};
})();

node.hash = "44e828167aa4cd7c0dab9e5537ad8263";

module.exports = node;
