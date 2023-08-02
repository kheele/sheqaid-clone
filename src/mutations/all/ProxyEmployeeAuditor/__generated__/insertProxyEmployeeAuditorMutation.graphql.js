/**
 * @generated SignedSource<<2d153f3b18516ee7c0bc6d5b110b6bec>>
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
    "concreteType": "proxy_employee__auditor",
    "kind": "LinkedField",
    "name": "insert_proxy_employee__auditor_one",
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
    "name": "insertProxyEmployeeAuditorMutation",
    "selections": (v1/*: any*/),
    "type": "mutation_root",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "insertProxyEmployeeAuditorMutation",
    "selections": (v1/*: any*/)
  },
  "params": {
    "cacheID": "8418c96c4dcf22836bf336bdbeb5b30e",
    "id": null,
    "metadata": {},
    "name": "insertProxyEmployeeAuditorMutation",
    "operationKind": "mutation",
    "text": "mutation insertProxyEmployeeAuditorMutation(\n  $object: proxy_employee__auditor_insert_input!\n) {\n  insert_proxy_employee__auditor_one(object: $object) {\n    id\n  }\n}\n"
  }
};
})();

node.hash = "9eaf9467cad61eae5ddedd74bfaf5ce1";

module.exports = node;
