/**
 * @generated SignedSource<<abdff3b7c8c8ea1cbe13b5aa3b0c9fc7>>
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
    "concreteType": "asset_details",
    "kind": "LinkedField",
    "name": "update_asset_details_by_pk",
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
    "argumentDefinitions": [
      (v0/*: any*/),
      (v1/*: any*/)
    ],
    "kind": "Fragment",
    "metadata": null,
    "name": "updateAssetDetailsMutation",
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
    "name": "updateAssetDetailsMutation",
    "selections": (v2/*: any*/)
  },
  "params": {
    "cacheID": "b4e5dbe0b3e8c1b68ffaca5669efc886",
    "id": null,
    "metadata": {},
    "name": "updateAssetDetailsMutation",
    "operationKind": "mutation",
    "text": "mutation updateAssetDetailsMutation(\n  $id: asset_details_pk_columns_input!\n  $_set: asset_details_set_input!\n) {\n  update_asset_details_by_pk(pk_columns: $id, _set: $_set) {\n    id\n  }\n}\n"
  }
};
})();

node.hash = "7c70e6329edae8f1d491798595b0b81e";

module.exports = node;
