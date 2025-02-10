/**
 * @generated SignedSource<<6590d7d35c225f5b84ae7d11947a6f84>>
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
v1 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "id",
  "storageKey": null
},
v2 = [
  {
    "alias": null,
    "args": [
      {
        "kind": "Variable",
        "name": "object",
        "variableName": "object"
      }
    ],
    "concreteType": "default_contractor_questionnaires_ques_options",
    "kind": "LinkedField",
    "name": "insert_default_contractor_questionnaires_ques_options_one",
    "plural": false,
    "selections": [
      (v1/*: any*/),
      {
        "alias": null,
        "args": null,
        "kind": "ScalarField",
        "name": "answer",
        "storageKey": null
      },
      {
        "alias": null,
        "args": null,
        "kind": "ScalarField",
        "name": "optionImage",
        "storageKey": null
      },
      {
        "alias": null,
        "args": null,
        "kind": "ScalarField",
        "name": "optionText",
        "storageKey": null
      },
      {
        "alias": null,
        "args": null,
        "kind": "ScalarField",
        "name": "optionType",
        "storageKey": null
      },
      {
        "alias": null,
        "args": null,
        "concreteType": "default_contractor_questionnaires_ques",
        "kind": "LinkedField",
        "name": "ques",
        "plural": false,
        "selections": [
          (v1/*: any*/)
        ],
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
    "name": "insertQuestionOptionMutation",
    "selections": (v2/*: any*/),
    "type": "mutation_root",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "insertQuestionOptionMutation",
    "selections": (v2/*: any*/)
  },
  "params": {
    "cacheID": "9e0d1cf67529fb4140fed9c250fdfe0f",
    "id": null,
    "metadata": {},
    "name": "insertQuestionOptionMutation",
    "operationKind": "mutation",
    "text": "mutation insertQuestionOptionMutation(\n  $object: default_contractor_questionnaires_ques_options_insert_input!\n) {\n  insert_default_contractor_questionnaires_ques_options_one(object: $object) {\n    id\n    answer\n    optionImage\n    optionText\n    optionType\n    ques {\n      id\n    }\n  }\n}\n"
  }
};
})();

node.hash = "188d2a454e2308b38d052e4ce18c8ef1";

module.exports = node;
