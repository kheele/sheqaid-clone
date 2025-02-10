/**
 * @generated SignedSource<<591a4b564c08dcc213c1fb888e275bd5>>
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
    "name": "updateQuestionnaireMutation",
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
    "name": "updateQuestionnaireMutation",
    "selections": (v2/*: any*/)
  },
  "params": {
    "cacheID": "c4845d91acb45a4cc72d24c7bf35795d",
    "id": null,
    "metadata": {},
    "name": "updateQuestionnaireMutation",
    "operationKind": "mutation",
    "text": "mutation updateQuestionnaireMutation(\n  $id: default_contractor_questionnaires_pk_columns_input!\n  $_set: default_contractor_questionnaires_set_input!\n) {\n  update_default_contractor_questionnaires_by_pk(pk_columns: $id, _set: $_set) {\n    id\n  }\n}\n"
  }
};
})();

node.hash = "131f0a6fa7be98c735384ad42d6381ce";

module.exports = node;
