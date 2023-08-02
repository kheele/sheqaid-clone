/**
 * @generated SignedSource<<e1bb4098ad9c6f01f01e8ce6b09825d9>>
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
    "concreteType": "default_contractor_questionnaire_templates",
    "kind": "LinkedField",
    "name": "insert_default_contractor_questionnaire_templates_one",
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
    "name": "insertContractorsQuestionnaireTemplateMutation",
    "selections": (v1/*: any*/),
    "type": "mutation_root",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "insertContractorsQuestionnaireTemplateMutation",
    "selections": (v1/*: any*/)
  },
  "params": {
    "cacheID": "a634b8a7508a5305787f64049b3d11a9",
    "id": null,
    "metadata": {},
    "name": "insertContractorsQuestionnaireTemplateMutation",
    "operationKind": "mutation",
    "text": "mutation insertContractorsQuestionnaireTemplateMutation(\n  $object: default_contractor_questionnaire_templates_insert_input!\n) {\n  insert_default_contractor_questionnaire_templates_one(object: $object) {\n    id\n  }\n}\n"
  }
};
})();

node.hash = "63cd90def97504cbba67084a3bfe5cbc";

module.exports = node;
