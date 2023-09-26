/**
 * @generated SignedSource<<c611e30bd4df2e9cc414ab033e7ea267>>
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
    "concreteType": "proxy_asset__asset",
    "kind": "LinkedField",
    "name": "insert_proxy_asset__asset_one",
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
    "name": "insertProxyAssetAssetMutation",
    "selections": (v1/*: any*/),
    "type": "mutation_root",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "insertProxyAssetAssetMutation",
    "selections": (v1/*: any*/)
  },
  "params": {
    "cacheID": "4e367c845e808823adbb43591abcf2c0",
    "id": null,
    "metadata": {},
    "name": "insertProxyAssetAssetMutation",
    "operationKind": "mutation",
    "text": "mutation insertProxyAssetAssetMutation(\n  $object: proxy_asset__asset_insert_input!\n) {\n  insert_proxy_asset__asset_one(object: $object) {\n    id\n  }\n}\n"
  }
};
})();

node.hash = "c32c7edc3a520334f1bc929cbbea6af9";

module.exports = node;
