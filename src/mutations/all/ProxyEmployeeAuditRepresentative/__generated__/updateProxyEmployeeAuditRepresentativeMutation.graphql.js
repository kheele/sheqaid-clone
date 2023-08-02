/**
 * @generated SignedSource<<ca0a8a0154aaec5cd7d2a0614f261113>>
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
    "concreteType": "proxy_employee__audit_representative",
    "kind": "LinkedField",
    "name": "update_proxy_employee__audit_representative_by_pk",
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
    "name": "updateProxyEmployeeAuditRepresentativeMutation",
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
    "name": "updateProxyEmployeeAuditRepresentativeMutation",
    "selections": (v2/*: any*/)
  },
  "params": {
    "cacheID": "dc5c9e24e3fb8ef0e7746191a978f105",
    "id": null,
    "metadata": {},
    "name": "updateProxyEmployeeAuditRepresentativeMutation",
    "operationKind": "mutation",
    "text": "mutation updateProxyEmployeeAuditRepresentativeMutation(\n  $id: proxy_employee__audit_representative_pk_columns_input!\n  $_set: proxy_employee__audit_representative_set_input!\n) {\n  update_proxy_employee__audit_representative_by_pk(pk_columns: $id, _set: $_set) {\n    id\n  }\n}\n"
  }
};
})();

node.hash = "429d12230366df82e8090d79bde804c2";

module.exports = node;
