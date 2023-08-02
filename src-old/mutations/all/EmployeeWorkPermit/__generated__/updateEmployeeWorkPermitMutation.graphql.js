/**
 * @generated SignedSource<<fe210aa8ddf50ff8dff0b4fb520d99da>>
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
    "concreteType": "hr_employees_docs_work_permits",
    "kind": "LinkedField",
    "name": "update_hr_employees_docs_work_permits_by_pk",
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
    "name": "updateEmployeeWorkPermitMutation",
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
    "name": "updateEmployeeWorkPermitMutation",
    "selections": (v2/*: any*/)
  },
  "params": {
    "cacheID": "72bff0f8152f6d6ca9997512ab18e9db",
    "id": null,
    "metadata": {},
    "name": "updateEmployeeWorkPermitMutation",
    "operationKind": "mutation",
    "text": "mutation updateEmployeeWorkPermitMutation(\n  $id: hr_employees_docs_work_permits_pk_columns_input!\n  $_set: hr_employees_docs_work_permits_set_input!\n) {\n  update_hr_employees_docs_work_permits_by_pk(pk_columns: $id, _set: $_set) {\n    id\n  }\n}\n"
  }
};
})();

node.hash = "e4f563271e3e8f34c3799fc33f56420e";

module.exports = node;
