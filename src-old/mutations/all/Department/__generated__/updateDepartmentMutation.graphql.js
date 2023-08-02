/**
 * @generated SignedSource<<351f885f273b1fffabc177a4fe39efa6>>
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
    "concreteType": "default_departments",
    "kind": "LinkedField",
    "name": "update_default_departments_by_pk",
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
    "name": "updateDepartmentMutation",
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
    "name": "updateDepartmentMutation",
    "selections": (v2/*: any*/)
  },
  "params": {
    "cacheID": "b23c780218704919757ba47b3659f130",
    "id": null,
    "metadata": {},
    "name": "updateDepartmentMutation",
    "operationKind": "mutation",
    "text": "mutation updateDepartmentMutation(\n  $id: default_departments_pk_columns_input!\n  $_set: default_departments_set_input!\n) {\n  update_default_departments_by_pk(pk_columns: $id, _set: $_set) {\n    id\n  }\n}\n"
  }
};
})();

node.hash = "8bea112b9ac813427000bf0189e79a30";

module.exports = node;
