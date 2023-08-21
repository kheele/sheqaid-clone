/**
 * @generated SignedSource<<97ef5c7ca54a93cb77ce8ed42922c492>>
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
    "concreteType": "asset_photos",
    "kind": "LinkedField",
    "name": "update_asset_photos_by_pk",
    "plural": false,
    "selections": [
      (v2/*: any*/),
      {
        "alias": null,
        "args": null,
        "kind": "ScalarField",
        "name": "doc",
        "storageKey": null
      },
      {
        "alias": null,
        "args": null,
        "kind": "ScalarField",
        "name": "is_default",
        "storageKey": null
      },
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
        "concreteType": "assets",
        "kind": "LinkedField",
        "name": "asset",
        "plural": false,
        "selections": [
          (v2/*: any*/)
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
    "name": "updateAssetPhotoMutation",
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
    "name": "updateAssetPhotoMutation",
    "selections": (v3/*: any*/)
  },
  "params": {
    "cacheID": "664ed8027eb2f056b49f65dfe664a61a",
    "id": null,
    "metadata": {},
    "name": "updateAssetPhotoMutation",
    "operationKind": "mutation",
    "text": "mutation updateAssetPhotoMutation(\n  $id: asset_photos_pk_columns_input!\n  $_set: asset_photos_set_input!\n) {\n  update_asset_photos_by_pk(pk_columns: $id, _set: $_set) {\n    id\n    doc\n    is_default\n    asset_id\n    asset {\n      id\n    }\n  }\n}\n"
  }
};
})();

node.hash = "dc7abcac191fd78f2336bbc13d624915";

module.exports = node;
