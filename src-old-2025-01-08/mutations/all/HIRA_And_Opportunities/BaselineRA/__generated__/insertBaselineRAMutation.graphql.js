/**
 * @generated SignedSource<<51e5b76f67a841bd1d4684722344ffa1>>
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
    "concreteType": "hira_baseline_ra",
    "kind": "LinkedField",
    "name": "insert_hira_baseline_ra_one",
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
    "name": "insertBaselineRAMutation",
    "selections": (v1/*: any*/),
    "type": "mutation_root",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "insertBaselineRAMutation",
    "selections": (v1/*: any*/)
  },
  "params": {
    "cacheID": "327f5e5c30b0c9fb4109c667575b2a3e",
    "id": null,
    "metadata": {},
    "name": "insertBaselineRAMutation",
    "operationKind": "mutation",
    "text": "mutation insertBaselineRAMutation(\n  $object: hira_baseline_ra_insert_input!\n) {\n  insert_hira_baseline_ra_one(object: $object) {\n    id\n  }\n}\n"
  }
};
})();

node.hash = "33f829c6e75869b193ae0e6518ba6251";

module.exports = node;
