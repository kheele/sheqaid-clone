/**
 * @generated SignedSource<<bda3dd4e33e4069d2b63d60d17a06615>>
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
    "concreteType": "default_sites",
    "kind": "LinkedField",
    "name": "insert_default_sites_one",
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
    "name": "insertContractorSiteMutation",
    "selections": (v1/*: any*/),
    "type": "mutation_root",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "insertContractorSiteMutation",
    "selections": (v1/*: any*/)
  },
  "params": {
    "cacheID": "ac05943d5145704d17e1f8e48ad74f59",
    "id": null,
    "metadata": {},
    "name": "insertContractorSiteMutation",
    "operationKind": "mutation",
    "text": "mutation insertContractorSiteMutation(\n  $object: default_sites_insert_input!\n) {\n  insert_default_sites_one(object: $object) {\n    id\n  }\n}\n"
  }
};
})();

node.hash = "a859fc7c6e4d9f55b4e6c251e53ff998";

module.exports = node;
