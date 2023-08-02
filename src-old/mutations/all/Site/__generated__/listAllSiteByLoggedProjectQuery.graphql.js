/**
 * @generated SignedSource<<38927bd7fcf8c551f988efa8fba7bf36>>
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
    "name": "project_id"
  }
],
v1 = [
  {
    "alias": null,
    "args": [
      {
        "fields": [
          {
            "fields": [
              {
                "kind": "Variable",
                "name": "_eq",
                "variableName": "project_id"
              }
            ],
            "kind": "ObjectValue",
            "name": "project_id"
          }
        ],
        "kind": "ObjectValue",
        "name": "where"
      }
    ],
    "concreteType": "default_sitesConnection",
    "kind": "LinkedField",
    "name": "default_sites_connection",
    "plural": false,
    "selections": [
      {
        "alias": null,
        "args": null,
        "concreteType": "default_sitesEdge",
        "kind": "LinkedField",
        "name": "edges",
        "plural": true,
        "selections": [
          {
            "alias": null,
            "args": null,
            "concreteType": "default_sites",
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
              },
              {
                "alias": null,
                "args": null,
                "kind": "ScalarField",
                "name": "created_at",
                "storageKey": null
              },
              {
                "alias": null,
                "args": null,
                "kind": "ScalarField",
                "name": "name",
                "storageKey": null
              },
              {
                "alias": null,
                "args": null,
                "kind": "ScalarField",
                "name": "address",
                "storageKey": null
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
];
return {
  "fragment": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Fragment",
    "metadata": null,
    "name": "listAllSiteByLoggedProjectQuery",
    "selections": (v1/*: any*/),
    "type": "query_root",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "listAllSiteByLoggedProjectQuery",
    "selections": (v1/*: any*/)
  },
  "params": {
    "cacheID": "7ac82d8ab1a7e1e13174474917b342be",
    "id": null,
    "metadata": {},
    "name": "listAllSiteByLoggedProjectQuery",
    "operationKind": "query",
    "text": "query listAllSiteByLoggedProjectQuery(\n  $project_id: bigint\n) {\n  default_sites_connection(where: {project_id: {_eq: $project_id}}) {\n    edges {\n      node {\n        id\n        created_at\n        name\n        address\n      }\n    }\n  }\n}\n"
  }
};
})();

node.hash = "9b491d026cb29aa1e974d9e4bba088a1";

module.exports = node;
