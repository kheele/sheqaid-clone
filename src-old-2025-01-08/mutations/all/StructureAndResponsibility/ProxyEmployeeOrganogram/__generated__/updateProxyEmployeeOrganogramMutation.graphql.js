/**
 * @generated SignedSource<<ba19472540acc29e02c34d4b9d9f1344>>
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
    "concreteType": "proxy_employee__organogram",
    "kind": "LinkedField",
    "name": "update_proxy_employee__organogram_by_pk",
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
    "name": "updateProxyEmployeeOrganogramMutation",
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
    "name": "updateProxyEmployeeOrganogramMutation",
    "selections": (v2/*: any*/)
  },
  "params": {
    "cacheID": "021061f69e75ebfa412ff6c87d8b52f6",
    "id": null,
    "metadata": {},
    "name": "updateProxyEmployeeOrganogramMutation",
    "operationKind": "mutation",
    "text": "mutation updateProxyEmployeeOrganogramMutation(\n  $id: proxy_employee__organogram_pk_columns_input!\n  $_set: proxy_employee__organogram_set_input!\n) {\n  update_proxy_employee__organogram_by_pk(pk_columns: $id, _set: $_set) {\n    id\n  }\n}\n"
  }
};
})();

node.hash = "3a5dbf97aab21a60877f76ec2d2b7dbe";

module.exports = node;
