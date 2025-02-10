/**
 * @generated SignedSource<<c85db4c8af908476f65fe349f8e8f399>>
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
    "concreteType": "default_contractor_questionnaires",
    "kind": "LinkedField",
    "name": "insert_default_contractor_questionnaires_one",
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
    "name": "insertSafetyFilesQuestionnaireMutation",
    "selections": (v1/*: any*/),
    "type": "mutation_root",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "insertSafetyFilesQuestionnaireMutation",
    "selections": (v1/*: any*/)
  },
  "params": {
    "cacheID": "1a2ee70c9f6c3b43d9867ada143f0408",
    "id": null,
    "metadata": {},
    "name": "insertSafetyFilesQuestionnaireMutation",
    "operationKind": "mutation",
    "text": "mutation insertSafetyFilesQuestionnaireMutation(\n  $object: default_contractor_questionnaires_insert_input!\n) {\n  insert_default_contractor_questionnaires_one(object: $object) {\n    id\n  }\n}\n"
  }
};
})();

node.hash = "6ddffe6fcdec52422b66471cf376f04a";

module.exports = node;
