/**
 * @generated SignedSource<<12f5f1fd2928f7b4c915a359906b40f9>>
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
    "concreteType": "assets",
    "kind": "LinkedField",
    "name": "insert_assets_one",
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
    "name": "insertAssetMutation",
    "selections": (v1/*: any*/),
    "type": "mutation_root",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "insertAssetMutation",
    "selections": (v1/*: any*/)
  },
  "params": {
    "cacheID": "b023d952ad3fd4a5e8a3ac7f932e7fa0",
    "id": null,
    "metadata": {},
    "name": "insertAssetMutation",
    "operationKind": "mutation",
    "text": "mutation insertAssetMutation(\n  $object: assets_insert_input!\n) {\n  insert_assets_one(object: $object) {\n    id\n  }\n}\n"
  }
};
})();

node.hash = "819304864d844edf02c759dfdbef1006";

module.exports = node;
