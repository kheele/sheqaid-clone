/**
 * @generated SignedSource<<62d9165fa5da5f5f0aeab2b3208530e4>>
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
    "name": "object"
  }
],
v1 = [
  {
    "alias": null,
    "args": [
      {
        "kind": "Variable",
        "name": "object",
        "variableName": "object"
      }
    ],
    "concreteType": "proxy_employee__audit_representative",
    "kind": "LinkedField",
    "name": "insert_proxy_employee__audit_representative_one",
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
    "name": "insertProxyEmployeeAuditRepresentativeMutation",
    "selections": (v1/*: any*/),
    "type": "mutation_root",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "insertProxyEmployeeAuditRepresentativeMutation",
    "selections": (v1/*: any*/)
  },
  "params": {
    "cacheID": "58d43c6a9ea73e40c440dd3177cf64ea",
    "id": null,
    "metadata": {},
    "name": "insertProxyEmployeeAuditRepresentativeMutation",
    "operationKind": "mutation",
    "text": "mutation insertProxyEmployeeAuditRepresentativeMutation(\n  $object: proxy_employee__audit_representative_insert_input!\n) {\n  insert_proxy_employee__audit_representative_one(object: $object) {\n    id\n  }\n}\n"
  }
};
})();

node.hash = "873901584d6d60229f6383f8ba97c56f";

module.exports = node;
