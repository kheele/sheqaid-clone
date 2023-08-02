/**
 * @generated SignedSource<<a4c436c8f750d4bcc49d788201f1df4f>>
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
    "concreteType": "proxy_department__ppe",
    "kind": "LinkedField",
    "name": "insert_proxy_department__ppe_one",
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
    "name": "insertProxyDepartmentPPEMutation",
    "selections": (v1/*: any*/),
    "type": "mutation_root",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "insertProxyDepartmentPPEMutation",
    "selections": (v1/*: any*/)
  },
  "params": {
    "cacheID": "3b03e27163ffb7decc83ee258ff738fa",
    "id": null,
    "metadata": {},
    "name": "insertProxyDepartmentPPEMutation",
    "operationKind": "mutation",
    "text": "mutation insertProxyDepartmentPPEMutation(\n  $object: proxy_department__ppe_insert_input!\n) {\n  insert_proxy_department__ppe_one(object: $object) {\n    id\n  }\n}\n"
  }
};
})();

node.hash = "01886e458efd0633c7af8a1c9b6c5b82";

module.exports = node;
