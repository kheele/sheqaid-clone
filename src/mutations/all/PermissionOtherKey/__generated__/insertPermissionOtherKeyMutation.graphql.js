/**
 * @generated SignedSource<<94d0a092a0654b5abee3d65583a275f1>>
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
    "concreteType": "sheq_permissions_other_keys",
    "kind": "LinkedField",
    "name": "insert_sheq_permissions_other_keys_one",
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
    "name": "insertPermissionOtherKeyMutation",
    "selections": (v1/*: any*/),
    "type": "mutation_root",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "insertPermissionOtherKeyMutation",
    "selections": (v1/*: any*/)
  },
  "params": {
    "cacheID": "cd1d7532c2eca85514430c2868afbe3e",
    "id": null,
    "metadata": {},
    "name": "insertPermissionOtherKeyMutation",
    "operationKind": "mutation",
    "text": "mutation insertPermissionOtherKeyMutation(\n  $object: sheq_permissions_other_keys_insert_input!\n) {\n  insert_sheq_permissions_other_keys_one(object: $object) {\n    id\n  }\n}\n"
  }
};
})();

node.hash = "7109c10a9d1e363c6cdf4be0d06fbae1";

module.exports = node;
