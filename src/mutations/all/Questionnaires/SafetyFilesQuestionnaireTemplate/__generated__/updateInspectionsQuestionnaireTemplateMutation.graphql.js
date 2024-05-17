/**
 * @generated SignedSource<<a6ec64764ac6a5e68321f1bc2194a27e>>
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
    "concreteType": "default_contractor_questionnaires",
    "kind": "LinkedField",
    "name": "update_default_contractor_questionnaires_by_pk",
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
    "name": "updateInspectionsQuestionnaireTemplateMutation",
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
    "name": "updateInspectionsQuestionnaireTemplateMutation",
    "selections": (v2/*: any*/)
  },
  "params": {
    "cacheID": "6a79d9b84a3ce8ea11f1bc812668f549",
    "id": null,
    "metadata": {},
    "name": "updateInspectionsQuestionnaireTemplateMutation",
    "operationKind": "mutation",
    "text": "mutation updateInspectionsQuestionnaireTemplateMutation(\n  $id: default_contractor_questionnaires_pk_columns_input!\n  $_set: default_contractor_questionnaires_set_input!\n) {\n  update_default_contractor_questionnaires_by_pk(pk_columns: $id, _set: $_set) {\n    id\n  }\n}\n"
  }
};
})();

node.hash = "4727065eca5b4ef5fbe4727d9ce953db";

module.exports = node;
