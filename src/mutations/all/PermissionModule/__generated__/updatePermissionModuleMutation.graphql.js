/**
 * @generated SignedSource<<414a36ac268d6ac75fbfc7c4d96e1b22>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* eslint-disable */

'use strict';

var node = (function(){
var v0 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "_set"
},
v1 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "id"
},
v2 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "id",
  "storageKey": null
},
v3 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "key",
  "storageKey": null
},
v4 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "title",
  "storageKey": null
},
v5 = [
  {
    "alias": null,
    "args": [
      {
        "kind": "Variable",
        "name": "_set",
        "variableName": "_set"
      },
      {
        "kind": "Variable",
        "name": "pk_columns",
        "variableName": "id"
      }
    ],
    "concreteType": "sheq_permissions_modules",
    "kind": "LinkedField",
    "name": "update_sheq_permissions_modules_by_pk",
    "plural": false,
    "selections": [
      (v2/*: any*/),
      {
        "alias": null,
        "args": null,
        "concreteType": "sheq_permissions_actions",
        "kind": "LinkedField",
        "name": "actions",
        "plural": false,
        "selections": [
          (v2/*: any*/),
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
          (v2/*: any*/),
          (v3/*: any*/),
          (v4/*: any*/),
          {
            "alias": null,
            "args": null,
            "concreteType": "default_manager_plugin",
            "kind": "LinkedField",
            "name": "plugin",
            "plural": false,
            "selections": [
              (v2/*: any*/),
              (v3/*: any*/),
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
              (v4/*: any*/)
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
    "argumentDefinitions": [
      (v0/*: any*/),
      (v1/*: any*/)
    ],
    "kind": "Fragment",
    "metadata": null,
    "name": "updatePermissionModuleMutation",
    "selections": (v5/*: any*/),
    "type": "mutation_root",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": [
      (v1/*: any*/),
      (v0/*: any*/)
    ],
    "kind": "Operation",
    "name": "updatePermissionModuleMutation",
    "selections": (v5/*: any*/)
  },
  "params": {
    "cacheID": "fc2c2a0b12a459f1122b85136c751f96",
    "id": null,
    "metadata": {},
    "name": "updatePermissionModuleMutation",
    "operationKind": "mutation",
    "text": "mutation updatePermissionModuleMutation(\n  $id: sheq_permissions_modules_pk_columns_input!\n  $_set: sheq_permissions_modules_set_input!\n) {\n  update_sheq_permissions_modules_by_pk(pk_columns: $id, _set: $_set) {\n    id\n    actions {\n      id\n      create\n      edit\n      view\n      remove\n      share\n    }\n    module {\n      id\n      key\n      title\n      plugin {\n        id\n        key\n        desc\n        status\n        title\n      }\n    }\n  }\n}\n"
  }
};
})();

node.hash = "1c48507def8c033e4498cfd35cde5b6a";

module.exports = node;
