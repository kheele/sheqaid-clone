/**
 * @generated SignedSource<<9a3d9536161f7f32156d8005a257883e>>
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
    "concreteType": "default_manager_plugin",
    "kind": "LinkedField",
    "name": "update_default_manager_plugin_by_pk",
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
    "name": "updatePluginMutation",
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
    "name": "updatePluginMutation",
    "selections": (v2/*: any*/)
  },
  "params": {
    "cacheID": "75eb62f7498402c3592bc8a0b46606b2",
    "id": null,
    "metadata": {},
    "name": "updatePluginMutation",
    "operationKind": "mutation",
    "text": "mutation updatePluginMutation(\n  $id: default_manager_plugin_pk_columns_input!\n  $_set: default_manager_plugin_set_input!\n) {\n  update_default_manager_plugin_by_pk(pk_columns: $id, _set: $_set) {\n    id\n  }\n}\n"
  }
};
})();

node.hash = "a8c8ce5b1b958f63ec033d8d752ec10e";

module.exports = node;
