/**
 * @generated SignedSource<<0bae49f88eae5c85591d2381e973100f>>
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
    "concreteType": "asset_monitoring_plan_working_distance_or_time",
    "kind": "LinkedField",
    "name": "delete_asset_monitoring_plan_working_distance_or_time_by_pk",
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
    "name": "deleteAssetMonitoringPlanWorkingHrsOrKmListItemMutation",
    "selections": (v1/*: any*/),
    "type": "mutation_root",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "deleteAssetMonitoringPlanWorkingHrsOrKmListItemMutation",
    "selections": (v1/*: any*/)
  },
  "params": {
    "cacheID": "180c983d3ced10013c70b3e69f005362",
    "id": null,
    "metadata": {},
    "name": "deleteAssetMonitoringPlanWorkingHrsOrKmListItemMutation",
    "operationKind": "mutation",
    "text": "mutation deleteAssetMonitoringPlanWorkingHrsOrKmListItemMutation(\n  $id: bigint!\n) {\n  delete_asset_monitoring_plan_working_distance_or_time_by_pk(id: $id) {\n    id\n  }\n}\n"
  }
};
})();

node.hash = "3ec467b62920d1f5bf55bac88a4b1761";

module.exports = node;
