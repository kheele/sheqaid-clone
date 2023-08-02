/**
 * @generated SignedSource<<869720c0321663f0d6ec158d02d3dc3a>>
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
    "concreteType": "default_job_positions",
    "kind": "LinkedField",
    "name": "insert_default_job_positions_one",
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
    "name": "insertJobPositionMutation",
    "selections": (v1/*: any*/),
    "type": "mutation_root",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "insertJobPositionMutation",
    "selections": (v1/*: any*/)
  },
  "params": {
    "cacheID": "2ad9c8eb9f9edc2b420d464ba2168bd2",
    "id": null,
    "metadata": {},
    "name": "insertJobPositionMutation",
    "operationKind": "mutation",
    "text": "mutation insertJobPositionMutation(\n  $object: default_job_positions_insert_input!\n) {\n  insert_default_job_positions_one(object: $object) {\n    id\n  }\n}\n"
  }
};
})();

node.hash = "c6848131599b674f3715fa21c3f14f80";

module.exports = node;
