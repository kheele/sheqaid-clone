/**
 * @generated SignedSource<<bf292523940479c20c674eea256f43a0>>
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
    "concreteType": "asset_monitoring_plan_working_distance_or_time",
    "kind": "LinkedField",
    "name": "insert_asset_monitoring_plan_working_distance_or_time_one",
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
        "name": "working_hrs_or_km_opening",
        "storageKey": null
      },
      {
        "alias": null,
        "args": null,
        "kind": "ScalarField",
        "name": "working_hrs_or_km_closing",
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
    "name": "insertAssetMonitoringPlanWorkingHrsOrKmListItemMutation",
    "selections": (v1/*: any*/),
    "type": "mutation_root",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "insertAssetMonitoringPlanWorkingHrsOrKmListItemMutation",
    "selections": (v1/*: any*/)
  },
  "params": {
    "cacheID": "5c9d6bf3c4074960afb7d5b961896191",
    "id": null,
    "metadata": {},
    "name": "insertAssetMonitoringPlanWorkingHrsOrKmListItemMutation",
    "operationKind": "mutation",
    "text": "mutation insertAssetMonitoringPlanWorkingHrsOrKmListItemMutation(\n  $object: asset_monitoring_plan_working_distance_or_time_insert_input!\n) {\n  insert_asset_monitoring_plan_working_distance_or_time_one(object: $object) {\n    id\n    monitoring_plan_id\n    working_hrs_or_km_opening\n    working_hrs_or_km_closing\n    working_hrs_or_km\n    date\n  }\n}\n"
  }
};
})();

node.hash = "d919c21d0f560c925dd883d54efa96d0";

module.exports = node;
