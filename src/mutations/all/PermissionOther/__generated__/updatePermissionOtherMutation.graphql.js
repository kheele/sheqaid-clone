/**
 * @generated SignedSource<<f57ff06af82d6bf7743576acd61f0f8b>>
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
    "concreteType": "sheq_permissions_other",
    "kind": "LinkedField",
    "name": "update_sheq_permissions_other_by_pk",
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
    "name": "updatePermissionOtherMutation",
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
    "name": "updatePermissionOtherMutation",
    "selections": (v2/*: any*/)
  },
  "params": {
    "cacheID": "d5c35379ecc674cf35201ef9a9aa67ec",
    "id": null,
    "metadata": {},
    "name": "updatePermissionOtherMutation",
    "operationKind": "mutation",
    "text": "mutation updatePermissionOtherMutation(\n  $id: sheq_permissions_other_pk_columns_input!\n  $_set: sheq_permissions_other_set_input!\n) {\n  update_sheq_permissions_other_by_pk(pk_columns: $id, _set: $_set) {\n    id\n  }\n}\n"
  }
};
})();

node.hash = "d4908a4478236fc76c0e527cba50bbab";

module.exports = node;
