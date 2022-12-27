/**
 * @generated SignedSource<<5f7feebe455750e1e2cb1541b677430a>>
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
    "concreteType": "sheq_permissions_other",
    "kind": "LinkedField",
    "name": "insert_sheq_permissions_other_one",
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
    "name": "insertPermissionOtherMutation",
    "selections": (v1/*: any*/),
    "type": "mutation_root",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "insertPermissionOtherMutation",
    "selections": (v1/*: any*/)
  },
  "params": {
    "cacheID": "1a21752a1a80ff37fb96e55b5214301c",
    "id": null,
    "metadata": {},
    "name": "insertPermissionOtherMutation",
    "operationKind": "mutation",
    "text": "mutation insertPermissionOtherMutation(\n  $object: sheq_permissions_other_insert_input!\n) {\n  insert_sheq_permissions_other_one(object: $object) {\n    id\n  }\n}\n"
  }
};
})();

node.hash = "53552c7b93b4160cd233f02a0bd5cebc";

module.exports = node;
