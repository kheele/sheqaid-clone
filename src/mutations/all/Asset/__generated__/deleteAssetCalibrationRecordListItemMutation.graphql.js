/**
 * @generated SignedSource<<7dab21599bb74d0e538f505582f93614>>
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
    "name": "id"
  }
],
v1 = [
  {
    "alias": null,
    "args": [
      {
        "kind": "Variable",
        "name": "id",
        "variableName": "id"
      }
    ],
    "concreteType": "asset_calibration_record_list",
    "kind": "LinkedField",
    "name": "delete_asset_calibration_record_list_by_pk",
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
    "name": "deleteAssetCalibrationRecordListItemMutation",
    "selections": (v1/*: any*/),
    "type": "mutation_root",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "deleteAssetCalibrationRecordListItemMutation",
    "selections": (v1/*: any*/)
  },
  "params": {
    "cacheID": "7e76bae28d83b1c029b52f2a7234af3e",
    "id": null,
    "metadata": {},
    "name": "deleteAssetCalibrationRecordListItemMutation",
    "operationKind": "mutation",
    "text": "mutation deleteAssetCalibrationRecordListItemMutation(\n  $id: bigint!\n) {\n  delete_asset_calibration_record_list_by_pk(id: $id) {\n    id\n  }\n}\n"
  }
};
})();

node.hash = "76644df1d5e90c0a80261e76fc0502f4";

module.exports = node;
