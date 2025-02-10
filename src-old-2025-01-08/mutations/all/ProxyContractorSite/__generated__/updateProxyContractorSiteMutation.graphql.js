/**
 * @generated SignedSource<<7b1d0b3ad166e52ce0f2e29c9e35e243>>
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
    "concreteType": "proxy_contractors__sites",
    "kind": "LinkedField",
    "name": "update_proxy_contractors__sites_by_pk",
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
    "name": "updateProxyContractorSiteMutation",
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
    "name": "updateProxyContractorSiteMutation",
    "selections": (v2/*: any*/)
  },
  "params": {
    "cacheID": "67197b3e91f392cbb46508484e3d6d98",
    "id": null,
    "metadata": {},
    "name": "updateProxyContractorSiteMutation",
    "operationKind": "mutation",
    "text": "mutation updateProxyContractorSiteMutation(\n  $id: proxy_contractors__sites_pk_columns_input!\n  $_set: proxy_contractors__sites_set_input!\n) {\n  update_proxy_contractors__sites_by_pk(pk_columns: $id, _set: $_set) {\n    id\n  }\n}\n"
  }
};
})();

node.hash = "aa412f9774a67f892dd86ab654127260";

module.exports = node;
