/**
 * @generated SignedSource<<8dda1b09b82b05e00c4c98b7919edcf2>>
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
    "concreteType": "asset_monitoring_plan",
    "kind": "LinkedField",
    "name": "insert_asset_monitoring_plan_one",
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
        "concreteType": "asset_monitoring_plan_fuel_usage",
        "kind": "LinkedField",
        "name": "fuel_usage_list",
        "plural": true,
        "selections": [
          (v1/*: any*/),
          {
            "alias": null,
            "args": null,
            "kind": "ScalarField",
            "name": "monitoring_plan_id",
            "storageKey": null
          },
          {
            "alias": null,
            "args": null,
            "kind": "ScalarField",
            "name": "refilled_fuel",
            "storageKey": null
          },
          {
            "alias": null,
            "args": null,
            "kind": "ScalarField",
            "name": "current_hrs_or_km",
            "storageKey": null
          },
          {
            "alias": null,
            "args": null,
            "kind": "ScalarField",
            "name": "working_hrs_or_km",
            "storageKey": null
          },
          {
            "alias": null,
            "args": null,
            "kind": "ScalarField",
            "name": "date",
            "storageKey": null
          },
          {
            "alias": null,
            "args": null,
            "kind": "ScalarField",
            "name": "receipt",
            "storageKey": null
          },
          {
            "alias": null,
            "args": null,
            "kind": "ScalarField",
            "name": "cost",
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
    "name": "insertAssetMonitoringPlanMutation",
    "selections": (v2/*: any*/),
    "type": "mutation_root",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "insertAssetMonitoringPlanMutation",
    "selections": (v2/*: any*/)
  },
  "params": {
    "cacheID": "a31195b8aae58bc30e61a74837f0754a",
    "id": null,
    "metadata": {},
    "name": "insertAssetMonitoringPlanMutation",
    "operationKind": "mutation",
    "text": "mutation insertAssetMonitoringPlanMutation(\n  $object: asset_monitoring_plan_insert_input!\n) {\n  insert_asset_monitoring_plan_one(object: $object) {\n    id\n    asset_id\n    fuel_usage_list {\n      id\n      monitoring_plan_id\n      refilled_fuel\n      current_hrs_or_km\n      working_hrs_or_km\n      date\n      receipt\n      cost\n    }\n  }\n}\n"
  }
};
})();

node.hash = "319b50989ec8958a7053136c8ae788c7";

module.exports = node;
