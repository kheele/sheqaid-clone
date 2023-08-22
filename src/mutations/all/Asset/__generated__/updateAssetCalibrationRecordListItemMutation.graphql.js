/**
 * @generated SignedSource<<dfb4d43486fe77ff1b9df2afa679f220>>
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
    "concreteType": "asset_calibration_record_list",
    "kind": "LinkedField",
    "name": "update_asset_calibration_record_list_by_pk",
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
    "argumentDefinitions": [
      (v0/*: any*/),
      (v1/*: any*/)
    ],
    "kind": "Fragment",
    "metadata": null,
    "name": "updateAssetCalibrationRecordListItemMutation",
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
    "name": "updateAssetCalibrationRecordListItemMutation",
    "selections": (v2/*: any*/)
  },
  "params": {
    "cacheID": "f4f1497765b2e4ce5ab841c147c249c7",
    "id": null,
    "metadata": {},
    "name": "updateAssetCalibrationRecordListItemMutation",
    "operationKind": "mutation",
    "text": "mutation updateAssetCalibrationRecordListItemMutation(\n  $id: asset_calibration_record_list_pk_columns_input!\n  $_set: asset_calibration_record_list_set_input!\n) {\n  update_asset_calibration_record_list_by_pk(pk_columns: $id, _set: $_set) {\n    id\n    calibration_record_id\n    calibrating_company\n    reference_standard\n    certificate_num\n    calibration_date\n  }\n}\n"
  }
};
})();

node.hash = "5e726f6b87b0bb3dfd9429b7c42dc28b";

module.exports = node;
