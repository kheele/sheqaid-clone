/**
 * @generated SignedSource<<caf3ef5f6f61d133c068c21e217d009d>>
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
    "concreteType": "default_companies",
    "kind": "LinkedField",
    "name": "insert_default_companies_one",
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
    "name": "insertProjectMutation",
    "selections": (v1/*: any*/),
    "type": "mutation_root",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "insertProjectMutation",
    "selections": (v1/*: any*/)
  },
  "params": {
    "cacheID": "c1ec4d8fff69fe94fbe413ba0926691b",
    "id": null,
    "metadata": {},
    "name": "insertProjectMutation",
    "operationKind": "mutation",
    "text": "mutation insertProjectMutation(\n  $object: default_companies_insert_input!\n) {\n  insert_default_companies_one(object: $object) {\n    id\n  }\n}\n"
  }
};
})();

node.hash = "51a8937a75cf063971f85f287bd09bb4";

module.exports = node;
