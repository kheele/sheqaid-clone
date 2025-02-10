/**
 * @generated SignedSource<<59b5e2da8c556f9e475d142864dfa9da>>
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
    "name": "updateContractorsQuestionnaireMutation",
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
    "name": "updateContractorsQuestionnaireMutation",
    "selections": (v2/*: any*/)
  },
  "params": {
    "cacheID": "0bdb047291ef641a1e2119e47735309b",
    "id": null,
    "metadata": {},
    "name": "updateContractorsQuestionnaireMutation",
    "operationKind": "mutation",
    "text": "mutation updateContractorsQuestionnaireMutation(\n  $id: default_contractor_questionnaires_pk_columns_input!\n  $_set: default_contractor_questionnaires_set_input!\n) {\n  update_default_contractor_questionnaires_by_pk(pk_columns: $id, _set: $_set) {\n    id\n  }\n}\n"
  }
};
})();

node.hash = "6fa036b03fdf71d706ebefbdc7f00e71";

module.exports = node;
