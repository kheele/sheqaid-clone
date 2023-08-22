/**
 * @generated SignedSource<<d600e65dd3bf052adf465bc73861f081>>
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
v2 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "id",
  "storageKey": null
},
v3 = [
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
    "concreteType": "asset_maintenance_plan_list",
    "kind": "LinkedField",
    "name": "update_asset_maintenance_plan_list_by_pk",
    "plural": false,
    "selections": [
      (v2/*: any*/),
      {
        "alias": null,
        "args": null,
        "kind": "ScalarField",
        "name": "maintenance_plan_id",
        "storageKey": null
      },
      {
        "alias": null,
        "args": null,
        "kind": "ScalarField",
        "name": "reason_for_service",
        "storageKey": null
      },
      {
        "alias": null,
        "args": null,
        "kind": "ScalarField",
        "name": "service",
        "storageKey": null
      },
      {
        "alias": null,
        "args": null,
        "kind": "ScalarField",
        "name": "service_hrs_or_km",
        "storageKey": null
      },
      {
        "alias": null,
        "args": null,
        "kind": "ScalarField",
        "name": "service_date",
        "storageKey": null
      },
      {
        "alias": null,
        "args": null,
        "kind": "ScalarField",
        "name": "cost",
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
        "concreteType": "asset_maintenance_plan_parts_used_list",
        "kind": "LinkedField",
        "name": "parts_used_list",
        "plural": true,
        "selections": [
          (v2/*: any*/),
          {
            "alias": null,
            "args": null,
            "kind": "ScalarField",
            "name": "plan_list_id",
            "storageKey": null
          },
          {
            "alias": null,
            "args": null,
            "kind": "ScalarField",
            "name": "qty",
            "storageKey": null
          },
          {
            "alias": null,
            "args": null,
            "concreteType": "asset_parts",
            "kind": "LinkedField",
            "name": "part",
            "plural": false,
            "selections": [
              (v2/*: any*/),
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
                "name": "asset_type",
                "storageKey": null
              },
              {
                "alias": null,
                "args": null,
                "kind": "ScalarField",
                "name": "name",
                "storageKey": null
              }
            ],
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
    "argumentDefinitions": [
      (v0/*: any*/),
      (v1/*: any*/)
    ],
    "kind": "Fragment",
    "metadata": null,
    "name": "updateAssetMaintenancePlanListItemMutation",
    "selections": (v3/*: any*/),
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
    "name": "updateAssetMaintenancePlanListItemMutation",
    "selections": (v3/*: any*/)
  },
  "params": {
    "cacheID": "35088ed61db5eb8626e178cb89980818",
    "id": null,
    "metadata": {},
    "name": "updateAssetMaintenancePlanListItemMutation",
    "operationKind": "mutation",
    "text": "mutation updateAssetMaintenancePlanListItemMutation(\n  $id: asset_maintenance_plan_list_pk_columns_input!\n  $_set: asset_maintenance_plan_list_set_input!\n) {\n  update_asset_maintenance_plan_list_by_pk(pk_columns: $id, _set: $_set) {\n    id\n    maintenance_plan_id\n    reason_for_service\n    service\n    service_hrs_or_km\n    service_date\n    cost\n    receipt\n    parts_used_list {\n      id\n      plan_list_id\n      qty\n      part {\n        id\n        asset_id\n        asset_type\n        name\n      }\n    }\n  }\n}\n"
  }
};
})();

node.hash = "18a7c064967786638abb33745ce1f4e9";

module.exports = node;
