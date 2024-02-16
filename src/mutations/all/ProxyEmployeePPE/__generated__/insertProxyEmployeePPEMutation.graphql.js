/**
 * @generated SignedSource<<1de737abc4011ef606e1026058af4009>>
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
    "concreteType": "proxy_employee__ppe_type",
    "kind": "LinkedField",
    "name": "insert_proxy_employee__ppe_type_one",
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
    "cacheID": "48d6d64fb0228d09fc60a088abf70d8e",
    "id": null,
    "metadata": {},
    "name": "insertProxyEmployeePPEMutation",
    "operationKind": "mutation",
    "text": "mutation insertProxyEmployeePPEMutation(\n  $object: proxy_employee__ppe_type_insert_input!\n) {\n  insert_proxy_employee__ppe_type_one(object: $object) {\n    id\n  }\n}\n"
  }
};
})();

node.hash = "dcfe7f24b298e35093fce8a1ec7cba4a";

module.exports = node;
