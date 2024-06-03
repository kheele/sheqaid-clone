/**
 * @generated SignedSource<<9ed42d08b6c429491af9654b7a832072>>
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
    "concreteType": "hr_employees_docs_expenses",
    "kind": "LinkedField",
    "name": "insert_hr_employees_docs_expenses_one",
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
    "name": "insertEmployeeExpenseMutation",
    "selections": (v1/*: any*/),
    "type": "mutation_root",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "insertEmployeeExpenseMutation",
    "selections": (v1/*: any*/)
  },
  "params": {
    "cacheID": "b4c55963023a1909f99236d5876d722a",
    "id": null,
    "metadata": {},
    "name": "insertEmployeeExpenseMutation",
    "operationKind": "mutation",
    "text": "mutation insertEmployeeExpenseMutation(\n  $object: hr_employees_docs_expenses_insert_input!\n) {\n  insert_hr_employees_docs_expenses_one(object: $object) {\n    id\n  }\n}\n"
  }
};
})();

node.hash = "e4f86184e10ce25778c51917e8ad898d";

module.exports = node;
