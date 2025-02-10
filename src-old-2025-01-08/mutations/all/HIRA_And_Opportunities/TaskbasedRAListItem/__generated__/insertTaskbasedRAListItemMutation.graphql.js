/**
 * @generated SignedSource<<b07534c8b56978b42f2b2410b211c5d2>>
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
    "concreteType": "hira_taskbased_ra_list",
    "kind": "LinkedField",
    "name": "insert_hira_taskbased_ra_list_one",
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
    "name": "insertTaskbasedRAListItemMutation",
    "selections": (v1/*: any*/),
    "type": "mutation_root",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "insertTaskbasedRAListItemMutation",
    "selections": (v1/*: any*/)
  },
  "params": {
    "cacheID": "841bb251891a0dca36e683c4fb2290dc",
    "id": null,
    "metadata": {},
    "name": "insertTaskbasedRAListItemMutation",
    "operationKind": "mutation",
    "text": "mutation insertTaskbasedRAListItemMutation(\n  $object: hira_taskbased_ra_list_insert_input!\n) {\n  insert_hira_taskbased_ra_list_one(object: $object) {\n    id\n  }\n}\n"
  }
};
})();

node.hash = "cbdae9a8ef24b179e8d16cd495872ff6";

module.exports = node;
