/**
 * @generated SignedSource<<b1c9b7198e9d8ffdc131e6f6f0c634fb>>
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
    "concreteType": "proxy_job_position__ppe",
    "kind": "LinkedField",
    "name": "update_proxy_job_position__ppe_by_pk",
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
    "name": "updateProxyJobPositionPPEMutation",
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
    "name": "updateProxyJobPositionPPEMutation",
    "selections": (v2/*: any*/)
  },
  "params": {
    "cacheID": "aca1b5f46c34356b9b07cceeda0d32f3",
    "id": null,
    "metadata": {},
    "name": "updateProxyJobPositionPPEMutation",
    "operationKind": "mutation",
    "text": "mutation updateProxyJobPositionPPEMutation(\n  $id: proxy_job_position__ppe_pk_columns_input!\n  $_set: proxy_job_position__ppe_set_input!\n) {\n  update_proxy_job_position__ppe_by_pk(pk_columns: $id, _set: $_set) {\n    id\n  }\n}\n"
  }
};
})();

node.hash = "2e92efca9912ec896aabaecb725b29ae";

module.exports = node;
