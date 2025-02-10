/**
 * @generated SignedSource<<34b9fafb9bea0ccfa7d8f3cde85e2a48>>
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
    "concreteType": "proxy_contractor_questionnaires__notified",
    "kind": "LinkedField",
    "name": "insert_proxy_contractor_questionnaires__notified_one",
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
    "name": "insertQuestionNotifiedListMutation",
    "selections": (v1/*: any*/),
    "type": "mutation_root",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "insertQuestionNotifiedListMutation",
    "selections": (v1/*: any*/)
  },
  "params": {
    "cacheID": "294f6b2458aaf5df765f789a3109626a",
    "id": null,
    "metadata": {},
    "name": "insertQuestionNotifiedListMutation",
    "operationKind": "mutation",
    "text": "mutation insertQuestionNotifiedListMutation(\n  $object: proxy_contractor_questionnaires__notified_insert_input!\n) {\n  insert_proxy_contractor_questionnaires__notified_one(object: $object) {\n    id\n  }\n}\n"
  }
};
})();

node.hash = "3e6e1261f8e65750bb2b291cb29d36e2";

module.exports = node;
