/**
 * @generated SignedSource<<98a1f397de30a0472675bfd445f5fdc9>>
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
    "concreteType": "asset_purchase_info",
    "kind": "LinkedField",
    "name": "insert_asset_purchase_info_one",
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
    "name": "insertAssetPurchaseInfoMutation",
    "selections": (v1/*: any*/),
    "type": "mutation_root",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "insertAssetPurchaseInfoMutation",
    "selections": (v1/*: any*/)
  },
  "params": {
    "cacheID": "ee78b3184b65573b4877f0bba1c1f56c",
    "id": null,
    "metadata": {},
    "name": "insertAssetPurchaseInfoMutation",
    "operationKind": "mutation",
    "text": "mutation insertAssetPurchaseInfoMutation(\n  $object: asset_purchase_info_insert_input!\n) {\n  insert_asset_purchase_info_one(object: $object) {\n    id\n  }\n}\n"
  }
};
})();

node.hash = "69200d5899b8eb9eb71909a517028adb";

module.exports = node;
