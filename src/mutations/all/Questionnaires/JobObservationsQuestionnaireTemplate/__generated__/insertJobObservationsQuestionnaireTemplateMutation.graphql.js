/**
 * @generated SignedSource<<9ee043047ca13131e5ef8270dd81d31b>>
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
    "concreteType": "default_contractor_questionnaires",
    "kind": "LinkedField",
    "name": "insert_default_contractor_questionnaires_one",
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
    "name": "insertJobObservationsQuestionnaireTemplateMutation",
    "selections": (v1/*: any*/),
    "type": "mutation_root",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "insertJobObservationsQuestionnaireTemplateMutation",
    "selections": (v1/*: any*/)
  },
  "params": {
    "cacheID": "987d7d99daa2f158838ae7fb9b238db5",
    "id": null,
    "metadata": {},
    "name": "insertJobObservationsQuestionnaireTemplateMutation",
    "operationKind": "mutation",
    "text": "mutation insertJobObservationsQuestionnaireTemplateMutation(\n  $object: default_contractor_questionnaires_insert_input!\n) {\n  insert_default_contractor_questionnaires_one(object: $object) {\n    id\n  }\n}\n"
  }
};
})();

node.hash = "fe019b4b17316a2beb790d5334e5026b";

module.exports = node;
