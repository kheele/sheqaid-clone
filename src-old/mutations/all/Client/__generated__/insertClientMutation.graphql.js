/**
 * @generated SignedSource<<164498d5bd5f39a5cf0ab7dbcced6470>>
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
    "concreteType": "default_clients",
    "kind": "LinkedField",
    "name": "insert_default_clients_one",
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
    "name": "insertClientMutation",
    "selections": (v1/*: any*/),
    "type": "mutation_root",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "insertClientMutation",
    "selections": (v1/*: any*/)
  },
  "params": {
    "cacheID": "70814a8d47ef53b3d932446b0c1a1744",
    "id": null,
    "metadata": {},
    "name": "insertClientMutation",
    "operationKind": "mutation",
    "text": "mutation insertClientMutation(\n  $object: default_clients_insert_input!\n) {\n  insert_default_clients_one(object: $object) {\n    id\n  }\n}\n"
  }
};
})();

node.hash = "1734f459c2fbe163dc4cb4687ff530c7";

module.exports = node;
