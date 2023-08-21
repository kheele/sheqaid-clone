/**
 * @generated SignedSource<<18be31f2a91fc366f066bca612c6fff4>>
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
      },
      {
        "alias": null,
        "args": null,
        "kind": "ScalarField",
        "name": "acquisition_date",
        "storageKey": null
      },
      {
        "alias": null,
        "args": null,
        "kind": "ScalarField",
        "name": "vendor",
        "storageKey": null
      },
      {
        "alias": null,
        "args": null,
        "kind": "ScalarField",
        "name": "acquisition_value",
        "storageKey": null
      },
      {
        "alias": null,
        "args": null,
        "kind": "ScalarField",
        "name": "warranty_expiry",
        "storageKey": null
      },
      {
        "alias": null,
        "args": null,
        "kind": "ScalarField",
        "name": "reference_num",
        "storageKey": null
      },
      {
        "alias": null,
        "args": null,
        "kind": "ScalarField",
        "name": "warranty_certificate",
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
    "cacheID": "ad87779b0c5fafd1e2ba5c908899cdeb",
    "id": null,
    "metadata": {},
    "name": "insertAssetPurchaseInfoMutation",
    "operationKind": "mutation",
    "text": "mutation insertAssetPurchaseInfoMutation(\n  $object: asset_purchase_info_insert_input!\n) {\n  insert_asset_purchase_info_one(object: $object) {\n    id\n    acquisition_date\n    vendor\n    acquisition_value\n    warranty_expiry\n    reference_num\n    warranty_certificate\n  }\n}\n"
  }
};
})();

node.hash = "b93c17ba03269d46d7d68e4468aa0ca2";

module.exports = node;
