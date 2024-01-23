/**
 * @generated SignedSource<<650bdd54dc495e8a6303b702dfdb5bca>>
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
    "name": "id"
  }
],
v1 = [
  {
    "alias": null,
    "args": [
      {
        "kind": "Variable",
        "name": "id",
        "variableName": "id"
      }
    ],
    "concreteType": "proxy_employee__auditor",
    "kind": "LinkedField",
    "name": "delete_proxy_employee__auditor_by_pk",
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
    "name": "deleteProxyEmployeeAuditorMutation",
    "selections": (v1/*: any*/),
    "type": "mutation_root",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "deleteProxyEmployeeAuditorMutation",
    "selections": (v1/*: any*/)
  },
  "params": {
    "cacheID": "c71fa7af0bcc53141de12465f6bebd64",
    "id": null,
    "metadata": {},
    "name": "deleteProxyEmployeeAuditorMutation",
    "operationKind": "mutation",
    "text": "mutation deleteProxyEmployeeAuditorMutation(\n  $id: bigint!\n) {\n  delete_proxy_employee__auditor_by_pk(id: $id) {\n    id\n  }\n}\n"
  }
};
})();

node.hash = "592e932373965d0ddc4ba5e6819bd779";

module.exports = node;
