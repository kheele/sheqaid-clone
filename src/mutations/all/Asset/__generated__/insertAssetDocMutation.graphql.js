/**
 * @generated SignedSource<<ce17f5cb0e038b1b13257b65e5966c73>>
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
    "concreteType": "asset_docs",
    "kind": "LinkedField",
    "name": "insert_asset_docs_one",
    "plural": false,
    "selections": [
      (v1/*: any*/),
      {
        "alias": null,
        "args": null,
        "kind": "ScalarField",
        "name": "created_at",
        "storageKey": null
      },
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
        "name": "expiry",
        "storageKey": null
      },
      {
        "alias": null,
        "args": null,
        "kind": "ScalarField",
        "name": "title",
        "storageKey": null
      },
      {
        "alias": null,
        "args": null,
        "kind": "ScalarField",
        "name": "desc",
        "storageKey": null
      },
      {
        "alias": null,
        "args": null,
        "kind": "ScalarField",
        "name": "type",
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
    "name": "insertAssetDocMutation",
    "selections": (v2/*: any*/),
    "type": "mutation_root",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "insertAssetDocMutation",
    "selections": (v2/*: any*/)
  },
  "params": {
    "cacheID": "369cda54c072017ef087a66e9161fe6e",
    "id": null,
    "metadata": {},
    "name": "insertAssetDocMutation",
    "operationKind": "mutation",
    "text": "mutation insertAssetDocMutation(\n  $object: asset_docs_insert_input!\n) {\n  insert_asset_docs_one(object: $object) {\n    id\n    created_at\n    doc\n    expiry\n    title\n    desc\n    type\n    asset_id\n    asset {\n      id\n    }\n  }\n}\n"
  }
};
})();

node.hash = "e97a6292ca3ab347b84c03fedba53ae4";

module.exports = node;
