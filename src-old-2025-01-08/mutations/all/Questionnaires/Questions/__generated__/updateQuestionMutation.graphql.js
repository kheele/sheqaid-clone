/**
 * @generated SignedSource<<81b7e0dfb66ebe1407394d4ebc8108f3>>
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
    "concreteType": "default_contractor_questionnaires_ques",
    "kind": "LinkedField",
    "name": "update_default_contractor_questionnaires_ques_by_pk",
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
    "name": "updateQuestionMutation",
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
    "name": "updateQuestionMutation",
    "selections": (v2/*: any*/)
  },
  "params": {
    "cacheID": "28aaa57784e984803aa5043141e31367",
    "id": null,
    "metadata": {},
    "name": "updateQuestionMutation",
    "operationKind": "mutation",
    "text": "mutation updateQuestionMutation(\n  $id: default_contractor_questionnaires_ques_pk_columns_input!\n  $_set: default_contractor_questionnaires_ques_set_input!\n) {\n  update_default_contractor_questionnaires_ques_by_pk(pk_columns: $id, _set: $_set) {\n    id\n  }\n}\n"
  }
};
})();

node.hash = "afa3631d44e8799700f3eb28b6f1323a";

module.exports = node;
