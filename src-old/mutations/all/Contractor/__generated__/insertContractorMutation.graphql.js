/**
 * @generated SignedSource<<5a759c4f8a78db40b43a9a7f09231083>>
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
    "concreteType": "default_contractors",
    "kind": "LinkedField",
    "name": "insert_default_contractors_one",
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
    "name": "insertContractorMutation",
    "selections": (v1/*: any*/),
    "type": "mutation_root",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "insertContractorMutation",
    "selections": (v1/*: any*/)
  },
  "params": {
    "cacheID": "246c036c3ab3cd0dfadb3bc1dbd4d446",
    "id": null,
    "metadata": {},
    "name": "insertContractorMutation",
    "operationKind": "mutation",
    "text": "mutation insertContractorMutation(\n  $object: default_contractors_insert_input!\n) {\n  insert_default_contractors_one(object: $object) {\n    id\n  }\n}\n"
  }
};
})();

node.hash = "9a68fc3ff6acc80abd890f38481f1682";

module.exports = node;
