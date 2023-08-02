/**
 * @generated SignedSource<<9e6dffe790ea263d32177a2a791ceaca>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* eslint-disable */

'use strict';

var node = (function(){
var v0 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "dateEnd"
},
v1 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "dateStart"
},
v2 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "id"
},
v3 = [
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
                "variableName": "id"
              }
            ],
            "kind": "ObjectValue",
            "name": "id"
          }
        ],
        "kind": "ObjectValue",
        "name": "where"
      }
    ],
    "concreteType": "default_clientsConnection",
    "kind": "LinkedField",
    "name": "default_clients_connection",
    "plural": false,
    "selections": [
      {
        "alias": null,
        "args": null,
        "concreteType": "default_clientsEdge",
        "kind": "LinkedField",
        "name": "edges",
        "plural": true,
        "selections": [
          {
            "alias": null,
            "args": null,
            "concreteType": "default_clients",
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
                "alias": "list_aggregate",
                "args": [
                  {
                    "fields": [
                      {
                        "fields": [
                          {
                            "kind": "Variable",
                            "name": "_gte",
                            "variableName": "dateStart"
                          },
                          {
                            "kind": "Variable",
                            "name": "_lte",
                            "variableName": "dateEnd"
                          }
                        ],
                        "kind": "ObjectValue",
                        "name": "expiry_date"
                      },
                      {
                        "kind": "Literal",
                        "name": "removed",
                        "value": {
                          "_eq": false
                        }
                      }
                    ],
                    "kind": "ObjectValue",
                    "name": "where"
                  }
                ],
                "concreteType": "hr_employees_docs_work_permits_aggregate",
                "kind": "LinkedField",
                "name": "work_permit_list_aggregate",
                "plural": false,
                "selections": [
                  {
                    "alias": null,
                    "args": null,
                    "concreteType": "hr_employees_docs_work_permits_aggregate_fields",
                    "kind": "LinkedField",
                    "name": "aggregate",
                    "plural": false,
                    "selections": [
                      {
                        "alias": null,
                        "args": null,
                        "kind": "ScalarField",
                        "name": "count",
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
        ],
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
      (v1/*: any*/),
      (v2/*: any*/)
    ],
    "kind": "Fragment",
    "metadata": null,
    "name": "findByIdClientHRWorkPermitsDateRangeDashboardStatsQuery",
    "selections": (v3/*: any*/),
    "type": "query_root",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": [
      (v2/*: any*/),
      (v1/*: any*/),
      (v0/*: any*/)
    ],
    "kind": "Operation",
    "name": "findByIdClientHRWorkPermitsDateRangeDashboardStatsQuery",
    "selections": (v3/*: any*/)
  },
  "params": {
    "cacheID": "884101be394d0016d62f37da7d142a91",
    "id": null,
    "metadata": {},
    "name": "findByIdClientHRWorkPermitsDateRangeDashboardStatsQuery",
    "operationKind": "query",
    "text": "query findByIdClientHRWorkPermitsDateRangeDashboardStatsQuery(\n  $id: bigint\n  $dateStart: date\n  $dateEnd: date\n) {\n  default_clients_connection(where: {id: {_eq: $id}}) {\n    edges {\n      node {\n        id\n        list_aggregate: work_permit_list_aggregate(where: {removed: {_eq: false}, expiry_date: {_gte: $dateStart, _lte: $dateEnd}}) {\n          aggregate {\n            count\n          }\n        }\n      }\n    }\n  }\n}\n"
  }
};
})();

node.hash = "489a0ff64cc29c8e375a87af068eaa26";

module.exports = node;
