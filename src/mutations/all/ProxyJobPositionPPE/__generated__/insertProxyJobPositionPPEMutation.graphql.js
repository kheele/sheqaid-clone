/**
 * @generated SignedSource<<6283751ee7eecfa41301750e5b8c9153>>
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
    "concreteType": "proxy_job_position__ppe_type",
    "kind": "LinkedField",
    "name": "insert_proxy_job_position__ppe_type_one",
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
    "cacheID": "f6e42d48e128948180264a63c1ebc587",
    "id": null,
    "metadata": {},
    "name": "insertProxyJobPositionPPEMutation",
    "operationKind": "mutation",
    "text": "mutation insertProxyJobPositionPPEMutation(\n  $object: proxy_job_position__ppe_type_insert_input!\n) {\n  insert_proxy_job_position__ppe_type_one(object: $object) {\n    id\n  }\n}\n"
  }
};
})();

node.hash = "b0c55c9bb1b72fee1f94e273abf17f0e";

module.exports = node;
