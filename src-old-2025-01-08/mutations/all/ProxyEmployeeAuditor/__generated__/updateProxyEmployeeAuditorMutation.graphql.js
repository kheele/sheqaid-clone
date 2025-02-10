/**
 * @generated SignedSource<<1a3bf3770b5c895c46ea7a8fce73c384>>
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
    "concreteType": "proxy_employee__auditor",
    "kind": "LinkedField",
    "name": "update_proxy_employee__auditor_by_pk",
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
    "name": "updateProxyEmployeeAuditorMutation",
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
    "name": "updateProxyEmployeeAuditorMutation",
    "selections": (v2/*: any*/)
  },
  "params": {
    "cacheID": "72c1895883f12de144f179c2b9624df7",
    "id": null,
    "metadata": {},
    "name": "updateProxyEmployeeAuditorMutation",
    "operationKind": "mutation",
    "text": "mutation updateProxyEmployeeAuditorMutation(\n  $id: proxy_employee__auditor_pk_columns_input!\n  $_set: proxy_employee__auditor_set_input!\n) {\n  update_proxy_employee__auditor_by_pk(pk_columns: $id, _set: $_set) {\n    id\n  }\n}\n"
  }
};
})();

node.hash = "b882012ee3be691705612637b989cd12";

module.exports = node;
