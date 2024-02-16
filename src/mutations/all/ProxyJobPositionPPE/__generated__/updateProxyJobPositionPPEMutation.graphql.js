/**
 * @generated SignedSource<<e1f29860c577c9c1c2276c07634ce6ce>>
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
    "concreteType": "proxy_job_position__ppe_type",
    "kind": "LinkedField",
    "name": "update_proxy_job_position__ppe_type_by_pk",
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
    "cacheID": "d45ee6e380f6475c8f66df29eacbbb16",
    "id": null,
    "metadata": {},
    "name": "updateProxyJobPositionPPEMutation",
    "operationKind": "mutation",
    "text": "mutation updateProxyJobPositionPPEMutation(\n  $id: proxy_job_position__ppe_type_pk_columns_input!\n  $_set: proxy_job_position__ppe_type_set_input!\n) {\n  update_proxy_job_position__ppe_type_by_pk(pk_columns: $id, _set: $_set) {\n    id\n  }\n}\n"
  }
};
})();

node.hash = "6edc6cf659b1cba6c6e5ee8037740543";

module.exports = node;
