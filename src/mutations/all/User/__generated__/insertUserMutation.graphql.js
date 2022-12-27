/**
 * @generated SignedSource<<28ae7bd5799405f44b55c7515f344cc4>>
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
    "concreteType": "default_users",
    "kind": "LinkedField",
    "name": "insert_default_users_one",
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
    "name": "insertUserMutation",
    "selections": (v1/*: any*/),
    "type": "mutation_root",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "insertUserMutation",
    "selections": (v1/*: any*/)
  },
  "params": {
    "cacheID": "87d7bd4bc8c540103716d56509e6a4dd",
    "id": null,
    "metadata": {},
    "name": "insertUserMutation",
    "operationKind": "mutation",
    "text": "mutation insertUserMutation(\n  $object: default_users_insert_input!\n) {\n  insert_default_users_one(object: $object) {\n    id\n  }\n}\n"
  }
};
})();

node.hash = "63d1deca03aa019df93c2ecb74a2b6fe";

module.exports = node;
