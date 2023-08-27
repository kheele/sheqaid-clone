/**
 * @generated SignedSource<<97089fb21720020e6b2de0e40dbee43c>>
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
    "concreteType": "asset_maintenance_plan",
    "kind": "LinkedField",
    "name": "insert_asset_maintenance_plan_one",
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
        "name": "next_service_hrs_or_km",
        "storageKey": null
      },
      {
        "alias": null,
        "args": null,
        "concreteType": "asset_maintenance_plan_list",
        "kind": "LinkedField",
        "name": "plan_list",
        "plural": true,
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
                "name": "part_id",
                "storageKey": null
              },
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
    "name": "insertAssetMaintenancePlanMutation",
    "selections": (v2/*: any*/),
    "type": "mutation_root",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "insertAssetMaintenancePlanMutation",
    "selections": (v2/*: any*/)
  },
  "params": {
    "cacheID": "2e455dc29bc53c68281566b0f66070ef",
    "id": null,
    "metadata": {},
    "name": "insertAssetMaintenancePlanMutation",
    "operationKind": "mutation",
    "text": "mutation insertAssetMaintenancePlanMutation(\n  $object: asset_maintenance_plan_insert_input!\n) {\n  insert_asset_maintenance_plan_one(object: $object) {\n    id\n    asset_id\n    next_service_hrs_or_km\n    plan_list {\n      id\n      maintenance_plan_id\n      reason_for_service\n      service\n      service_hrs_or_km\n      service_date\n      cost\n      receipt\n      parts_used_list {\n        id\n        part_id\n        plan_list_id\n        qty\n      }\n    }\n  }\n}\n"
  }
};
})();

node.hash = "6cad8fd26b197cd1a5cf4a9fe7aa7dcc";

module.exports = node;
