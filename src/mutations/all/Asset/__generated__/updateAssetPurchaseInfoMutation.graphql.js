/**
 * @generated SignedSource<<f0cc07300cf5b87377e983abb867d094>>
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
    "concreteType": "asset_purchase_info",
    "kind": "LinkedField",
    "name": "update_asset_purchase_info_by_pk",
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
        "name": "acquisition_date",
        "storageKey": null
      },
      {
        "alias": null,
        "args": null,
        "kind": "ScalarField",
        "name": "vendor",
        "storageKey": null
      },
      {
        "alias": null,
        "args": null,
        "kind": "ScalarField",
        "name": "acquisition_value",
        "storageKey": null
      },
      {
        "alias": null,
        "args": null,
        "kind": "ScalarField",
        "name": "warranty_expiry",
        "storageKey": null
      },
      {
        "alias": null,
        "args": null,
        "kind": "ScalarField",
        "name": "reference_num",
        "storageKey": null
      },
      {
        "alias": null,
        "args": null,
        "kind": "ScalarField",
        "name": "warranty_certificate",
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
    "name": "updateAssetPurchaseInfoMutation",
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
    "name": "updateAssetPurchaseInfoMutation",
    "selections": (v2/*: any*/)
  },
  "params": {
    "cacheID": "e66eba30546e8a1d56d07977cc8b7aae",
    "id": null,
    "metadata": {},
    "name": "updateAssetPurchaseInfoMutation",
    "operationKind": "mutation",
    "text": "mutation updateAssetPurchaseInfoMutation(\n  $id: asset_purchase_info_pk_columns_input!\n  $_set: asset_purchase_info_set_input!\n) {\n  update_asset_purchase_info_by_pk(pk_columns: $id, _set: $_set) {\n    id\n    acquisition_date\n    vendor\n    acquisition_value\n    warranty_expiry\n    reference_num\n    warranty_certificate\n  }\n}\n"
  }
};
})();

node.hash = "5ee9444a424c99bce5de75fd0ce47b18";

module.exports = node;
