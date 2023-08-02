/**
 * @generated SignedSource<<88b5c9522836a4ed26247abcd8ba011b>>
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
    "concreteType": "sheq_training_courses",
    "kind": "LinkedField",
    "name": "insert_sheq_training_courses_one",
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
    "name": "insertTrainingCourseMutation",
    "selections": (v1/*: any*/),
    "type": "mutation_root",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "insertTrainingCourseMutation",
    "selections": (v1/*: any*/)
  },
  "params": {
    "cacheID": "631f0a69869a49d92b20db2adaa4bcb2",
    "id": null,
    "metadata": {},
    "name": "insertTrainingCourseMutation",
    "operationKind": "mutation",
    "text": "mutation insertTrainingCourseMutation(\n  $object: sheq_training_courses_insert_input!\n) {\n  insert_sheq_training_courses_one(object: $object) {\n    id\n  }\n}\n"
  }
};
})();

node.hash = "1b2e0af8c9ad6f0d497b4fe4635ab1b8";

module.exports = node;
