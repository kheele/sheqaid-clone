/**
 * @generated SignedSource<<3818e141fa04bf205393e66d776f17db>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* eslint-disable */

'use strict';

var node = (function(){
var v0 = [
  {
    "alias": null,
    "args": [
      {
        "kind": "Literal",
        "name": "where",
        "value": {
          "status": {
            "_eq": "Installed"
          }
        }
      }
    ],
    "concreteType": "default_manager_pluginConnection",
    "kind": "LinkedField",
    "name": "default_manager_plugin_connection",
    "plural": false,
    "selections": [
      {
        "alias": null,
        "args": null,
        "concreteType": "default_manager_pluginEdge",
        "kind": "LinkedField",
        "name": "edges",
        "plural": true,
        "selections": [
          {
            "alias": null,
            "args": null,
            "concreteType": "default_manager_plugin",
            "kind": "LinkedField",
            "name": "node",
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
        ],
        "storageKey": null
      }
    ],
    "storageKey": "default_manager_plugin_connection(where:{\"status\":{\"_eq\":\"Installed\"}})"
  }
];
return {
  "fragment": {
    "argumentDefinitions": [],
    "kind": "Fragment",
    "metadata": null,
    "name": "listInstalledPluginQuery",
    "selections": (v0/*: any*/),
    "type": "query_root",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": [],
    "kind": "Operation",
    "name": "listInstalledPluginQuery",
    "selections": (v0/*: any*/)
  },
  "params": {
    "cacheID": "bd247174a619783f949dceb806e8a2f5",
    "id": null,
    "metadata": {},
    "name": "listInstalledPluginQuery",
    "operationKind": "query",
    "text": "query listInstalledPluginQuery {\n  default_manager_plugin_connection(where: {status: {_eq: \"Installed\"}}) {\n    edges {\n      node {\n        id\n      }\n    }\n  }\n}\n"
  }
};
})();

node.hash = "06fba3b7330995a2bd958a515a5294de";

module.exports = node;
