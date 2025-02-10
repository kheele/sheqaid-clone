/**
 * @generated SignedSource<<de5ea2f283e4c7b38d46a6ac189985ef>>
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
    "concreteType": "hira_sop",
    "kind": "LinkedField",
    "name": "insert_hira_sop_one",
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
    "name": "insertSOPMutation",
    "selections": (v1/*: any*/),
    "type": "mutation_root",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "insertSOPMutation",
    "selections": (v1/*: any*/)
  },
  "params": {
    "cacheID": "a3afa7af01bc16374b89391d213f6012",
    "id": null,
    "metadata": {},
    "name": "insertSOPMutation",
    "operationKind": "mutation",
    "text": "mutation insertSOPMutation(\n  $object: hira_sop_insert_input!\n) {\n  insert_hira_sop_one(object: $object) {\n    id\n  }\n}\n"
  }
};
})();

node.hash = "5ca6f5876af1c1d78083583b509a5f8a";

module.exports = node;
