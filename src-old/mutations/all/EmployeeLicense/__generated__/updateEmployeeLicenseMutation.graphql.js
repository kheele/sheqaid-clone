/**
 * @generated SignedSource<<d25e230b3fe0af9ca7295a35d06209b3>>
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
    "concreteType": "hr_employees_docs_licenses",
    "kind": "LinkedField",
    "name": "update_hr_employees_docs_licenses_by_pk",
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
    "name": "updateEmployeeLicenseMutation",
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
    "name": "updateEmployeeLicenseMutation",
    "selections": (v2/*: any*/)
  },
  "params": {
    "cacheID": "2cdd98705a6b0077daf78d9b44b663c9",
    "id": null,
    "metadata": {},
    "name": "updateEmployeeLicenseMutation",
    "operationKind": "mutation",
    "text": "mutation updateEmployeeLicenseMutation(\n  $id: hr_employees_docs_licenses_pk_columns_input!\n  $_set: hr_employees_docs_licenses_set_input!\n) {\n  update_hr_employees_docs_licenses_by_pk(pk_columns: $id, _set: $_set) {\n    id\n  }\n}\n"
  }
};
})();

node.hash = "fe7ca326784652865ffcd6cbe24bd256";

module.exports = node;
