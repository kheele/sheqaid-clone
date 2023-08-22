/**
 * @generated SignedSource<<21d3ee0808c9779f08235cac8d8d3802>>
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
    "concreteType": "asset_monitoring_plan_fuel_usage",
    "kind": "LinkedField",
    "name": "insert_asset_monitoring_plan_fuel_usage_one",
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
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Fragment",
    "metadata": null,
    "name": "insertAssetMonitoringPlanFuelUsageListItemMutation",
    "selections": (v1/*: any*/),
    "type": "mutation_root",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "insertAssetMonitoringPlanFuelUsageListItemMutation",
    "selections": (v1/*: any*/)
  },
  "params": {
    "cacheID": "28af6a95eb9ed1edfdc129acebaec5c6",
    "id": null,
    "metadata": {},
    "name": "insertAssetMonitoringPlanFuelUsageListItemMutation",
    "operationKind": "mutation",
    "text": "mutation insertAssetMonitoringPlanFuelUsageListItemMutation(\n  $object: asset_monitoring_plan_fuel_usage_insert_input!\n) {\n  insert_asset_monitoring_plan_fuel_usage_one(object: $object) {\n    id\n    monitoring_plan_id\n    refilled_fuel\n    current_hrs_or_km\n    working_hrs_or_km\n    date\n    receipt\n    cost\n  }\n}\n"
  }
};
})();

node.hash = "e67691296e891469c6df26b10d11e732";

module.exports = node;
