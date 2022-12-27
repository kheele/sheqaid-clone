/**
 * @generated SignedSource<<800ad503050cb955ce2b3db3417227c5>>
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
    "concreteType": "default_users",
    "kind": "LinkedField",
    "name": "update_default_users_by_pk",
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
    "name": "updateUserMutation",
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
    "name": "updateUserMutation",
    "selections": (v2/*: any*/)
  },
  "params": {
    "cacheID": "7d284a1d4d0606dee83c45ea778ac85e",
    "id": null,
    "metadata": {},
    "name": "updateUserMutation",
    "operationKind": "mutation",
    "text": "mutation updateUserMutation(\n  $id: default_users_pk_columns_input!\n  $_set: default_users_set_input!\n) {\n  update_default_users_by_pk(pk_columns: $id, _set: $_set) {\n    id\n  }\n}\n"
  }
};
})();

node.hash = "dfe22163430194305b6ed7c5e11811f5";

module.exports = node;
