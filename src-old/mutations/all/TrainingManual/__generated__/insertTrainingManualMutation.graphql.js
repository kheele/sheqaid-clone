/**
 * @generated SignedSource<<1522d698f1b5e59fb05def3246061dd0>>
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
    "concreteType": "sheq_training_manuals",
    "kind": "LinkedField",
    "name": "insert_sheq_training_manuals_one",
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
    "name": "insertTrainingManualMutation",
    "selections": (v1/*: any*/),
    "type": "mutation_root",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "insertTrainingManualMutation",
    "selections": (v1/*: any*/)
  },
  "params": {
    "cacheID": "53842598860efd7db0e1510a3e9f1c1f",
    "id": null,
    "metadata": {},
    "name": "insertTrainingManualMutation",
    "operationKind": "mutation",
    "text": "mutation insertTrainingManualMutation(\n  $object: sheq_training_manuals_insert_input!\n) {\n  insert_sheq_training_manuals_one(object: $object) {\n    id\n  }\n}\n"
  }
};
})();

node.hash = "9808c27ecf41f69fe499e8982af5cc1f";

module.exports = node;
