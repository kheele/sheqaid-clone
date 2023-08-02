/**
 * @generated SignedSource<<9cf33669e0195c3823d759eac0fc85ec>>
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
    "name": "company_id"
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
                "variableName": "company_id"
              }
            ],
            "kind": "ObjectValue",
            "name": "company_id"
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
    "name": "listAllSiteByLoggedCompanyQuery",
    "selections": (v1/*: any*/),
    "type": "query_root",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "listAllSiteByLoggedCompanyQuery",
    "selections": (v1/*: any*/)
  },
  "params": {
    "cacheID": "3a908941001b5a91f4b5060b6d1e5fe7",
    "id": null,
    "metadata": {},
    "name": "listAllSiteByLoggedCompanyQuery",
    "operationKind": "query",
    "text": "query listAllSiteByLoggedCompanyQuery(\n  $company_id: bigint\n) {\n  default_sites_connection(where: {company_id: {_eq: $company_id}}) {\n    edges {\n      node {\n        id\n        created_at\n        name\n        address\n      }\n    }\n  }\n}\n"
  }
};
})();

node.hash = "77e83d151c62bf9ba969337c96798927";

module.exports = node;
