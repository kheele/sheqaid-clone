/**
 * @generated SignedSource<<2df5d86f8a08e7ee605170e516a74098>>
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
    "concreteType": "hr_employees_docs_warnings",
    "kind": "LinkedField",
    "name": "update_hr_employees_docs_warnings_by_pk",
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
    "name": "updateEmployeeWarningMutation",
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
    "name": "updateEmployeeWarningMutation",
    "selections": (v2/*: any*/)
  },
  "params": {
    "cacheID": "6ad6bc81bc19fc830bc9a44c303a3991",
    "id": null,
    "metadata": {},
    "name": "updateEmployeeWarningMutation",
    "operationKind": "mutation",
    "text": "mutation updateEmployeeWarningMutation(\n  $id: hr_employees_docs_warnings_pk_columns_input!\n  $_set: hr_employees_docs_warnings_set_input!\n) {\n  update_hr_employees_docs_warnings_by_pk(pk_columns: $id, _set: $_set) {\n    id\n  }\n}\n"
  }
};
})();

node.hash = "bdd8f28f11f87db9bd72f3169f9e5857";

module.exports = node;
