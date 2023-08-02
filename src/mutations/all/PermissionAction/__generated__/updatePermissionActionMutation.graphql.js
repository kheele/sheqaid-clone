/**
 * @generated SignedSource<<f8eac1ae7f1327173aad0ec28df56528>>
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
    "concreteType": "sheq_permissions_actions",
    "kind": "LinkedField",
    "name": "update_sheq_permissions_actions_by_pk",
    "plural": false,
    "selections": [
      {
        "alias": null,
        "args": null,
        "kind": "ScalarField",
        "name": "id",
        "storageKey": null
      },
      {
        "alias": null,
        "args": null,
        "kind": "ScalarField",
        "name": "create",
        "storageKey": null
      },
      {
        "alias": null,
        "args": null,
        "kind": "ScalarField",
        "name": "edit",
        "storageKey": null
      },
      {
        "alias": null,
        "args": null,
        "kind": "ScalarField",
        "name": "view",
        "storageKey": null
      },
      {
        "alias": null,
        "args": null,
        "kind": "ScalarField",
        "name": "remove",
        "storageKey": null
      },
      {
        "alias": null,
        "args": null,
        "kind": "ScalarField",
        "name": "share",
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
    "name": "updatePermissionActionMutation",
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
    "name": "updatePermissionActionMutation",
    "selections": (v2/*: any*/)
  },
  "params": {
    "cacheID": "60cf17548c163698c3842b1daa943d84",
    "id": null,
    "metadata": {},
    "name": "updatePermissionActionMutation",
    "operationKind": "mutation",
    "text": "mutation updatePermissionActionMutation(\n  $id: sheq_permissions_actions_pk_columns_input!\n  $_set: sheq_permissions_actions_set_input!\n) {\n  update_sheq_permissions_actions_by_pk(pk_columns: $id, _set: $_set) {\n    id\n    create\n    edit\n    view\n    remove\n    share\n  }\n}\n"
  }
};
})();

node.hash = "463734e410ba88a2b08b16baac43569e";

module.exports = node;
