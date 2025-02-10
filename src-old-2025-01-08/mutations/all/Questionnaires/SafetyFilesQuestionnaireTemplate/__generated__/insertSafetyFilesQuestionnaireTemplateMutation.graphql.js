/**
 * @generated SignedSource<<c2d855b2a4bf4df984006fcae75f171f>>
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
    "name": "insertSafetyFilesQuestionnaireTemplateMutation",
    "selections": (v1/*: any*/),
    "type": "mutation_root",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "insertSafetyFilesQuestionnaireTemplateMutation",
    "selections": (v1/*: any*/)
  },
  "params": {
    "cacheID": "8b30e22a633fdff1e01bb50fa3735bd7",
    "id": null,
    "metadata": {},
    "name": "insertSafetyFilesQuestionnaireTemplateMutation",
    "operationKind": "mutation",
    "text": "mutation insertSafetyFilesQuestionnaireTemplateMutation(\n  $object: default_contractor_questionnaires_insert_input!\n) {\n  insert_default_contractor_questionnaires_one(object: $object) {\n    id\n  }\n}\n"
  }
};
})();

node.hash = "03f03756e31c0832f70eb27b0cda8ced";

module.exports = node;
