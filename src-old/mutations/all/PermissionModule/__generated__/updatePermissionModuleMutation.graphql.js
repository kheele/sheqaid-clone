/**
 * @generated SignedSource<<207fd4db8f1be4dbdb60d3c2c934b93f>>
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
    "concreteType": "sheq_permissions_modules",
    "kind": "LinkedField",
    "name": "update_sheq_permissions_modules_by_pk",
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
    "name": "updatePermissionModuleMutation",
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
    "name": "updatePermissionModuleMutation",
    "selections": (v2/*: any*/)
  },
  "params": {
    "cacheID": "db4ab9e508af8fdc2c0c93c22fb7b4d0",
    "id": null,
    "metadata": {},
    "name": "updatePermissionModuleMutation",
    "operationKind": "mutation",
    "text": "mutation updatePermissionModuleMutation(\n  $id: sheq_permissions_modules_pk_columns_input!\n  $_set: sheq_permissions_modules_set_input!\n) {\n  update_sheq_permissions_modules_by_pk(pk_columns: $id, _set: $_set) {\n    id\n  }\n}\n"
  }
};
})();

node.hash = "4747cfb6c723c3199081680201798327";

module.exports = node;
