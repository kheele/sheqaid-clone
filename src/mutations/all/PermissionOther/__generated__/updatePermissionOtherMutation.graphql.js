/**
 * @generated SignedSource<<395b1d2227a6b05121764ded6f71bab2>>
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
v3 = [
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
    "concreteType": "sheq_permissions_other",
    "kind": "LinkedField",
    "name": "update_sheq_permissions_other_by_pk",
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
        "concreteType": "sheq_permissions_other_keys",
        "kind": "LinkedField",
        "name": "key",
        "plural": false,
        "selections": [
          (v2/*: any*/),
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
    "argumentDefinitions": [
      (v0/*: any*/),
      (v1/*: any*/)
    ],
    "kind": "Fragment",
    "metadata": null,
    "name": "updatePermissionOtherMutation",
    "selections": (v3/*: any*/),
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
    "name": "updatePermissionOtherMutation",
    "selections": (v3/*: any*/)
  },
  "params": {
    "cacheID": "0b9811acdcbd51e8fb67c2a0293cf89d",
    "id": null,
    "metadata": {},
    "name": "updatePermissionOtherMutation",
    "operationKind": "mutation",
    "text": "mutation updatePermissionOtherMutation(\n  $id: sheq_permissions_other_pk_columns_input!\n  $_set: sheq_permissions_other_set_input!\n) {\n  update_sheq_permissions_other_by_pk(pk_columns: $id, _set: $_set) {\n    id\n    actions {\n      id\n      create\n      edit\n      view\n      remove\n      share\n    }\n    key {\n      id\n      value\n    }\n  }\n}\n"
  }
};
})();

node.hash = "be3a2ed3eb023e2f66f973c4cb50497e";

module.exports = node;
