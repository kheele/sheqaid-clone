/**
 * @generated SignedSource<<bd71306285c2437d730137520c2f5cdd>>
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
    "concreteType": "default_contractor_users",
    "kind": "LinkedField",
    "name": "update_default_contractor_users_by_pk",
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
    "name": "updateContractorUserMutation",
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
    "name": "updateContractorUserMutation",
    "selections": (v2/*: any*/)
  },
  "params": {
    "cacheID": "c6c6912d1cfe4b491a8ce401ab7b3e46",
    "id": null,
    "metadata": {},
    "name": "updateContractorUserMutation",
    "operationKind": "mutation",
    "text": "mutation updateContractorUserMutation(\n  $id: default_contractor_users_pk_columns_input!\n  $_set: default_contractor_users_set_input!\n) {\n  update_default_contractor_users_by_pk(pk_columns: $id, _set: $_set) {\n    id\n  }\n}\n"
  }
};
})();

node.hash = "15cee6521ea65e8e24dd69e0016f90aa";

module.exports = node;
