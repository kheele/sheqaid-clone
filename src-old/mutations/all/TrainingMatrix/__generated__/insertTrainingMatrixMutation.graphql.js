/**
 * @generated SignedSource<<f54dfc966bbaf1c2df2c97ac88d1333a>>
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
    "concreteType": "sheq_training_matrices",
    "kind": "LinkedField",
    "name": "insert_sheq_training_matrices_one",
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
    "name": "insertTrainingMatrixMutation",
    "selections": (v1/*: any*/),
    "type": "mutation_root",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "insertTrainingMatrixMutation",
    "selections": (v1/*: any*/)
  },
  "params": {
    "cacheID": "2e09d80db4d57181ef8b712e782efa6d",
    "id": null,
    "metadata": {},
    "name": "insertTrainingMatrixMutation",
    "operationKind": "mutation",
    "text": "mutation insertTrainingMatrixMutation(\n  $object: sheq_training_matrices_insert_input!\n) {\n  insert_sheq_training_matrices_one(object: $object) {\n    id\n  }\n}\n"
  }
};
})();

node.hash = "29e7930ca8a85bf07effe3dd9c15d227";

module.exports = node;
