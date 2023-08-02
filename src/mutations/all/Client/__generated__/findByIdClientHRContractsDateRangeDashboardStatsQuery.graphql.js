/**
 * @generated SignedSource<<e4c8f4201240a1ad6d630fd0bb9e90d2>>
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
                          }
                        ],
                        "kind": "ObjectValue",
                        "name": "contract_details"
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
                "concreteType": "hr_employees_docs_contracts_aggregate",
                "kind": "LinkedField",
                "name": "contract_list_aggregate",
                "plural": false,
                "selections": [
                  {
                    "alias": null,
                    "args": null,
                    "concreteType": "hr_employees_docs_contracts_aggregate_fields",
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
    "name": "findByIdClientHRContractsDateRangeDashboardStatsQuery",
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
    "name": "findByIdClientHRContractsDateRangeDashboardStatsQuery",
    "selections": (v3/*: any*/)
  },
  "params": {
    "cacheID": "01e95edef0070927751b99fb5abebfc6",
    "id": null,
    "metadata": {},
    "name": "findByIdClientHRContractsDateRangeDashboardStatsQuery",
    "operationKind": "query",
    "text": "query findByIdClientHRContractsDateRangeDashboardStatsQuery(\n  $id: bigint\n  $dateStart: date\n  $dateEnd: date\n) {\n  default_clients_connection(where: {id: {_eq: $id}}) {\n    edges {\n      node {\n        id\n        list_aggregate: contract_list_aggregate(where: {removed: {_eq: false}, contract_details: {expiry_date: {_gte: $dateStart, _lte: $dateEnd}}}) {\n          aggregate {\n            count\n          }\n        }\n      }\n    }\n  }\n}\n"
  }
};
})();

node.hash = "5edfe9edeb2a02f3ad641483ebb97226";

module.exports = node;
