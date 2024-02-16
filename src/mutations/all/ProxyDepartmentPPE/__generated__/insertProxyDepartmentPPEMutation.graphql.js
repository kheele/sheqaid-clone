/**
 * @generated SignedSource<<5972ce5b3a52d0b5f36fd3e0007c4b83>>
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
    "concreteType": "proxy_department__ppe_type",
    "kind": "LinkedField",
    "name": "insert_proxy_department__ppe_type_one",
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
    "cacheID": "2b96823387b218fedf32583b2910dcc9",
    "id": null,
    "metadata": {},
    "name": "insertProxyDepartmentPPEMutation",
    "operationKind": "mutation",
    "text": "mutation insertProxyDepartmentPPEMutation(\n  $object: proxy_department__ppe_type_insert_input!\n) {\n  insert_proxy_department__ppe_type_one(object: $object) {\n    id\n  }\n}\n"
  }
};
})();

node.hash = "d33c6b39351f8e29d872b5e6d4c1d8fc";

module.exports = node;
