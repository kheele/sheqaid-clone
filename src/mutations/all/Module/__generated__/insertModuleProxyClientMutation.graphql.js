/**
 * @generated SignedSource<<0f7b8615877fe0c834ecceee82deb4d9>>
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
    "concreteType": "proxy_plugin_module__company",
    "kind": "LinkedField",
    "name": "insert_proxy_plugin_module__company_one",
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
    "name": "insertModuleProxyClientMutation",
    "selections": (v1/*: any*/),
    "type": "mutation_root",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "insertModuleProxyClientMutation",
    "selections": (v1/*: any*/)
  },
  "params": {
    "cacheID": "562cd3e069e06d59ccb0ba9ce1a1539b",
    "id": null,
    "metadata": {},
    "name": "insertModuleProxyClientMutation",
    "operationKind": "mutation",
    "text": "mutation insertModuleProxyClientMutation(\n  $object: proxy_plugin_module__company_insert_input!\n) {\n  insert_proxy_plugin_module__company_one(object: $object) {\n    id\n  }\n}\n"
  }
};
})();

node.hash = "841703cb0d597a025c6411fb96522eaa";

module.exports = node;
