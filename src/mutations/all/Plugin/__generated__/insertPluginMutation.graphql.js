/**
 * @generated SignedSource<<4b11538f34e4a589228224538c5210e1>>
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
    "concreteType": "default_manager_plugin",
    "kind": "LinkedField",
    "name": "insert_default_manager_plugin_one",
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
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Fragment",
    "metadata": null,
    "name": "insertPluginMutation",
    "selections": (v1/*: any*/),
    "type": "mutation_root",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "insertPluginMutation",
    "selections": (v1/*: any*/)
  },
  "params": {
    "cacheID": "4d7ebcfd180b52ba3b843a72c35d4b52",
    "id": null,
    "metadata": {},
    "name": "insertPluginMutation",
    "operationKind": "mutation",
    "text": "mutation insertPluginMutation(\n  $object: default_manager_plugin_insert_input!\n) {\n  insert_default_manager_plugin_one(object: $object) {\n    id\n  }\n}\n"
  }
};
})();

node.hash = "987c33d75be553496230432aedb3c396";

module.exports = node;
