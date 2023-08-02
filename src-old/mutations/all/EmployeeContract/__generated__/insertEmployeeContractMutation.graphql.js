/**
 * @generated SignedSource<<a00be724c048935a640c3b287f39296c>>
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
    "concreteType": "hr_employees_docs_contracts",
    "kind": "LinkedField",
    "name": "insert_hr_employees_docs_contracts_one",
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
    "name": "insertEmployeeContractMutation",
    "selections": (v1/*: any*/),
    "type": "mutation_root",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "insertEmployeeContractMutation",
    "selections": (v1/*: any*/)
  },
  "params": {
    "cacheID": "9a92466115868b2783824b168bb378ac",
    "id": null,
    "metadata": {},
    "name": "insertEmployeeContractMutation",
    "operationKind": "mutation",
    "text": "mutation insertEmployeeContractMutation(\n  $object: hr_employees_docs_contracts_insert_input!\n) {\n  insert_hr_employees_docs_contracts_one(object: $object) {\n    id\n  }\n}\n"
  }
};
})();

node.hash = "4fbbfbb8f91f6673891e3ada89625a22";

module.exports = node;
