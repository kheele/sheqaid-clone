/**
 * @generated SignedSource<<5bcef94e1a82a976e33e8405a3cb44e6>>
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
    "concreteType": "asset_photos",
    "kind": "LinkedField",
    "name": "insert_asset_photos_one",
    "plural": false,
    "selections": [
      (v1/*: any*/),
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
          (v1/*: any*/)
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
    "name": "insertAssetPhotoMutation",
    "selections": (v2/*: any*/),
    "type": "mutation_root",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "insertAssetPhotoMutation",
    "selections": (v2/*: any*/)
  },
  "params": {
    "cacheID": "dcced69ada7ae179807670d4a254bd24",
    "id": null,
    "metadata": {},
    "name": "insertAssetPhotoMutation",
    "operationKind": "mutation",
    "text": "mutation insertAssetPhotoMutation(\n  $object: asset_photos_insert_input!\n) {\n  insert_asset_photos_one(object: $object) {\n    id\n    doc\n    is_default\n    asset_id\n    asset {\n      id\n    }\n  }\n}\n"
  }
};
})();

node.hash = "3ca50a2e28be2786dd5dca6daf5002bd";

module.exports = node;
