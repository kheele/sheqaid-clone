/**
 * @generated SignedSource<<90d582031712bb420bb687885d415447>>
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
    "name": "updateContractorsQuestionnaireLibraryMutation",
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
    "name": "updateContractorsQuestionnaireLibraryMutation",
    "selections": (v2/*: any*/)
  },
  "params": {
    "cacheID": "25743c62f85cf1c0fade15fa1bbf54ae",
    "id": null,
    "metadata": {},
    "name": "updateContractorsQuestionnaireLibraryMutation",
    "operationKind": "mutation",
    "text": "mutation updateContractorsQuestionnaireLibraryMutation(\n  $id: default_contractor_questionnaires_pk_columns_input!\n  $_set: default_contractor_questionnaires_set_input!\n) {\n  update_default_contractor_questionnaires_by_pk(pk_columns: $id, _set: $_set) {\n    id\n  }\n}\n"
  }
};
})();

node.hash = "b92ff785a5a11cd009356c950a4af6d6";

module.exports = node;
