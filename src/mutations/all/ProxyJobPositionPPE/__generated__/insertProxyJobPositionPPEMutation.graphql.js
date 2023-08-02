/**
 * @generated SignedSource<<d5ccf131e620ece793c36f63caf19e5e>>
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
    "concreteType": "proxy_job_position__ppe",
    "kind": "LinkedField",
    "name": "insert_proxy_job_position__ppe_one",
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
    "name": "insertProxyJobPositionPPEMutation",
    "selections": (v1/*: any*/),
    "type": "mutation_root",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "insertProxyJobPositionPPEMutation",
    "selections": (v1/*: any*/)
  },
  "params": {
    "cacheID": "87fb4ecb93940018949eabfc4c9943bc",
    "id": null,
    "metadata": {},
    "name": "insertProxyJobPositionPPEMutation",
    "operationKind": "mutation",
    "text": "mutation insertProxyJobPositionPPEMutation(\n  $object: proxy_job_position__ppe_insert_input!\n) {\n  insert_proxy_job_position__ppe_one(object: $object) {\n    id\n  }\n}\n"
  }
};
})();

node.hash = "2163e66d75cb0440eca3cd2462901371";

module.exports = node;
