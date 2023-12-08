/**
 * @generated SignedSource<<a434ac277bf4f8cd97d00b725694a6f8>>
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
v1 = [
  {
    "alias": null,
    "args": [
      {
        "kind": "Variable",
        "name": "object",
        "variableName": "object"
      }
    ],
    "concreteType": "asset_depreciation",
    "kind": "LinkedField",
    "name": "insert_asset_depreciation_one",
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
    "name": "insertAssetDepreciationMutation",
    "selections": (v1/*: any*/),
    "type": "mutation_root",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "insertAssetDepreciationMutation",
    "selections": (v1/*: any*/)
  },
  "params": {
    "cacheID": "6769ca19fb4c9d85e9e7dc9dfd416054",
    "id": null,
    "metadata": {},
    "name": "insertAssetDepreciationMutation",
    "operationKind": "mutation",
    "text": "mutation insertAssetDepreciationMutation(\n  $object: asset_depreciation_insert_input!\n) {\n  insert_asset_depreciation_one(object: $object) {\n    id\n  }\n}\n"
  }
};
})();

node.hash = "a611bde00c3ff0924a9db67af0021f61";

module.exports = node;
