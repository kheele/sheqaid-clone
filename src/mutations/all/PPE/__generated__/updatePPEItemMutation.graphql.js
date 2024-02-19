/**
 * @generated SignedSource<<16ac55203f09dd1383d5824bf38a2b05>>
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
    "concreteType": "ppe_items",
    "kind": "LinkedField",
    "name": "update_ppe_items_by_pk",
    "plural": false,
    "selections": [
      (v2/*: any*/),
      {
        "alias": null,
        "args": null,
        "kind": "ScalarField",
        "name": "removed",
        "storageKey": null
      },
      {
        "alias": null,
        "args": null,
        "kind": "ScalarField",
        "name": "created_at",
        "storageKey": null
      },
      {
        "alias": null,
        "args": null,
        "kind": "ScalarField",
        "name": "notes",
        "storageKey": null
      },
      {
        "alias": null,
        "args": null,
        "kind": "ScalarField",
        "name": "profile_pic",
        "storageKey": null
      },
      {
        "alias": null,
        "args": null,
        "kind": "ScalarField",
        "name": "serial_num",
        "storageKey": null
      },
      {
        "alias": null,
        "args": null,
        "kind": "ScalarField",
        "name": "purchase_date",
        "storageKey": null
      },
      {
        "alias": null,
        "args": null,
        "kind": "ScalarField",
        "name": "condition",
        "storageKey": null
      },
      {
        "alias": null,
        "args": null,
        "concreteType": "ppe_types",
        "kind": "LinkedField",
        "name": "ppe_type",
        "plural": false,
        "selections": [
          (v2/*: any*/)
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
    "name": "updatePPEItemMutation",
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
    "name": "updatePPEItemMutation",
    "selections": (v3/*: any*/)
  },
  "params": {
    "cacheID": "f11d93ee468a0e8604072edaefb07c00",
    "id": null,
    "metadata": {},
    "name": "updatePPEItemMutation",
    "operationKind": "mutation",
    "text": "mutation updatePPEItemMutation(\n  $id: ppe_items_pk_columns_input!\n  $_set: ppe_items_set_input!\n) {\n  update_ppe_items_by_pk(pk_columns: $id, _set: $_set) {\n    id\n    removed\n    created_at\n    notes\n    profile_pic\n    serial_num\n    purchase_date\n    condition\n    ppe_type {\n      id\n    }\n  }\n}\n"
  }
};
})();

node.hash = "3167fc800bdb7e604e0bb0414e779e56";

module.exports = node;
