/**
 * @generated SignedSource<<e21859d3b399e07275b5d09fca959328>>
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
    "concreteType": "default_contractor_users",
    "kind": "LinkedField",
    "name": "insert_default_contractor_users_one",
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
    "name": "insertContractorUserMutation",
    "selections": (v1/*: any*/),
    "type": "mutation_root",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "insertContractorUserMutation",
    "selections": (v1/*: any*/)
  },
  "params": {
    "cacheID": "66437301f8d6e3766e72a8f177775747",
    "id": null,
    "metadata": {},
    "name": "insertContractorUserMutation",
    "operationKind": "mutation",
    "text": "mutation insertContractorUserMutation(\n  $object: default_contractor_users_insert_input!\n) {\n  insert_default_contractor_users_one(object: $object) {\n    id\n  }\n}\n"
  }
};
})();

node.hash = "0e3951d9df7c7ccc37eaaddb3193023a";

module.exports = node;
