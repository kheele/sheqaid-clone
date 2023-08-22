/**
 * @generated SignedSource<<a7eeedf0efe39c4e6ce20003f3991adc>>
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
    "concreteType": "asset_monitoring_plan_fuel_usage",
    "kind": "LinkedField",
    "name": "update_asset_monitoring_plan_fuel_usage_by_pk",
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
];
return {
  "fragment": {
    "argumentDefinitions": [
      (v0/*: any*/),
      (v1/*: any*/)
    ],
    "kind": "Fragment",
    "metadata": null,
    "name": "updateAssetMonitoringPlanFuelUsageListItemMutation",
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
    "name": "updateAssetMonitoringPlanFuelUsageListItemMutation",
    "selections": (v2/*: any*/)
  },
  "params": {
    "cacheID": "51b239dedb9672985e91683732fcd877",
    "id": null,
    "metadata": {},
    "name": "updateAssetMonitoringPlanFuelUsageListItemMutation",
    "operationKind": "mutation",
    "text": "mutation updateAssetMonitoringPlanFuelUsageListItemMutation(\n  $id: asset_monitoring_plan_fuel_usage_pk_columns_input!\n  $_set: asset_monitoring_plan_fuel_usage_set_input!\n) {\n  update_asset_monitoring_plan_fuel_usage_by_pk(pk_columns: $id, _set: $_set) {\n    id\n    monitoring_plan_id\n    refilled_fuel\n    current_hrs_or_km\n    working_hrs_or_km\n    date\n    receipt\n    cost\n  }\n}\n"
  }
};
})();

node.hash = "e7524f792fe15c6d081fd580d0b6ae36";

module.exports = node;
