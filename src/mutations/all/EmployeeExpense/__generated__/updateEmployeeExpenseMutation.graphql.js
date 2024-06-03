/**
 * @generated SignedSource<<3af7ed8bee598c7085d296410abd3341>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* eslint-disable */

'use strict';

var node = (function(){
var v0 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "_set"
},
v1 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "id"
},
v2 = [
  {
    "alias": null,
    "args": [
      {
        "kind": "Variable",
        "name": "_set",
        "variableName": "_set"
      },
      {
        "kind": "Variable",
        "name": "pk_columns",
        "variableName": "id"
      }
    ],
    "concreteType": "hr_employees_docs_expenses",
    "kind": "LinkedField",
    "name": "update_hr_employees_docs_expenses_by_pk",
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
    "argumentDefinitions": [
      (v0/*: any*/),
      (v1/*: any*/)
    ],
    "kind": "Fragment",
    "metadata": null,
    "name": "updateEmployeeExpenseMutation",
    "selections": (v2/*: any*/),
    "type": "mutation_root",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": [
      (v1/*: any*/),
      (v0/*: any*/)
    ],
    "kind": "Operation",
    "name": "updateEmployeeExpenseMutation",
    "selections": (v2/*: any*/)
  },
  "params": {
    "cacheID": "3e122515c812b71eaa758bac31479242",
    "id": null,
    "metadata": {},
    "name": "updateEmployeeExpenseMutation",
    "operationKind": "mutation",
    "text": "mutation updateEmployeeExpenseMutation(\n  $id: hr_employees_docs_expenses_pk_columns_input!\n  $_set: hr_employees_docs_expenses_set_input!\n) {\n  update_hr_employees_docs_expenses_by_pk(pk_columns: $id, _set: $_set) {\n    id\n  }\n}\n"
  }
};
})();

node.hash = "f55e6e3f793c2630af930c0fc1cffac8";

module.exports = node;
