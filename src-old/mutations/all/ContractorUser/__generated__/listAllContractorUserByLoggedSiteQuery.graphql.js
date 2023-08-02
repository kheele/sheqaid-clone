/**
 * @generated SignedSource<<50c3c52218835c1a6e6865e987483280>>
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
    "name": "contractor_id"
  },
  {
    "defaultValue": null,
    "kind": "LocalArgument",
    "name": "site_id"
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
                "variableName": "contractor_id"
              }
            ],
            "kind": "ObjectValue",
            "name": "contractor_id"
          },
          {
            "fields": [
              {
                "kind": "Variable",
                "name": "_eq",
                "variableName": "site_id"
              }
            ],
            "kind": "ObjectValue",
            "name": "contractor_site_id"
          }
        ],
        "kind": "ObjectValue",
        "name": "where"
      }
    ],
    "concreteType": "default_contractor_usersConnection",
    "kind": "LinkedField",
    "name": "default_contractor_users_connection",
    "plural": false,
    "selections": [
      {
        "alias": null,
        "args": null,
        "concreteType": "default_contractor_usersEdge",
        "kind": "LinkedField",
        "name": "edges",
        "plural": true,
        "selections": [
          {
            "alias": null,
            "args": null,
            "concreteType": "default_contractor_users",
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
    "storageKey": null
  }
];
return {
  "fragment": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Fragment",
    "metadata": null,
    "name": "listAllContractorUserByLoggedSiteQuery",
    "selections": (v1/*: any*/),
    "type": "query_root",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "listAllContractorUserByLoggedSiteQuery",
    "selections": (v1/*: any*/)
  },
  "params": {
    "cacheID": "a098085375c0716e97b92cde07c7a739",
    "id": null,
    "metadata": {},
    "name": "listAllContractorUserByLoggedSiteQuery",
    "operationKind": "query",
    "text": "query listAllContractorUserByLoggedSiteQuery(\n  $contractor_id: bigint\n  $site_id: bigint\n) {\n  default_contractor_users_connection(where: {contractor_id: {_eq: $contractor_id}, contractor_site_id: {_eq: $site_id}}) {\n    edges {\n      node {\n        id\n      }\n    }\n  }\n}\n"
  }
};
})();

node.hash = "ffd326209bc9e3247fa521ee42245f8f";

module.exports = node;
