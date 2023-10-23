/**
 * @generated SignedSource<<f66b088be7c7045154cfe29ac095265a>>
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
    "concreteType": "proxy_coida_claims__wcl_5",
    "kind": "LinkedField",
    "name": "update_proxy_coida_claims__wcl_5_by_pk",
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
    "name": "updateWCL5ProxyMutation",
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
    "name": "updateWCL5ProxyMutation",
    "selections": (v2/*: any*/)
  },
  "params": {
    "cacheID": "536a3008755a927df4502260c38d1f8a",
    "id": null,
    "metadata": {},
    "name": "updateWCL5ProxyMutation",
    "operationKind": "mutation",
    "text": "mutation updateWCL5ProxyMutation(\n  $id: proxy_coida_claims__wcl_5_pk_columns_input!\n  $_set: proxy_coida_claims__wcl_5_set_input!\n) {\n  update_proxy_coida_claims__wcl_5_by_pk(pk_columns: $id, _set: $_set) {\n    id\n  }\n}\n"
  }
};
})();

node.hash = "adf081ad56946d8606877fc8581a9c06";

module.exports = node;
