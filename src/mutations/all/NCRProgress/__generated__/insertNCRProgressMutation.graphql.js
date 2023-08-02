/**
 * @generated SignedSource<<1a5b2b12968637f8e877a4a4a92a23b6>>
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
    "concreteType": "sheq_non_conformance_progress",
    "kind": "LinkedField",
    "name": "insert_sheq_non_conformance_progress_one",
    "plural": false,
    "selections": [
      {
        "alias": null,
        "args": null,
        "kind": "ScalarField",
        "name": "id",
        "storageKey": null
      },
      {
        "alias": null,
        "args": null,
        "kind": "ScalarField",
        "name": "outstanding",
        "storageKey": null
      },
      {
        "alias": null,
        "args": null,
        "kind": "ScalarField",
        "name": "notes",
        "storageKey": null
      },
      {
        "alias": null,
        "args": null,
        "kind": "ScalarField",
        "name": "date",
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
    "name": "insertNCRProgressMutation",
    "selections": (v1/*: any*/),
    "type": "mutation_root",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "insertNCRProgressMutation",
    "selections": (v1/*: any*/)
  },
  "params": {
    "cacheID": "b28446578306772a082e43171449298e",
    "id": null,
    "metadata": {},
    "name": "insertNCRProgressMutation",
    "operationKind": "mutation",
    "text": "mutation insertNCRProgressMutation(\n  $object: sheq_non_conformance_progress_insert_input!\n) {\n  insert_sheq_non_conformance_progress_one(object: $object) {\n    id\n    outstanding\n    notes\n    date\n  }\n}\n"
  }
};
})();

node.hash = "341cb9a33555b4b6757a1137319b8da3";

module.exports = node;
