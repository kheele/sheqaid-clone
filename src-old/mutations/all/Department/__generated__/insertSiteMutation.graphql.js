/**
 * @generated SignedSource<<20d1bb86ed9645b0d7dc413ec0bd8c5c>>
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
    "name": "insertSiteMutation",
    "selections": (v1/*: any*/),
    "type": "mutation_root",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "insertSiteMutation",
    "selections": (v1/*: any*/)
  },
  "params": {
    "cacheID": "4bddae3f51ee53d5dc2d819b05087209",
    "id": null,
    "metadata": {},
    "name": "insertSiteMutation",
    "operationKind": "mutation",
    "text": "mutation insertSiteMutation(\n  $object: default_sites_insert_input!\n) {\n  insert_default_sites_one(object: $object) {\n    id\n  }\n}\n"
  }
};
})();

node.hash = "e1be5c4e736368824973133713e932c3";

module.exports = node;
