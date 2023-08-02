/**
 * @generated SignedSource<<e50b301320e48d57f3485dcaf75f5674>>
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
    "concreteType": "default_manager_module",
    "kind": "LinkedField",
    "name": "update_default_manager_module_by_pk",
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
    "name": "updateModuleMutation",
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
    "name": "updateModuleMutation",
    "selections": (v2/*: any*/)
  },
  "params": {
    "cacheID": "a8d3f6aa00d32e7311102760bb8f3571",
    "id": null,
    "metadata": {},
    "name": "updateModuleMutation",
    "operationKind": "mutation",
    "text": "mutation updateModuleMutation(\n  $id: default_manager_module_pk_columns_input!\n  $_set: default_manager_module_set_input!\n) {\n  update_default_manager_module_by_pk(pk_columns: $id, _set: $_set) {\n    id\n  }\n}\n"
  }
};
})();

node.hash = "b75b1e485c2ed0eb875b9096bf7e0604";

module.exports = node;
