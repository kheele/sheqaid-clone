/**
 * @generated SignedSource<<125f472129a9574cfd575f7b19aa1168>>
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
    "concreteType": "default_contractor_questionnaire_templates",
    "kind": "LinkedField",
    "name": "update_default_contractor_questionnaire_templates_by_pk",
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
    "name": "updateContractorsQuestionnaireTemplateMutation",
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
    "name": "updateContractorsQuestionnaireTemplateMutation",
    "selections": (v2/*: any*/)
  },
  "params": {
    "cacheID": "6e0d52d3692a43bb7fecd33299567534",
    "id": null,
    "metadata": {},
    "name": "updateContractorsQuestionnaireTemplateMutation",
    "operationKind": "mutation",
    "text": "mutation updateContractorsQuestionnaireTemplateMutation(\n  $id: default_contractor_questionnaire_templates_pk_columns_input!\n  $_set: default_contractor_questionnaire_templates_set_input!\n) {\n  update_default_contractor_questionnaire_templates_by_pk(pk_columns: $id, _set: $_set) {\n    id\n  }\n}\n"
  }
};
})();

node.hash = "59d5bb580f89c8590892a5b94a6531d1";

module.exports = node;
