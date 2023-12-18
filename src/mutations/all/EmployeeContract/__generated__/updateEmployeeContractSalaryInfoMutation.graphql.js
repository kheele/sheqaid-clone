/**
 * @generated SignedSource<<4ac497197db1aa33d01c26da1d62f56e>>
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
v2 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "id",
  "storageKey": null
},
v3 = [
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
    "concreteType": "hr_employees_docs_contracts_salary_info",
    "kind": "LinkedField",
    "name": "update_hr_employees_docs_contracts_salary_info_by_pk",
    "plural": false,
    "selections": [
      (v2/*: any*/),
      {
        "alias": null,
        "args": null,
        "concreteType": "hr_employees_docs_contracts_salary_deductibles",
        "kind": "LinkedField",
        "name": "deductible_list",
        "plural": true,
        "selections": [
          (v2/*: any*/),
          {
            "alias": null,
            "args": null,
            "kind": "ScalarField",
            "name": "created_at",
            "storageKey": null
          },
          {
            "alias": null,
            "args": null,
            "kind": "ScalarField",
            "name": "text",
            "storageKey": null
          },
          {
            "alias": null,
            "args": null,
            "kind": "ScalarField",
            "name": "value",
            "storageKey": null
          }
        ],
        "storageKey": null
      },
      {
        "alias": null,
        "args": null,
        "kind": "ScalarField",
        "name": "payment_type",
        "storageKey": null
      },
      {
        "alias": null,
        "args": null,
        "kind": "ScalarField",
        "name": "salary",
        "storageKey": null
      },
      {
        "alias": null,
        "args": null,
        "kind": "ScalarField",
        "name": "salary_interval",
        "storageKey": null
      },
      {
        "alias": null,
        "args": null,
        "kind": "ScalarField",
        "name": "wage",
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
    "name": "updateEmployeeContractSalaryInfoMutation",
    "selections": (v3/*: any*/),
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
    "name": "updateEmployeeContractSalaryInfoMutation",
    "selections": (v3/*: any*/)
  },
  "params": {
    "cacheID": "8a676b191149aa7e434b4e9600110d4f",
    "id": null,
    "metadata": {},
    "name": "updateEmployeeContractSalaryInfoMutation",
    "operationKind": "mutation",
    "text": "mutation updateEmployeeContractSalaryInfoMutation(\n  $id: hr_employees_docs_contracts_salary_info_pk_columns_input!\n  $_set: hr_employees_docs_contracts_salary_info_set_input!\n) {\n  update_hr_employees_docs_contracts_salary_info_by_pk(pk_columns: $id, _set: $_set) {\n    id\n    deductible_list {\n      id\n      created_at\n      text\n      value\n    }\n    payment_type\n    salary\n    salary_interval\n    wage\n  }\n}\n"
  }
};
})();

node.hash = "237ad175c07cec16da443a2fafa6dbdd";

module.exports = node;
