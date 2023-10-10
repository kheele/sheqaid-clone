/**
 * @generated SignedSource<<5b9dae90756da1a95b865f356690edd5>>
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
    "concreteType": "sheq_training_toolbox_talks",
    "kind": "LinkedField",
    "name": "update_sheq_training_toolbox_talks_by_pk",
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
    "name": "updateTrainingToolboxTalkMutation",
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
    "name": "updateTrainingToolboxTalkMutation",
    "selections": (v2/*: any*/)
  },
  "params": {
    "cacheID": "d41b0a0550fba305f98cff15a30f697c",
    "id": null,
    "metadata": {},
    "name": "updateTrainingToolboxTalkMutation",
    "operationKind": "mutation",
    "text": "mutation updateTrainingToolboxTalkMutation(\n  $id: sheq_training_toolbox_talks_pk_columns_input!\n  $_set: sheq_training_toolbox_talks_set_input!\n) {\n  update_sheq_training_toolbox_talks_by_pk(pk_columns: $id, _set: $_set) {\n    id\n  }\n}\n"
  }
};
})();

node.hash = "b1a05e9b301080b7630c54397c6f55a1";

module.exports = node;
