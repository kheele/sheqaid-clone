/**
 * @generated SignedSource<<2cd2c9a9af7b1f986dc9c95d89c488f7>>
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
    "concreteType": "sheq_permissions_modules",
    "kind": "LinkedField",
    "name": "insert_sheq_permissions_modules_one",
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
    "name": "insertPermissionModuleMutation",
    "selections": (v1/*: any*/),
    "type": "mutation_root",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "insertPermissionModuleMutation",
    "selections": (v1/*: any*/)
  },
  "params": {
    "cacheID": "d58c88a85dce08ad52e8d404ec8c1791",
    "id": null,
    "metadata": {},
    "name": "insertPermissionModuleMutation",
    "operationKind": "mutation",
    "text": "mutation insertPermissionModuleMutation(\n  $object: sheq_permissions_modules_insert_input!\n) {\n  insert_sheq_permissions_modules_one(object: $object) {\n    id\n  }\n}\n"
  }
};
})();

node.hash = "b47c04047261a7bb6ca27ade6251cd96";

module.exports = node;
