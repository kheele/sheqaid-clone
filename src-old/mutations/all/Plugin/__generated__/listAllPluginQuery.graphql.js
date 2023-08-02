/**
 * @generated SignedSource<<eb95e014b5d19cc5b3522f2ac0309e74>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* eslint-disable */

'use strict';

var node = (function(){
var v0 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "id",
  "storageKey": null
},
v1 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "app",
  "storageKey": null
},
v2 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "desc",
  "storageKey": null
},
v3 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "key",
  "storageKey": null
},
v4 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "status",
  "storageKey": null
},
v5 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "title",
  "storageKey": null
},
v6 = [
  {
    "kind": "Literal",
    "name": "order_by",
    "value": [
      {
        "sort": "asc"
      }
    ]
  }
],
v7 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "borderColor",
  "storageKey": null
},
v8 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "discount",
  "storageKey": null
},
v9 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "faIconLeft",
  "storageKey": null
},
v10 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "faIconRight",
  "storageKey": null
},
v11 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "has_update",
  "storageKey": null
},
v12 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "hover",
  "storageKey": null
},
v13 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "price",
  "storageKey": null
},
v14 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "sort",
  "storageKey": null
},
v15 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "svgIconLeft",
  "storageKey": null
},
v16 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "svgIconRight",
  "storageKey": null
},
v17 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "name",
  "storageKey": null
},
v18 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "profile_pic",
  "storageKey": null
},
v19 = [
  (v17/*: any*/),
  (v18/*: any*/)
],
v20 = [
  (v17/*: any*/),
  (v18/*: any*/),
  (v0/*: any*/)
];
return {
  "fragment": {
    "argumentDefinitions": [],
    "kind": "Fragment",
    "metadata": null,
    "name": "listAllPluginQuery",
    "selections": [
      {
        "alias": null,
        "args": null,
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
                  (v0/*: any*/),
                  (v1/*: any*/),
                  (v2/*: any*/),
                  (v3/*: any*/),
                  (v4/*: any*/),
                  (v5/*: any*/),
                  {
                    "alias": null,
                    "args": (v6/*: any*/),
                    "concreteType": "default_manager_module",
                    "kind": "LinkedField",
                    "name": "module_list",
                    "plural": true,
                    "selections": [
                      (v0/*: any*/),
                      (v7/*: any*/),
                      (v2/*: any*/),
                      (v8/*: any*/),
                      (v9/*: any*/),
                      (v10/*: any*/),
                      (v11/*: any*/),
                      (v12/*: any*/),
                      (v3/*: any*/),
                      (v13/*: any*/),
                      (v14/*: any*/),
                      (v4/*: any*/),
                      (v15/*: any*/),
                      (v16/*: any*/),
                      (v5/*: any*/),
                      {
                        "alias": null,
                        "args": null,
                        "concreteType": "proxy_plugin_module__company",
                        "kind": "LinkedField",
                        "name": "company_list",
                        "plural": true,
                        "selections": [
                          (v0/*: any*/),
                          (v13/*: any*/),
                          {
                            "alias": null,
                            "args": null,
                            "concreteType": "default_clients",
                            "kind": "LinkedField",
                            "name": "client",
                            "plural": false,
                            "selections": (v19/*: any*/),
                            "storageKey": null
                          },
                          {
                            "alias": null,
                            "args": null,
                            "concreteType": "default_companies",
                            "kind": "LinkedField",
                            "name": "company",
                            "plural": false,
                            "selections": (v19/*: any*/),
                            "storageKey": null
                          }
                        ],
                        "storageKey": null
                      }
                    ],
                    "storageKey": "module_list(order_by:[{\"sort\":\"asc\"}])"
                  }
                ],
                "storageKey": null
              }
            ],
            "storageKey": null
          }
        ],
        "storageKey": null
      }
    ],
    "type": "query_root",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": [],
    "kind": "Operation",
    "name": "listAllPluginQuery",
    "selections": [
      {
        "alias": null,
        "args": null,
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
                  (v0/*: any*/),
                  (v1/*: any*/),
                  (v2/*: any*/),
                  (v3/*: any*/),
                  (v4/*: any*/),
                  (v5/*: any*/),
                  {
                    "alias": null,
                    "args": (v6/*: any*/),
                    "concreteType": "default_manager_module",
                    "kind": "LinkedField",
                    "name": "module_list",
                    "plural": true,
                    "selections": [
                      (v0/*: any*/),
                      (v7/*: any*/),
                      (v2/*: any*/),
                      (v8/*: any*/),
                      (v9/*: any*/),
                      (v10/*: any*/),
                      (v11/*: any*/),
                      (v12/*: any*/),
                      (v3/*: any*/),
                      (v13/*: any*/),
                      (v14/*: any*/),
                      (v4/*: any*/),
                      (v15/*: any*/),
                      (v16/*: any*/),
                      (v5/*: any*/),
                      {
                        "alias": null,
                        "args": null,
                        "concreteType": "proxy_plugin_module__company",
                        "kind": "LinkedField",
                        "name": "company_list",
                        "plural": true,
                        "selections": [
                          (v0/*: any*/),
                          (v13/*: any*/),
                          {
                            "alias": null,
                            "args": null,
                            "concreteType": "default_clients",
                            "kind": "LinkedField",
                            "name": "client",
                            "plural": false,
                            "selections": (v20/*: any*/),
                            "storageKey": null
                          },
                          {
                            "alias": null,
                            "args": null,
                            "concreteType": "default_companies",
                            "kind": "LinkedField",
                            "name": "company",
                            "plural": false,
                            "selections": (v20/*: any*/),
                            "storageKey": null
                          }
                        ],
                        "storageKey": null
                      }
                    ],
                    "storageKey": "module_list(order_by:[{\"sort\":\"asc\"}])"
                  }
                ],
                "storageKey": null
              }
            ],
            "storageKey": null
          }
        ],
        "storageKey": null
      }
    ]
  },
  "params": {
    "cacheID": "efeb9431589cfcdb432cd808aa0f506e",
    "id": null,
    "metadata": {},
    "name": "listAllPluginQuery",
    "operationKind": "query",
    "text": "query listAllPluginQuery {\n  default_manager_plugin_connection {\n    edges {\n      node {\n        id\n        app\n        desc\n        key\n        status\n        title\n        module_list(order_by: [{sort: asc}]) {\n          id\n          borderColor\n          desc\n          discount\n          faIconLeft\n          faIconRight\n          has_update\n          hover\n          key\n          price\n          sort\n          status\n          svgIconLeft\n          svgIconRight\n          title\n          company_list {\n            id\n            price\n            client {\n              name\n              profile_pic\n              id\n            }\n            company {\n              name\n              profile_pic\n              id\n            }\n          }\n        }\n      }\n    }\n  }\n}\n"
  }
};
})();

node.hash = "f73c805a79624e9372f947a90a1dde71";

module.exports = node;
