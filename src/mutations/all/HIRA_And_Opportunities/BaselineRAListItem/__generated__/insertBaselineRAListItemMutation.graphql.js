/**
 * @generated SignedSource<<a2024f1a2bc6c9295df1cae6f0bddc2c>>
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
    "concreteType": "hira_baseline_ra_list",
    "kind": "LinkedField",
    "name": "insert_hira_baseline_ra_list_one",
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
    "name": "insertBaselineRAListItemMutation",
    "selections": (v1/*: any*/),
    "type": "mutation_root",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "insertBaselineRAListItemMutation",
    "selections": (v1/*: any*/)
  },
  "params": {
    "cacheID": "ce214c3d2120271b3c8337a810012c32",
    "id": null,
    "metadata": {},
    "name": "insertBaselineRAListItemMutation",
    "operationKind": "mutation",
    "text": "mutation insertBaselineRAListItemMutation(\n  $object: hira_baseline_ra_list_insert_input!\n) {\n  insert_hira_baseline_ra_list_one(object: $object) {\n    id\n  }\n}\n"
  }
};
})();

node.hash = "9c82c991840da675fb9c9e29b4ad4acd";

module.exports = node;
