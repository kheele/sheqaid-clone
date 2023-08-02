/**
 * @generated SignedSource<<07efcb199e01464b661eb4ddeec5005a>>
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
    "concreteType": "hr_employees_docs_competencies",
    "kind": "LinkedField",
    "name": "update_hr_employees_docs_competencies_by_pk",
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
    "name": "updateEmployeeCompetencyMutation",
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
    "name": "updateEmployeeCompetencyMutation",
    "selections": (v2/*: any*/)
  },
  "params": {
    "cacheID": "9be3a8de0ab476b08d86c815335fedc7",
    "id": null,
    "metadata": {},
    "name": "updateEmployeeCompetencyMutation",
    "operationKind": "mutation",
    "text": "mutation updateEmployeeCompetencyMutation(\n  $id: hr_employees_docs_competencies_pk_columns_input!\n  $_set: hr_employees_docs_competencies_set_input!\n) {\n  update_hr_employees_docs_competencies_by_pk(pk_columns: $id, _set: $_set) {\n    id\n  }\n}\n"
  }
};
})();

node.hash = "784a089385001d025310ace35554993c";

module.exports = node;
