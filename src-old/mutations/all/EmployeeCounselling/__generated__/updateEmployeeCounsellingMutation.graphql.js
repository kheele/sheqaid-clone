/**
 * @generated SignedSource<<19b5c19e903f5e6f9736d8a0bf27cfbd>>
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
    "concreteType": "hr_employees_docs_counsellings",
    "kind": "LinkedField",
    "name": "update_hr_employees_docs_counsellings_by_pk",
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
    "name": "updateEmployeeCounsellingMutation",
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
    "name": "updateEmployeeCounsellingMutation",
    "selections": (v2/*: any*/)
  },
  "params": {
    "cacheID": "7b851fe54de352965a0d851dcd3f6ab0",
    "id": null,
    "metadata": {},
    "name": "updateEmployeeCounsellingMutation",
    "operationKind": "mutation",
    "text": "mutation updateEmployeeCounsellingMutation(\n  $id: hr_employees_docs_counsellings_pk_columns_input!\n  $_set: hr_employees_docs_counsellings_set_input!\n) {\n  update_hr_employees_docs_counsellings_by_pk(pk_columns: $id, _set: $_set) {\n    id\n  }\n}\n"
  }
};
})();

node.hash = "054fb4c625c003bbcf03ee16c575f19f";

module.exports = node;
