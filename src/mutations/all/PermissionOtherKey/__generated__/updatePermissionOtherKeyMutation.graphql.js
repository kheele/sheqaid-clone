/**
 * @generated SignedSource<<a8b2db7ee8bc8f925c42d104a52774b9>>
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
    "concreteType": "sheq_permissions_other_keys",
    "kind": "LinkedField",
    "name": "update_sheq_permissions_other_keys_by_pk",
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
    "name": "updatePermissionOtherKeyMutation",
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
    "name": "updatePermissionOtherKeyMutation",
    "selections": (v2/*: any*/)
  },
  "params": {
    "cacheID": "06efa682569ca011814ad62218503864",
    "id": null,
    "metadata": {},
    "name": "updatePermissionOtherKeyMutation",
    "operationKind": "mutation",
    "text": "mutation updatePermissionOtherKeyMutation(\n  $id: sheq_permissions_other_keys_pk_columns_input!\n  $_set: sheq_permissions_other_keys_set_input!\n) {\n  update_sheq_permissions_other_keys_by_pk(pk_columns: $id, _set: $_set) {\n    id\n  }\n}\n"
  }
};
})();

node.hash = "c07d1c7d1adffc0c648e12582289f585";

module.exports = node;
