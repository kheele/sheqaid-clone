/**
 * @generated SignedSource<<14373d944a095956ca9cbf088119b365>>
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
    "concreteType": "asset_calibration_record_list",
    "kind": "LinkedField",
    "name": "insert_asset_calibration_record_list_one",
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
        "name": "calibration_record_id",
        "storageKey": null
      },
      {
        "alias": null,
        "args": null,
        "kind": "ScalarField",
        "name": "calibrating_company",
        "storageKey": null
      },
      {
        "alias": null,
        "args": null,
        "kind": "ScalarField",
        "name": "reference_standard",
        "storageKey": null
      },
      {
        "alias": null,
        "args": null,
        "kind": "ScalarField",
        "name": "certificate_num",
        "storageKey": null
      },
      {
        "alias": null,
        "args": null,
        "kind": "ScalarField",
        "name": "calibration_date",
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
    "name": "insertAssetCalibrationRecordListItemMutation",
    "selections": (v1/*: any*/),
    "type": "mutation_root",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "insertAssetCalibrationRecordListItemMutation",
    "selections": (v1/*: any*/)
  },
  "params": {
    "cacheID": "011c2ee20292ee585bbf31b62bf1a94c",
    "id": null,
    "metadata": {},
    "name": "insertAssetCalibrationRecordListItemMutation",
    "operationKind": "mutation",
    "text": "mutation insertAssetCalibrationRecordListItemMutation(\n  $object: asset_calibration_record_list_insert_input!\n) {\n  insert_asset_calibration_record_list_one(object: $object) {\n    id\n    calibration_record_id\n    calibrating_company\n    reference_standard\n    certificate_num\n    calibration_date\n  }\n}\n"
  }
};
})();

node.hash = "aeac15c89b9a24db68c3675320c5e994";

module.exports = node;
