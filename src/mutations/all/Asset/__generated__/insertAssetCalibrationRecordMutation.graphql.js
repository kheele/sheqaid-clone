/**
 * @generated SignedSource<<0d009720486737d21ce9b17beecd76a6>>
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
v1 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "id",
  "storageKey": null
},
v2 = [
  {
    "alias": null,
    "args": [
      {
        "kind": "Variable",
        "name": "object",
        "variableName": "object"
      }
    ],
    "concreteType": "asset_calibration_record",
    "kind": "LinkedField",
    "name": "insert_asset_calibration_record_one",
    "plural": false,
    "selections": [
      (v1/*: any*/),
      {
        "alias": null,
        "args": null,
        "kind": "ScalarField",
        "name": "asset_id",
        "storageKey": null
      },
      {
        "alias": null,
        "args": null,
        "kind": "ScalarField",
        "name": "next_calibration_interval",
        "storageKey": null
      },
      {
        "alias": null,
        "args": null,
        "kind": "ScalarField",
        "name": "next_calibration_date",
        "storageKey": null
      },
      {
        "alias": null,
        "args": null,
        "concreteType": "asset_calibration_record_list",
        "kind": "LinkedField",
        "name": "calibration_list",
        "plural": true,
        "selections": [
          (v1/*: any*/),
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
    ],
    "storageKey": null
  }
];
return {
  "fragment": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Fragment",
    "metadata": null,
    "name": "insertAssetCalibrationRecordMutation",
    "selections": (v2/*: any*/),
    "type": "mutation_root",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "insertAssetCalibrationRecordMutation",
    "selections": (v2/*: any*/)
  },
  "params": {
    "cacheID": "cb500af8efcc9947fff5dba1e4745650",
    "id": null,
    "metadata": {},
    "name": "insertAssetCalibrationRecordMutation",
    "operationKind": "mutation",
    "text": "mutation insertAssetCalibrationRecordMutation(\n  $object: asset_calibration_record_insert_input!\n) {\n  insert_asset_calibration_record_one(object: $object) {\n    id\n    asset_id\n    next_calibration_interval\n    next_calibration_date\n    calibration_list {\n      id\n      calibration_record_id\n      calibrating_company\n      reference_standard\n      certificate_num\n      calibration_date\n    }\n  }\n}\n"
  }
};
})();

node.hash = "6bd67a88b0be1dacaee0a2d4e0952664";

module.exports = node;
