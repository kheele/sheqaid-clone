/**
 * @generated SignedSource<<826df3a43c842680efe67b1d30caa1fb>>
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
    "concreteType": "sheq_permissions_other",
    "kind": "LinkedField",
    "name": "insert_sheq_permissions_other_one",
    "plural": false,
    "selections": [
      (v1/*: any*/),
      {
        "alias": null,
        "args": null,
        "concreteType": "sheq_permissions_actions",
        "kind": "LinkedField",
        "name": "actions",
        "plural": false,
        "selections": [
          (v1/*: any*/),
          {
            "alias": null,
            "args": null,
            "kind": "ScalarField",
            "name": "create",
            "storageKey": null
          },
          {
            "alias": null,
            "args": null,
            "kind": "ScalarField",
            "name": "edit",
            "storageKey": null
          },
          {
            "alias": null,
            "args": null,
            "kind": "ScalarField",
            "name": "view",
            "storageKey": null
          },
          {
            "alias": null,
            "args": null,
            "kind": "ScalarField",
            "name": "remove",
            "storageKey": null
          },
          {
            "alias": null,
            "args": null,
            "kind": "ScalarField",
            "name": "share",
            "storageKey": null
          }
        ],
        "storageKey": null
      },
      {
        "alias": null,
        "args": null,
        "concreteType": "sheq_permissions_other_keys",
        "kind": "LinkedField",
        "name": "key",
        "plural": false,
        "selections": [
          (v1/*: any*/),
          {
            "alias": null,
            "args": null,
            "kind": "ScalarField",
            "name": "value",
            "storageKey": null
          }
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
    "name": "insertPermissionOtherMutation",
    "selections": (v2/*: any*/),
    "type": "mutation_root",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "insertPermissionOtherMutation",
    "selections": (v2/*: any*/)
  },
  "params": {
    "cacheID": "0e9b65e18bc8be86af5b4296b00bb91b",
    "id": null,
    "metadata": {},
    "name": "insertPermissionOtherMutation",
    "operationKind": "mutation",
    "text": "mutation insertPermissionOtherMutation(\n  $object: sheq_permissions_other_insert_input!\n) {\n  insert_sheq_permissions_other_one(object: $object) {\n    id\n    actions {\n      id\n      create\n      edit\n      view\n      remove\n      share\n    }\n    key {\n      id\n      value\n    }\n  }\n}\n"
  }
};
})();

node.hash = "6bcb86b15dba908fbc3d82259151fb4c";

module.exports = node;
