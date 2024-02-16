/**
 * @generated SignedSource<<5b1092e3b5d02cb9b95d71b499c4cc7d>>
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
    "concreteType": "proxy_department__ppe_type",
    "kind": "LinkedField",
    "name": "update_proxy_department__ppe_type_by_pk",
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
    "name": "updateProxyDepartmentPPEMutation",
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
    "name": "updateProxyDepartmentPPEMutation",
    "selections": (v2/*: any*/)
  },
  "params": {
    "cacheID": "4d3882b1e52d95305c75449627925e76",
    "id": null,
    "metadata": {},
    "name": "updateProxyDepartmentPPEMutation",
    "operationKind": "mutation",
    "text": "mutation updateProxyDepartmentPPEMutation(\n  $id: proxy_department__ppe_type_pk_columns_input!\n  $_set: proxy_department__ppe_type_set_input!\n) {\n  update_proxy_department__ppe_type_by_pk(pk_columns: $id, _set: $_set) {\n    id\n  }\n}\n"
  }
};
})();

node.hash = "a704c7749fb7f11a3e2ed587f6e0ce0a";

module.exports = node;
