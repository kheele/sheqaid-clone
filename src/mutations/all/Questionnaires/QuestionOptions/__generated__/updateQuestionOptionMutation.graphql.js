/**
 * @generated SignedSource<<95540802da70bd2d188dd446140bc248>>
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
v2 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "id",
  "storageKey": null
},
v3 = [
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
    "concreteType": "default_contractor_questionnaires_ques_options",
    "kind": "LinkedField",
    "name": "update_default_contractor_questionnaires_ques_options_by_pk",
    "plural": false,
    "selections": [
      (v2/*: any*/),
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
          (v2/*: any*/)
        ],
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
    "name": "updateQuestionOptionMutation",
    "selections": (v3/*: any*/),
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
    "name": "updateQuestionOptionMutation",
    "selections": (v3/*: any*/)
  },
  "params": {
    "cacheID": "4296d5d79999a8f81980583d5f008c27",
    "id": null,
    "metadata": {},
    "name": "updateQuestionOptionMutation",
    "operationKind": "mutation",
    "text": "mutation updateQuestionOptionMutation(\n  $id: default_contractor_questionnaires_ques_options_pk_columns_input!\n  $_set: default_contractor_questionnaires_ques_options_set_input!\n) {\n  update_default_contractor_questionnaires_ques_options_by_pk(pk_columns: $id, _set: $_set) {\n    id\n    answer\n    optionImage\n    optionText\n    optionType\n    ques {\n      id\n    }\n  }\n}\n"
  }
};
})();

node.hash = "27d71c6bb7306a0fb06323c798e8083e";

module.exports = node;
