/**
 * @generated SignedSource<<48e48e9117af3fc2cbc14e9cf2a091f9>>
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
    "concreteType": "hr_employees_docs_medicals",
    "kind": "LinkedField",
    "name": "update_hr_employees_docs_medicals_by_pk",
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
    "name": "updateEmployeeMedicalMutation",
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
    "name": "updateEmployeeMedicalMutation",
    "selections": (v2/*: any*/)
  },
  "params": {
    "cacheID": "70dbe28010d1ac7b6e819b743e986ab7",
    "id": null,
    "metadata": {},
    "name": "updateEmployeeMedicalMutation",
    "operationKind": "mutation",
    "text": "mutation updateEmployeeMedicalMutation(\n  $id: hr_employees_docs_medicals_pk_columns_input!\n  $_set: hr_employees_docs_medicals_set_input!\n) {\n  update_hr_employees_docs_medicals_by_pk(pk_columns: $id, _set: $_set) {\n    id\n  }\n}\n"
  }
};
})();

node.hash = "e4643d2933b72aa85c5db5e80992ad54";

module.exports = node;
