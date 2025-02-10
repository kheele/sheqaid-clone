/**
 * @generated SignedSource<<a51c1ea1400faa88c43b0611989975d7>>
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
    "concreteType": "default_contractor_questionnaires_ques",
    "kind": "LinkedField",
    "name": "insert_default_contractor_questionnaires_ques_one",
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
    "name": "insertQuestionMutation",
    "selections": (v1/*: any*/),
    "type": "mutation_root",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "insertQuestionMutation",
    "selections": (v1/*: any*/)
  },
  "params": {
    "cacheID": "e6ab1c060918cb5ec092e135ab887ec0",
    "id": null,
    "metadata": {},
    "name": "insertQuestionMutation",
    "operationKind": "mutation",
    "text": "mutation insertQuestionMutation(\n  $object: default_contractor_questionnaires_ques_insert_input!\n) {\n  insert_default_contractor_questionnaires_ques_one(object: $object) {\n    id\n  }\n}\n"
  }
};
})();

node.hash = "3b74cab135a6c7e4851827c89620b9d0";

module.exports = node;
