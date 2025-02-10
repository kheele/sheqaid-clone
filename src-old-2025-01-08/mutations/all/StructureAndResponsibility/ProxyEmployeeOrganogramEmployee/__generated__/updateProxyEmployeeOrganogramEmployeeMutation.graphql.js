/**
 * @generated SignedSource<<169a841dad9cbc460f46224f662d59c8>>
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
    "concreteType": "proxy_employee__organogram__employees",
    "kind": "LinkedField",
    "name": "update_proxy_employee__organogram__employees_by_pk",
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
    "name": "updateProxyEmployeeOrganogramEmployeeMutation",
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
    "name": "updateProxyEmployeeOrganogramEmployeeMutation",
    "selections": (v2/*: any*/)
  },
  "params": {
    "cacheID": "c8b9e0e72e13e2108c0cfd2c2342c391",
    "id": null,
    "metadata": {},
    "name": "updateProxyEmployeeOrganogramEmployeeMutation",
    "operationKind": "mutation",
    "text": "mutation updateProxyEmployeeOrganogramEmployeeMutation(\n  $id: proxy_employee__organogram__employees_pk_columns_input!\n  $_set: proxy_employee__organogram__employees_set_input!\n) {\n  update_proxy_employee__organogram__employees_by_pk(pk_columns: $id, _set: $_set) {\n    id\n  }\n}\n"
  }
};
})();

node.hash = "dfa8c4fbe46d33d62b2c73902552ef44";

module.exports = node;
