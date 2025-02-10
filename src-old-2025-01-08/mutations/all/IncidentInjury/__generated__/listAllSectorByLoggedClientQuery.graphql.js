/**
 * @generated SignedSource<<05b7e981d1bb492ab3c58188ae6ba406>>
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
    "name": "client_id"
  }
],
v1 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "id",
  "storageKey": null
},
v2 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "name",
  "storageKey": null
},
v3 = [
  {
    "alias": null,
    "args": null,
    "kind": "ScalarField",
    "name": "count",
    "storageKey": null
  }
],
v4 = [
  (v1/*: any*/),
  (v2/*: any*/)
],
v5 = [
  {
    "alias": null,
    "args": [
      {
        "kind": "Literal",
        "name": "order_by",
        "value": {
          "name": "asc"
        }
      },
      {
        "fields": [
          {
            "fields": [
              {
                "kind": "Variable",
                "name": "_eq",
                "variableName": "client_id"
              }
            ],
            "kind": "ObjectValue",
            "name": "client_id"
          }
        ],
        "kind": "ObjectValue",
        "name": "where"
      }
    ],
    "concreteType": "default_sectorsConnection",
    "kind": "LinkedField",
    "name": "default_sectors_connection",
    "plural": false,
    "selections": [
      {
        "alias": null,
        "args": null,
        "concreteType": "default_sectorsEdge",
        "kind": "LinkedField",
        "name": "edges",
        "plural": true,
        "selections": [
          {
            "alias": null,
            "args": null,
            "concreteType": "default_sectors",
            "kind": "LinkedField",
            "name": "node",
            "plural": false,
            "selections": [
              (v1/*: any*/),
              {
                "alias": null,
                "args": null,
                "kind": "ScalarField",
                "name": "created_at",
                "storageKey": null
              },
              (v2/*: any*/),
              {
                "alias": null,
                "args": null,
                "kind": "ScalarField",
                "name": "desc",
                "storageKey": null
              },
              {
                "alias": null,
                "args": null,
                "kind": "ScalarField",
                "name": "sector_owner",
                "storageKey": null
              },
              {
                "alias": null,
                "args": null,
                "concreteType": "proxy_sector__training_course_aggregate",
                "kind": "LinkedField",
                "name": "training_course_list_aggregate",
                "plural": false,
                "selections": [
                  {
                    "alias": null,
                    "args": null,
                    "concreteType": "proxy_sector__training_course_aggregate_fields",
                    "kind": "LinkedField",
                    "name": "aggregate",
                    "plural": false,
                    "selections": (v3/*: any*/),
                    "storageKey": null
                  }
                ],
                "storageKey": null
              },
              {
                "alias": null,
                "args": null,
                "concreteType": "proxy_sector__company_aggregate",
                "kind": "LinkedField",
                "name": "company_list_aggregate",
                "plural": false,
                "selections": [
                  {
                    "alias": null,
                    "args": null,
                    "concreteType": "proxy_sector__company_aggregate_fields",
                    "kind": "LinkedField",
                    "name": "aggregate",
                    "plural": false,
                    "selections": (v3/*: any*/),
                    "storageKey": null
                  }
                ],
                "storageKey": null
              },
              {
                "alias": null,
                "args": null,
                "concreteType": "proxy_sector__client_aggregate",
                "kind": "LinkedField",
                "name": "client_list_aggregate",
                "plural": false,
                "selections": [
                  {
                    "alias": null,
                    "args": null,
                    "concreteType": "proxy_sector__client_aggregate_fields",
                    "kind": "LinkedField",
                    "name": "aggregate",
                    "plural": false,
                    "selections": (v3/*: any*/),
                    "storageKey": null
                  }
                ],
                "storageKey": null
              },
              {
                "alias": null,
                "args": null,
                "concreteType": "default_companies",
                "kind": "LinkedField",
                "name": "company",
                "plural": false,
                "selections": (v4/*: any*/),
                "storageKey": null
              },
              {
                "alias": null,
                "args": null,
                "concreteType": "default_clients",
                "kind": "LinkedField",
                "name": "client",
                "plural": false,
                "selections": (v4/*: any*/),
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
    "name": "listAllSectorByLoggedClientQuery",
    "selections": (v5/*: any*/),
    "type": "query_root",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "listAllSectorByLoggedClientQuery",
    "selections": (v5/*: any*/)
  },
  "params": {
    "cacheID": "799aac092bc2bad91e7d43ff0d0e91a0",
    "id": null,
    "metadata": {},
    "name": "listAllSectorByLoggedClientQuery",
    "operationKind": "query",
    "text": "query listAllSectorByLoggedClientQuery(\n  $client_id: bigint\n) {\n  default_sectors_connection(where: {client_id: {_eq: $client_id}}, order_by: {name: asc}) {\n    edges {\n      node {\n        id\n        created_at\n        name\n        desc\n        sector_owner\n        training_course_list_aggregate {\n          aggregate {\n            count\n          }\n        }\n        company_list_aggregate {\n          aggregate {\n            count\n          }\n        }\n        client_list_aggregate {\n          aggregate {\n            count\n          }\n        }\n        company {\n          id\n          name\n        }\n        client {\n          id\n          name\n        }\n      }\n    }\n  }\n}\n"
  }
};
})();

node.hash = "6d242bc1adeff887315e71350cdd607f";

module.exports = node;
