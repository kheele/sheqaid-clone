/**
 * @generated SignedSource<<2bf87138f51001749eed8fa037e0ac83>>
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
    "concreteType": "asset_maintenance_plan_list",
    "kind": "LinkedField",
    "name": "delete_asset_maintenance_plan_list_by_pk",
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
    "name": "deleteAssetMaintenancePlanListItemMutation",
    "selections": (v1/*: any*/),
    "type": "mutation_root",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "deleteAssetMaintenancePlanListItemMutation",
    "selections": (v1/*: any*/)
  },
  "params": {
    "cacheID": "79bd923739f1f5cd0fcea313fba4cdde",
    "id": null,
    "metadata": {},
    "name": "deleteAssetMaintenancePlanListItemMutation",
    "operationKind": "mutation",
    "text": "mutation deleteAssetMaintenancePlanListItemMutation(\n  $id: bigint!\n) {\n  delete_asset_maintenance_plan_list_by_pk(id: $id) {\n    id\n  }\n}\n"
  }
};
})();

node.hash = "9b8711013a7940a5fd5934bd6a2573f9";

module.exports = node;
