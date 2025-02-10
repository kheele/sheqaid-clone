/**
 * @generated SignedSource<<0bed78e93872554b429856948fc0eaa3>>
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
    "name": "insertInspectionsQuestionnaireTemplateMutation",
    "selections": (v1/*: any*/),
    "type": "mutation_root",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "insertInspectionsQuestionnaireTemplateMutation",
    "selections": (v1/*: any*/)
  },
  "params": {
    "cacheID": "fec0f7f6add2e4d8a89e7a2c9203fdfb",
    "id": null,
    "metadata": {},
    "name": "insertInspectionsQuestionnaireTemplateMutation",
    "operationKind": "mutation",
    "text": "mutation insertInspectionsQuestionnaireTemplateMutation(\n  $object: default_contractor_questionnaires_insert_input!\n) {\n  insert_default_contractor_questionnaires_one(object: $object) {\n    id\n  }\n}\n"
  }
};
})();

node.hash = "5374d87d2cee62db89a43057d3b6ce3f";

module.exports = node;
