/**
 * @generated SignedSource<<89015fcf8aca22e951bf2a208884a6bd>>
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
    "concreteType": "proxy_coida_claims__wcl_5",
    "kind": "LinkedField",
    "name": "insert_proxy_coida_claims__wcl_5_one",
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
    "name": "insertWCL5ProxyMutation",
    "selections": (v1/*: any*/),
    "type": "mutation_root",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "insertWCL5ProxyMutation",
    "selections": (v1/*: any*/)
  },
  "params": {
    "cacheID": "3885982713dbf535d2e49fc92da319df",
    "id": null,
    "metadata": {},
    "name": "insertWCL5ProxyMutation",
    "operationKind": "mutation",
    "text": "mutation insertWCL5ProxyMutation(\n  $object: proxy_coida_claims__wcl_5_insert_input!\n) {\n  insert_proxy_coida_claims__wcl_5_one(object: $object) {\n    id\n  }\n}\n"
  }
};
})();

node.hash = "761c5f7c70c0f8324b8401caad1c37a4";

module.exports = node;
