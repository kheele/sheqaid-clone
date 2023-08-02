/**
 * @generated SignedSource<<1ae269f30f3f375c8473c578290d4074>>
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
    "concreteType": "proxy_employee__ppe",
    "kind": "LinkedField",
    "name": "insert_proxy_employee__ppe_one",
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
    "name": "insertProxyEmployeePPEMutation",
    "selections": (v1/*: any*/),
    "type": "mutation_root",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "insertProxyEmployeePPEMutation",
    "selections": (v1/*: any*/)
  },
  "params": {
    "cacheID": "76914c9d5e73542acdeea77286f350b1",
    "id": null,
    "metadata": {},
    "name": "insertProxyEmployeePPEMutation",
    "operationKind": "mutation",
    "text": "mutation insertProxyEmployeePPEMutation(\n  $object: proxy_employee__ppe_insert_input!\n) {\n  insert_proxy_employee__ppe_one(object: $object) {\n    id\n  }\n}\n"
  }
};
})();

node.hash = "46f77f6e71187c9924675b267e873446";

module.exports = node;
