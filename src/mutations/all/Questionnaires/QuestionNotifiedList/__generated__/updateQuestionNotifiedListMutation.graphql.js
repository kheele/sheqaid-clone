/**
 * @generated SignedSource<<a98145fa4b927766bcfa49a11795c5a0>>
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
    "concreteType": "proxy_contractor_questionnaires__notified",
    "kind": "LinkedField",
    "name": "update_proxy_contractor_questionnaires__notified_by_pk",
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
    "name": "updateQuestionNotifiedListMutation",
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
    "name": "updateQuestionNotifiedListMutation",
    "selections": (v2/*: any*/)
  },
  "params": {
    "cacheID": "afb9cebc053bfe31a8180935f55eb21d",
    "id": null,
    "metadata": {},
    "name": "updateQuestionNotifiedListMutation",
    "operationKind": "mutation",
    "text": "mutation updateQuestionNotifiedListMutation(\n  $id: proxy_contractor_questionnaires__notified_pk_columns_input!\n  $_set: proxy_contractor_questionnaires__notified_set_input!\n) {\n  update_proxy_contractor_questionnaires__notified_by_pk(pk_columns: $id, _set: $_set) {\n    id\n  }\n}\n"
  }
};
})();

node.hash = "57dde96a35170c33b428d826c04c0e8f";

module.exports = node;
