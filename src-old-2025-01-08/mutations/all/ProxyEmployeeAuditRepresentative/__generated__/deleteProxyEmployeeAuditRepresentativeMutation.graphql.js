/**
 * @generated SignedSource<<a05f97da999766eb967b10946d39adbf>>
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
    "concreteType": "proxy_employee__audit_representative",
    "kind": "LinkedField",
    "name": "delete_proxy_employee__audit_representative_by_pk",
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
    "name": "deleteProxyEmployeeAuditRepresentativeMutation",
    "selections": (v1/*: any*/),
    "type": "mutation_root",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "deleteProxyEmployeeAuditRepresentativeMutation",
    "selections": (v1/*: any*/)
  },
  "params": {
    "cacheID": "b30c44306afbe8e3c4eadfb545839dd8",
    "id": null,
    "metadata": {},
    "name": "deleteProxyEmployeeAuditRepresentativeMutation",
    "operationKind": "mutation",
    "text": "mutation deleteProxyEmployeeAuditRepresentativeMutation(\n  $id: bigint!\n) {\n  delete_proxy_employee__audit_representative_by_pk(id: $id) {\n    id\n  }\n}\n"
  }
};
})();

node.hash = "a24a01aa488a81c27ffd373443eb657d";

module.exports = node;
