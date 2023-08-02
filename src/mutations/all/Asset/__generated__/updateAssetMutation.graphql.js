/**
 * @generated SignedSource<<39a7b81de6fe076f9f0870a2b0456783>>
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
    "concreteType": "assets",
    "kind": "LinkedField",
    "name": "update_assets_by_pk",
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
    "name": "updateAssetMutation",
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
    "name": "updateAssetMutation",
    "selections": (v2/*: any*/)
  },
  "params": {
    "cacheID": "3d41ca33697a21207ff16361cd243ed6",
    "id": null,
    "metadata": {},
    "name": "updateAssetMutation",
    "operationKind": "mutation",
    "text": "mutation updateAssetMutation(\n  $id: assets_pk_columns_input!\n  $_set: assets_set_input!\n) {\n  update_assets_by_pk(pk_columns: $id, _set: $_set) {\n    id\n  }\n}\n"
  }
};
})();

node.hash = "3307892ab32431b52812a08e84f72011";

module.exports = node;
