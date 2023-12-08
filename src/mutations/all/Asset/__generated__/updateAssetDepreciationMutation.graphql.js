/**
 * @generated SignedSource<<7a2bdb55f396b66b7c7e684bb847dcc2>>
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
    "cacheID": "e2cfeafdeaf0909d8ffca7f26d17b9dc",
    "id": null,
    "metadata": {},
    "name": "updateAssetDepreciationMutation",
    "operationKind": "mutation",
    "text": "mutation updateAssetDepreciationMutation(\n  $id: asset_depreciation_pk_columns_input!\n  $_set: asset_depreciation_set_input!\n) {\n  update_asset_depreciation_by_pk(pk_columns: $id, _set: $_set) {\n    id\n  }\n}\n"
  }
};
})();

node.hash = "d6f96648db5a22c960ab6a383ea52b81";

module.exports = node;
