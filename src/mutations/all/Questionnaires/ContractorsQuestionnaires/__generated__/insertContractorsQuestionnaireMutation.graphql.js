/**
 * @generated SignedSource<<2f12b56eefc33c2cdb32ce4e89f68c8e>>
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
    "name": "insertContractorsQuestionnaireMutation",
    "selections": (v1/*: any*/),
    "type": "mutation_root",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "insertContractorsQuestionnaireMutation",
    "selections": (v1/*: any*/)
  },
  "params": {
    "cacheID": "102310b542d60b92364ee8819176dbbc",
    "id": null,
    "metadata": {},
    "name": "insertContractorsQuestionnaireMutation",
    "operationKind": "mutation",
    "text": "mutation insertContractorsQuestionnaireMutation(\n  $object: default_contractor_questionnaires_insert_input!\n) {\n  insert_default_contractor_questionnaires_one(object: $object) {\n    id\n  }\n}\n"
  }
};
})();

node.hash = "b77ca3e49e0eb95d518ea80500adaaae";

module.exports = node;
