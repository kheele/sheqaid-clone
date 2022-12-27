/**
 * @generated SignedSource<<689f195c22299f7b7e1217f90dc97630>>
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
    "concreteType": "default_manager_module",
    "kind": "LinkedField",
    "name": "insert_default_manager_module_one",
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
    "name": "insertModuleMutation",
    "selections": (v1/*: any*/),
    "type": "mutation_root",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "insertModuleMutation",
    "selections": (v1/*: any*/)
  },
  "params": {
    "cacheID": "24ece320097c65c383f0d7f8ca73ca30",
    "id": null,
    "metadata": {},
    "name": "insertModuleMutation",
    "operationKind": "mutation",
    "text": "mutation insertModuleMutation(\n  $object: default_manager_module_insert_input!\n) {\n  insert_default_manager_module_one(object: $object) {\n    id\n  }\n}\n"
  }
};
})();

node.hash = "6891ab0b69e25608d2bd09c9c312db30";

module.exports = node;
