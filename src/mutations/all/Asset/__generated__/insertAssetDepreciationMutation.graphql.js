/**
 * @generated SignedSource<<fcd7e8ead63b09f02ee6aefd97b7aee6>>
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
    "concreteType": "asset_depreciation",
    "kind": "LinkedField",
    "name": "insert_asset_depreciation_one",
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
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Fragment",
    "metadata": null,
    "name": "insertAssetDepreciationMutation",
    "selections": (v1/*: any*/),
    "type": "mutation_root",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "insertAssetDepreciationMutation",
    "selections": (v1/*: any*/)
  },
  "params": {
    "cacheID": "96b63342f916de0f6c2154a2d3722388",
    "id": null,
    "metadata": {},
    "name": "insertAssetDepreciationMutation",
    "operationKind": "mutation",
    "text": "mutation insertAssetDepreciationMutation(\n  $object: asset_depreciation_insert_input!\n) {\n  insert_asset_depreciation_one(object: $object) {\n    id\n    depreciation_method\n    asset_cost\n    salvage_value\n    depreciation_years\n    depreciation_factor\n    partial_year_depreciation\n  }\n}\n"
  }
};
})();

node.hash = "9305440456269a6f4fb81878edd406a7";

module.exports = node;
