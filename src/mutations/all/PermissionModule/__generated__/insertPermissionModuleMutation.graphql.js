/**
 * @generated SignedSource<<6b24265d2c38e7db748060ebf4624192>>
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
v2 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "key",
  "storageKey": null
},
v3 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "title",
  "storageKey": null
},
v4 = [
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
        "concreteType": "default_manager_module",
        "kind": "LinkedField",
        "name": "module",
        "plural": false,
        "selections": [
          (v1/*: any*/),
          (v2/*: any*/),
          (v3/*: any*/),
          {
            "alias": null,
            "args": null,
            "concreteType": "default_manager_plugin",
            "kind": "LinkedField",
            "name": "plugin",
            "plural": false,
            "selections": [
              (v1/*: any*/),
              (v2/*: any*/),
              {
                "alias": null,
                "args": null,
                "kind": "ScalarField",
                "name": "desc",
                "storageKey": null
              },
              {
                "alias": null,
                "args": null,
                "kind": "ScalarField",
                "name": "status",
                "storageKey": null
              },
              (v3/*: any*/)
            ],
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
    "name": "insertPermissionModuleMutation",
    "selections": (v4/*: any*/),
    "type": "mutation_root",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "insertPermissionModuleMutation",
    "selections": (v4/*: any*/)
  },
  "params": {
    "cacheID": "d706fc80d8af60372e74b9b1a612bae3",
    "id": null,
    "metadata": {},
    "name": "insertPermissionModuleMutation",
    "operationKind": "mutation",
    "text": "mutation insertPermissionModuleMutation(\n  $object: sheq_permissions_modules_insert_input!\n) {\n  insert_sheq_permissions_modules_one(object: $object) {\n    id\n    actions {\n      id\n      create\n      edit\n      view\n      remove\n      share\n    }\n    module {\n      id\n      key\n      title\n      plugin {\n        id\n        key\n        desc\n        status\n        title\n      }\n    }\n  }\n}\n"
  }
};
})();

node.hash = "206c078b6674102abdb2116b7706d2ad";

module.exports = node;
