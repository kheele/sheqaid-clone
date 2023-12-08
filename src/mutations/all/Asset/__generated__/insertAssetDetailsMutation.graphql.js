/**
 * @generated SignedSource<<865e4257bceb98d1990903ef3edea72c>>
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
    "concreteType": "asset_details",
    "kind": "LinkedField",
    "name": "insert_asset_details_one",
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
    "name": "insertAssetDetailsMutation",
    "selections": (v1/*: any*/),
    "type": "mutation_root",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "insertAssetDetailsMutation",
    "selections": (v1/*: any*/)
  },
  "params": {
    "cacheID": "81775323a9716c6c35966f26e7638460",
    "id": null,
    "metadata": {},
    "name": "insertAssetDetailsMutation",
    "operationKind": "mutation",
    "text": "mutation insertAssetDetailsMutation(\n  $object: asset_details_insert_input!\n) {\n  insert_asset_details_one(object: $object) {\n    id\n  }\n}\n"
  }
};
})();

node.hash = "06d0503c4b10c1bd5f4d5d21bf849a02";

module.exports = node;
