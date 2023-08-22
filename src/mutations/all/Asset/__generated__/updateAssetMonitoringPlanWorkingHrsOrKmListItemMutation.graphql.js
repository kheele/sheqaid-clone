/**
 * @generated SignedSource<<02b1856acce0ff393e4bb68c1cc53fc1>>
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
    "concreteType": "asset_monitoring_plan_working_distance_or_time",
    "kind": "LinkedField",
    "name": "update_asset_monitoring_plan_working_distance_or_time_by_pk",
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
    "argumentDefinitions": [
      (v0/*: any*/),
      (v1/*: any*/)
    ],
    "kind": "Fragment",
    "metadata": null,
    "name": "updateAssetMonitoringPlanWorkingHrsOrKmListItemMutation",
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
    "name": "updateAssetMonitoringPlanWorkingHrsOrKmListItemMutation",
    "selections": (v2/*: any*/)
  },
  "params": {
    "cacheID": "d60d44c0e4a520cbca716897a702f31b",
    "id": null,
    "metadata": {},
    "name": "updateAssetMonitoringPlanWorkingHrsOrKmListItemMutation",
    "operationKind": "mutation",
    "text": "mutation updateAssetMonitoringPlanWorkingHrsOrKmListItemMutation(\n  $id: asset_monitoring_plan_working_distance_or_time_pk_columns_input!\n  $_set: asset_monitoring_plan_working_distance_or_time_set_input!\n) {\n  update_asset_monitoring_plan_working_distance_or_time_by_pk(pk_columns: $id, _set: $_set) {\n    id\n    monitoring_plan_id\n    working_hrs_or_km_opening\n    working_hrs_or_km_closing\n    working_hrs_or_km\n    date\n  }\n}\n"
  }
};
})();

node.hash = "5c1746542e168e026cf6a537dbb9be1d";

module.exports = node;
