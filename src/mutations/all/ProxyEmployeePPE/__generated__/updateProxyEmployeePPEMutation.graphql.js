/**
 * @generated SignedSource<<717be72496f5f26360f948997d61a94c>>
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
    "concreteType": "proxy_employee__ppe",
    "kind": "LinkedField",
    "name": "update_proxy_employee__ppe_by_pk",
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
    "name": "updateProxyEmployeePPEMutation",
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
    "name": "updateProxyEmployeePPEMutation",
    "selections": (v2/*: any*/)
  },
  "params": {
    "cacheID": "ac490812c05ef81c6af993b27d23af3c",
    "id": null,
    "metadata": {},
    "name": "updateProxyEmployeePPEMutation",
    "operationKind": "mutation",
    "text": "mutation updateProxyEmployeePPEMutation(\n  $id: proxy_employee__ppe_pk_columns_input!\n  $_set: proxy_employee__ppe_set_input!\n) {\n  update_proxy_employee__ppe_by_pk(pk_columns: $id, _set: $_set) {\n    id\n  }\n}\n"
  }
};
})();

node.hash = "49248eb0f301a81a6d035970abf28139";

module.exports = node;
