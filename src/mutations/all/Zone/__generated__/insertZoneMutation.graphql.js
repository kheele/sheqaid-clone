/**
 * @generated SignedSource<<0784b587fcb934cdc72046e809ecfc6a>>
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
    "concreteType": "default_zones",
    "kind": "LinkedField",
    "name": "insert_default_zones_one",
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
    "name": "insertZoneMutation",
    "selections": (v1/*: any*/),
    "type": "mutation_root",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "insertZoneMutation",
    "selections": (v1/*: any*/)
  },
  "params": {
    "cacheID": "5422d58b03f585ab49c600542a518ab9",
    "id": null,
    "metadata": {},
    "name": "insertZoneMutation",
    "operationKind": "mutation",
    "text": "mutation insertZoneMutation(\n  $object: default_zones_insert_input!\n) {\n  insert_default_zones_one(object: $object) {\n    id\n  }\n}\n"
  }
};
})();

node.hash = "94af3c2be66dd55a46633f0430c5e4c7";

module.exports = node;
