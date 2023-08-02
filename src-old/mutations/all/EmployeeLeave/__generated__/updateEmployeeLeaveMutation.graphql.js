/**
 * @generated SignedSource<<82252376ba1e088d9f72522bb1ba97d8>>
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
    "concreteType": "hr_employees_docs_leaves",
    "kind": "LinkedField",
    "name": "update_hr_employees_docs_leaves_by_pk",
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
    "name": "updateEmployeeLeaveMutation",
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
    "name": "updateEmployeeLeaveMutation",
    "selections": (v2/*: any*/)
  },
  "params": {
    "cacheID": "725b7ecd822b55cb1ed4821671dcaf52",
    "id": null,
    "metadata": {},
    "name": "updateEmployeeLeaveMutation",
    "operationKind": "mutation",
    "text": "mutation updateEmployeeLeaveMutation(\n  $id: hr_employees_docs_leaves_pk_columns_input!\n  $_set: hr_employees_docs_leaves_set_input!\n) {\n  update_hr_employees_docs_leaves_by_pk(pk_columns: $id, _set: $_set) {\n    id\n  }\n}\n"
  }
};
})();

node.hash = "e4333f69d3484adc8ab3b6043fe52cfd";

module.exports = node;
