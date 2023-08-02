/**
 * @generated SignedSource<<0a63ddd1c95c4b6f4740f98da8899a6d>>
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
    "concreteType": "hr_employees_docs_contracts",
    "kind": "LinkedField",
    "name": "update_hr_employees_docs_contracts_by_pk",
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
    "name": "updateEmployeeContractMutation",
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
    "name": "updateEmployeeContractMutation",
    "selections": (v2/*: any*/)
  },
  "params": {
    "cacheID": "414c7c447ce034f93da67ceffb3aaad5",
    "id": null,
    "metadata": {},
    "name": "updateEmployeeContractMutation",
    "operationKind": "mutation",
    "text": "mutation updateEmployeeContractMutation(\n  $id: hr_employees_docs_contracts_pk_columns_input!\n  $_set: hr_employees_docs_contracts_set_input!\n) {\n  update_hr_employees_docs_contracts_by_pk(pk_columns: $id, _set: $_set) {\n    id\n  }\n}\n"
  }
};
})();

node.hash = "1eb596d243dec90e6673540a14c4dc62";

module.exports = node;
