/**
 * @generated SignedSource<<29d38ebb5b62ecd5c8c170c16886771a>>
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
    "concreteType": "hira_taskbased_ra",
    "kind": "LinkedField",
    "name": "insert_hira_taskbased_ra_one",
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
    "name": "insertTaskbasedRAMutation",
    "selections": (v1/*: any*/),
    "type": "mutation_root",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "insertTaskbasedRAMutation",
    "selections": (v1/*: any*/)
  },
  "params": {
    "cacheID": "9ed4ba21696311fc523f480ead34c92f",
    "id": null,
    "metadata": {},
    "name": "insertTaskbasedRAMutation",
    "operationKind": "mutation",
    "text": "mutation insertTaskbasedRAMutation(\n  $object: hira_taskbased_ra_insert_input!\n) {\n  insert_hira_taskbased_ra_one(object: $object) {\n    id\n  }\n}\n"
  }
};
})();

node.hash = "b5ae36b8a0a0adcd7b94e2be95f30de3";

module.exports = node;
