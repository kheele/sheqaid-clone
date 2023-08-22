/**
 * @generated SignedSource<<5dd9242ddbcfcaa4eab09496506b1d21>>
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
    "concreteType": "asset_monitoring_plan_fuel_usage",
    "kind": "LinkedField",
    "name": "delete_asset_monitoring_plan_fuel_usage_by_pk",
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
    "name": "deleteAssetMonitoringPlanFuelUsageListItemMutation",
    "selections": (v1/*: any*/),
    "type": "mutation_root",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "deleteAssetMonitoringPlanFuelUsageListItemMutation",
    "selections": (v1/*: any*/)
  },
  "params": {
    "cacheID": "504e3835ea937a5aac309eb139fa5a88",
    "id": null,
    "metadata": {},
    "name": "deleteAssetMonitoringPlanFuelUsageListItemMutation",
    "operationKind": "mutation",
    "text": "mutation deleteAssetMonitoringPlanFuelUsageListItemMutation(\n  $id: bigint!\n) {\n  delete_asset_monitoring_plan_fuel_usage_by_pk(id: $id) {\n    id\n  }\n}\n"
  }
};
})();

node.hash = "76e37663d55c271384d22f9ca28d0a55";

module.exports = node;
