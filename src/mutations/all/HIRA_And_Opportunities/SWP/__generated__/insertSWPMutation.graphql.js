/**
 * @generated SignedSource<<c7f0a425757b3b70c07e1e1e0e02480e>>
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
    "concreteType": "hira_swp",
    "kind": "LinkedField",
    "name": "insert_hira_swp_one",
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
    "name": "insertSWPMutation",
    "selections": (v1/*: any*/),
    "type": "mutation_root",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "insertSWPMutation",
    "selections": (v1/*: any*/)
  },
  "params": {
    "cacheID": "5ae93147fd37f8a879e09b8c54d1eb87",
    "id": null,
    "metadata": {},
    "name": "insertSWPMutation",
    "operationKind": "mutation",
    "text": "mutation insertSWPMutation(\n  $object: hira_swp_insert_input!\n) {\n  insert_hira_swp_one(object: $object) {\n    id\n  }\n}\n"
  }
};
})();

node.hash = "a89b9b1b325b34c4db712df909759800";

module.exports = node;
