/**
 * @generated SignedSource<<f9bb771f762f7272b88316fb10f51d40>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* eslint-disable */

'use strict';

var node = (function(){
var v0 = [
  {
    "defaultValue": null,
    "kind": "LocalArgument",
    "name": "object"
  }
],
v1 = [
  {
    "alias": null,
    "args": [
      {
        "kind": "Variable",
        "name": "object",
        "variableName": "object"
      }
    ],
    "concreteType": "sheq_permissions_actions",
    "kind": "LinkedField",
    "name": "insert_sheq_permissions_actions_one",
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
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Fragment",
    "metadata": null,
    "name": "insertPermissionActionMutation",
    "selections": (v1/*: any*/),
    "type": "mutation_root",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "insertPermissionActionMutation",
    "selections": (v1/*: any*/)
  },
  "params": {
    "cacheID": "77b063ae43c3177c1d107d3027e3d778",
    "id": null,
    "metadata": {},
    "name": "insertPermissionActionMutation",
    "operationKind": "mutation",
    "text": "mutation insertPermissionActionMutation(\n  $object: sheq_permissions_actions_insert_input!\n) {\n  insert_sheq_permissions_actions_one(object: $object) {\n    id\n    create\n    edit\n    view\n    remove\n    share\n  }\n}\n"
  }
};
})();

node.hash = "7be83704a36e345ed3485306414f789c";

module.exports = node;
