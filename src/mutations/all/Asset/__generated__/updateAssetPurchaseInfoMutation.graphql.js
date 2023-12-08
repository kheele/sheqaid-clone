/**
 * @generated SignedSource<<9b312179ece8bb5e730b9a087f4fe8f7>>
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
    "concreteType": "asset_purchase_info",
    "kind": "LinkedField",
    "name": "update_asset_purchase_info_by_pk",
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
    "name": "updateAssetPurchaseInfoMutation",
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
    "name": "updateAssetPurchaseInfoMutation",
    "selections": (v2/*: any*/)
  },
  "params": {
    "cacheID": "db0f50d3ac23e7dfbba5d21e4473832e",
    "id": null,
    "metadata": {},
    "name": "updateAssetPurchaseInfoMutation",
    "operationKind": "mutation",
    "text": "mutation updateAssetPurchaseInfoMutation(\n  $id: asset_purchase_info_pk_columns_input!\n  $_set: asset_purchase_info_set_input!\n) {\n  update_asset_purchase_info_by_pk(pk_columns: $id, _set: $_set) {\n    id\n  }\n}\n"
  }
};
})();

node.hash = "81aeea700c32d16653f9b2a8b0b17fb8";

module.exports = node;
