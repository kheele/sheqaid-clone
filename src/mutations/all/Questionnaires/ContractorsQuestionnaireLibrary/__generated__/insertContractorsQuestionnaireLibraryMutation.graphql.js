/**
 * @generated SignedSource<<be19666fa0fba0a50d90a3170feb24cb>>
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
    "name": "insertContractorsQuestionnaireLibraryMutation",
    "selections": (v1/*: any*/),
    "type": "mutation_root",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "insertContractorsQuestionnaireLibraryMutation",
    "selections": (v1/*: any*/)
  },
  "params": {
    "cacheID": "5527faab547db4642bf2235a4027ea25",
    "id": null,
    "metadata": {},
    "name": "insertContractorsQuestionnaireLibraryMutation",
    "operationKind": "mutation",
    "text": "mutation insertContractorsQuestionnaireLibraryMutation(\n  $object: default_contractor_questionnaires_insert_input!\n) {\n  insert_default_contractor_questionnaires_one(object: $object) {\n    id\n  }\n}\n"
  }
};
})();

node.hash = "afe11016581e9b871564fec0b8a4cbf3";

module.exports = node;
