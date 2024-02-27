/**
 * @generated SignedSource<<ab2eef47d41dcf2c058bd79c5bf9c0f6>>
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
v2 = [
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
    "argumentDefinitions": [
      (v0/*: any*/),
      (v1/*: any*/)
    ],
    "kind": "Fragment",
    "metadata": null,
    "name": "updatePPEItemMutation",
    "selections": (v2/*: any*/),
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
    "selections": (v2/*: any*/)
  },
  "params": {
    "cacheID": "56f83f5a591988550bbfa769362c6fde",
    "id": null,
    "metadata": {},
    "name": "updatePPEItemMutation",
    "operationKind": "mutation",
    "text": "mutation updatePPEItemMutation(\n  $id: ppe_items_pk_columns_input!\n  $_set: ppe_items_set_input!\n) {\n  update_ppe_items_by_pk(pk_columns: $id, _set: $_set) {\n    id\n  }\n}\n"
  }
};
})();

node.hash = "8868f95a6cfcca9f9271836630ecae66";

module.exports = node;
