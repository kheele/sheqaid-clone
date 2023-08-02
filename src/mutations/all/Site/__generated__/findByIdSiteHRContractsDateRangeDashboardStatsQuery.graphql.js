/**
 * @generated SignedSource<<94f0a6db500ad32de3944105ad964776>>
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
    "name": "findByIdSiteHRContractsDateRangeDashboardStatsQuery",
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
    "name": "findByIdSiteHRContractsDateRangeDashboardStatsQuery",
    "selections": (v3/*: any*/)
  },
  "params": {
    "cacheID": "84075e2b1c891b060f4dd0ab20e148f5",
    "id": null,
    "metadata": {},
    "name": "findByIdSiteHRContractsDateRangeDashboardStatsQuery",
    "operationKind": "query",
    "text": "query findByIdSiteHRContractsDateRangeDashboardStatsQuery(\n  $id: bigint\n  $dateStart: date\n  $dateEnd: date\n) {\n  default_sites_connection(where: {id: {_eq: $id}}) {\n    edges {\n      node {\n        id\n        list_aggregate: contract_list_aggregate(where: {removed: {_eq: false}, contract_details: {expiry_date: {_gte: $dateStart, _lte: $dateEnd}}}) {\n          aggregate {\n            count\n          }\n        }\n      }\n    }\n  }\n}\n"
  }
};
})();

node.hash = "56f213b184f856ca369071dfe8220c64";

module.exports = node;
