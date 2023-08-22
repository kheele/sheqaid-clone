/**
 * @generated SignedSource<<9a529e179bed962a74d35de8f9b4cc61>>
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
    "concreteType": "asset_maintenance_plan_list",
    "kind": "LinkedField",
    "name": "insert_asset_maintenance_plan_list_one",
    "plural": false,
    "selections": [
      (v1/*: any*/),
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
          (v1/*: any*/),
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
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Fragment",
    "metadata": null,
    "name": "insertAssetMaintenancePlanListItemMutation",
    "selections": (v2/*: any*/),
    "type": "mutation_root",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "insertAssetMaintenancePlanListItemMutation",
    "selections": (v2/*: any*/)
  },
  "params": {
    "cacheID": "0eb2177d3d29be81d724c06c03508f4f",
    "id": null,
    "metadata": {},
    "name": "insertAssetMaintenancePlanListItemMutation",
    "operationKind": "mutation",
    "text": "mutation insertAssetMaintenancePlanListItemMutation(\n  $object: asset_maintenance_plan_list_insert_input!\n) {\n  insert_asset_maintenance_plan_list_one(object: $object) {\n    id\n    maintenance_plan_id\n    reason_for_service\n    service\n    service_hrs_or_km\n    service_date\n    cost\n    receipt\n    parts_used_list {\n      id\n      plan_list_id\n      qty\n      part {\n        id\n        asset_id\n        asset_type\n        name\n      }\n    }\n  }\n}\n"
  }
};
})();

node.hash = "cb086e677cf3065778d3ab376b599d88";

module.exports = node;
