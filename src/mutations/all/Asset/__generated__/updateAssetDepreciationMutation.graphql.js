/**
 * @generated SignedSource<<a65d58728e75162e4eeee7403fff5393>>
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
    "concreteType": "asset_depreciation",
    "kind": "LinkedField",
    "name": "update_asset_depreciation_by_pk",
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
        "name": "depreciation_method",
        "storageKey": null
      },
      {
        "alias": null,
        "args": null,
        "kind": "ScalarField",
        "name": "asset_cost",
        "storageKey": null
      },
      {
        "alias": null,
        "args": null,
        "kind": "ScalarField",
        "name": "salvage_value",
        "storageKey": null
      },
      {
        "alias": null,
        "args": null,
        "kind": "ScalarField",
        "name": "depreciation_years",
        "storageKey": null
      },
      {
        "alias": null,
        "args": null,
        "kind": "ScalarField",
        "name": "depreciation_factor",
        "storageKey": null
      },
      {
        "alias": null,
        "args": null,
        "kind": "ScalarField",
        "name": "partial_year_depreciation",
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
    "name": "updateAssetDepreciationMutation",
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
    "name": "updateAssetDepreciationMutation",
    "selections": (v2/*: any*/)
  },
  "params": {
    "cacheID": "515125e9e6efd714b68e5d72321a2cb7",
    "id": null,
    "metadata": {},
    "name": "updateAssetDepreciationMutation",
    "operationKind": "mutation",
    "text": "mutation updateAssetDepreciationMutation(\n  $id: asset_depreciation_pk_columns_input!\n  $_set: asset_depreciation_set_input!\n) {\n  update_asset_depreciation_by_pk(pk_columns: $id, _set: $_set) {\n    id\n    depreciation_method\n    asset_cost\n    salvage_value\n    depreciation_years\n    depreciation_factor\n    partial_year_depreciation\n  }\n}\n"
  }
};
})();

node.hash = "e05f0ab7fb7b529e48eac0657a514b6d";

module.exports = node;
