/**
 * @generated SignedSource<<4f33c5c5bbcf1a8bd071c04a6c9bf721>>
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
    "concreteType": "hr_employees_docs_leaves",
    "kind": "LinkedField",
    "name": "insert_hr_employees_docs_leaves_one",
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
    "name": "insertEmployeeLeaveMutation",
    "selections": (v1/*: any*/),
    "type": "mutation_root",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "insertEmployeeLeaveMutation",
    "selections": (v1/*: any*/)
  },
  "params": {
    "cacheID": "f454e38f36abf625fe15e4dc6e9531aa",
    "id": null,
    "metadata": {},
    "name": "insertEmployeeLeaveMutation",
    "operationKind": "mutation",
    "text": "mutation insertEmployeeLeaveMutation(\n  $object: hr_employees_docs_leaves_insert_input!\n) {\n  insert_hr_employees_docs_leaves_one(object: $object) {\n    id\n  }\n}\n"
  }
};
})();

node.hash = "aa67f7690c7f01a2dd5cb96c80da0394";

module.exports = node;
