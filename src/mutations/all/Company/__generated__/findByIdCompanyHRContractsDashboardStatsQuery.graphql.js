/**
 * @generated SignedSource<<4730643bf5bd56d56bd70aa1747dde4e>>
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
    "name": "id"
  },
  {
    "defaultValue": null,
    "kind": "LocalArgument",
    "name": "mon"
  },
  {
    "defaultValue": null,
    "kind": "LocalArgument",
    "name": "mon2"
  },
  {
    "defaultValue": null,
    "kind": "LocalArgument",
    "name": "mon3"
  }
],
v1 = {
  "_eq": false
},
v2 = [
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
v3 = {
  "kind": "Literal",
  "name": "removed",
  "value": (v1/*: any*/)
},
v4 = [
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
    "concreteType": "default_companiesConnection",
    "kind": "LinkedField",
    "name": "default_companies_connection",
    "plural": false,
    "selections": [
      {
        "alias": null,
        "args": null,
        "concreteType": "default_companiesEdge",
        "kind": "LinkedField",
        "name": "edges",
        "plural": true,
        "selections": [
          {
            "alias": null,
            "args": null,
            "concreteType": "default_companies",
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
                "alias": "list_active_aggregate",
                "args": [
                  {
                    "kind": "Literal",
                    "name": "where",
                    "value": {
                      "removed": (v1/*: any*/)
                    }
                  }
                ],
                "concreteType": "hr_employees_docs_contracts_aggregate",
                "kind": "LinkedField",
                "name": "contract_list_aggregate",
                "plural": false,
                "selections": (v2/*: any*/),
                "storageKey": "contract_list_aggregate(where:{\"removed\":{\"_eq\":false}})"
              },
              {
                "alias": "list_removed_aggregate",
                "args": [
                  {
                    "kind": "Literal",
                    "name": "where",
                    "value": {
                      "removed": {
                        "_eq": true
                      }
                    }
                  }
                ],
                "concreteType": "hr_employees_docs_contracts_aggregate",
                "kind": "LinkedField",
                "name": "contract_list_aggregate",
                "plural": false,
                "selections": (v2/*: any*/),
                "storageKey": "contract_list_aggregate(where:{\"removed\":{\"_eq\":true}})"
              },
              {
                "alias": "list_no_expiry_aggregate",
                "args": [
                  {
                    "kind": "Literal",
                    "name": "where",
                    "value": {
                      "contract_details": {
                        "expiry_date": {
                          "_is_null": true
                        }
                      },
                      "removed": (v1/*: any*/)
                    }
                  }
                ],
                "concreteType": "hr_employees_docs_contracts_aggregate",
                "kind": "LinkedField",
                "name": "contract_list_aggregate",
                "plural": false,
                "selections": (v2/*: any*/),
                "storageKey": "contract_list_aggregate(where:{\"contract_details\":{\"expiry_date\":{\"_is_null\":true}},\"removed\":{\"_eq\":false}})"
              },
              {
                "alias": "list_expired_aggregate",
                "args": [
                  {
                    "kind": "Literal",
                    "name": "where",
                    "value": {
                      "contract_details": {
                        "expiry_date": {
                          "_lte": "now()"
                        }
                      },
                      "removed": (v1/*: any*/)
                    }
                  }
                ],
                "concreteType": "hr_employees_docs_contracts_aggregate",
                "kind": "LinkedField",
                "name": "contract_list_aggregate",
                "plural": false,
                "selections": (v2/*: any*/),
                "storageKey": "contract_list_aggregate(where:{\"contract_details\":{\"expiry_date\":{\"_lte\":\"now()\"}},\"removed\":{\"_eq\":false}})"
              },
              {
                "alias": "list_mon_expiry_aggregate",
                "args": [
                  {
                    "fields": [
                      {
                        "fields": [
                          {
                            "fields": [
                              {
                                "kind": "Literal",
                                "name": "_gt",
                                "value": "now()"
                              },
                              {
                                "kind": "Variable",
                                "name": "_lte",
                                "variableName": "mon"
                              }
                            ],
                            "kind": "ObjectValue",
                            "name": "expiry_date"
                          }
                        ],
                        "kind": "ObjectValue",
                        "name": "contract_details"
                      },
                      (v3/*: any*/)
                    ],
                    "kind": "ObjectValue",
                    "name": "where"
                  }
                ],
                "concreteType": "hr_employees_docs_contracts_aggregate",
                "kind": "LinkedField",
                "name": "contract_list_aggregate",
                "plural": false,
                "selections": (v2/*: any*/),
                "storageKey": null
              },
              {
                "alias": "list_2mon_expiry_aggregate",
                "args": [
                  {
                    "fields": [
                      {
                        "fields": [
                          {
                            "fields": [
                              {
                                "kind": "Variable",
                                "name": "_gt",
                                "variableName": "mon"
                              },
                              {
                                "kind": "Variable",
                                "name": "_lte",
                                "variableName": "mon2"
                              }
                            ],
                            "kind": "ObjectValue",
                            "name": "expiry_date"
                          }
                        ],
                        "kind": "ObjectValue",
                        "name": "contract_details"
                      },
                      (v3/*: any*/)
                    ],
                    "kind": "ObjectValue",
                    "name": "where"
                  }
                ],
                "concreteType": "hr_employees_docs_contracts_aggregate",
                "kind": "LinkedField",
                "name": "contract_list_aggregate",
                "plural": false,
                "selections": (v2/*: any*/),
                "storageKey": null
              },
              {
                "alias": "list_3mon_expiry_aggregate",
                "args": [
                  {
                    "fields": [
                      {
                        "fields": [
                          {
                            "fields": [
                              {
                                "kind": "Variable",
                                "name": "_gt",
                                "variableName": "mon2"
                              },
                              {
                                "kind": "Variable",
                                "name": "_lte",
                                "variableName": "mon3"
                              }
                            ],
                            "kind": "ObjectValue",
                            "name": "expiry_date"
                          }
                        ],
                        "kind": "ObjectValue",
                        "name": "contract_details"
                      },
                      (v3/*: any*/)
                    ],
                    "kind": "ObjectValue",
                    "name": "where"
                  }
                ],
                "concreteType": "hr_employees_docs_contracts_aggregate",
                "kind": "LinkedField",
                "name": "contract_list_aggregate",
                "plural": false,
                "selections": (v2/*: any*/),
                "storageKey": null
              },
              {
                "alias": "list_4mon_expiry_aggregate",
                "args": [
                  {
                    "fields": [
                      {
                        "fields": [
                          {
                            "fields": [
                              {
                                "kind": "Variable",
                                "name": "_gt",
                                "variableName": "mon3"
                              }
                            ],
                            "kind": "ObjectValue",
                            "name": "expiry_date"
                          }
                        ],
                        "kind": "ObjectValue",
                        "name": "contract_details"
                      },
                      (v3/*: any*/)
                    ],
                    "kind": "ObjectValue",
                    "name": "where"
                  }
                ],
                "concreteType": "hr_employees_docs_contracts_aggregate",
                "kind": "LinkedField",
                "name": "contract_list_aggregate",
                "plural": false,
                "selections": (v2/*: any*/),
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
    "name": "findByIdCompanyHRContractsDashboardStatsQuery",
    "selections": (v4/*: any*/),
    "type": "query_root",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "findByIdCompanyHRContractsDashboardStatsQuery",
    "selections": (v4/*: any*/)
  },
  "params": {
    "cacheID": "24fde6ce7d3a89030dee59e084a36c47",
    "id": null,
    "metadata": {},
    "name": "findByIdCompanyHRContractsDashboardStatsQuery",
    "operationKind": "query",
    "text": "query findByIdCompanyHRContractsDashboardStatsQuery(\n  $id: bigint\n  $mon: date\n  $mon2: date\n  $mon3: date\n) {\n  default_companies_connection(where: {id: {_eq: $id}}) {\n    edges {\n      node {\n        id\n        list_active_aggregate: contract_list_aggregate(where: {removed: {_eq: false}}) {\n          aggregate {\n            count\n          }\n        }\n        list_removed_aggregate: contract_list_aggregate(where: {removed: {_eq: true}}) {\n          aggregate {\n            count\n          }\n        }\n        list_no_expiry_aggregate: contract_list_aggregate(where: {removed: {_eq: false}, contract_details: {expiry_date: {_is_null: true}}}) {\n          aggregate {\n            count\n          }\n        }\n        list_expired_aggregate: contract_list_aggregate(where: {removed: {_eq: false}, contract_details: {expiry_date: {_lte: \"now()\"}}}) {\n          aggregate {\n            count\n          }\n        }\n        list_mon_expiry_aggregate: contract_list_aggregate(where: {removed: {_eq: false}, contract_details: {expiry_date: {_gt: \"now()\", _lte: $mon}}}) {\n          aggregate {\n            count\n          }\n        }\n        list_2mon_expiry_aggregate: contract_list_aggregate(where: {removed: {_eq: false}, contract_details: {expiry_date: {_gt: $mon, _lte: $mon2}}}) {\n          aggregate {\n            count\n          }\n        }\n        list_3mon_expiry_aggregate: contract_list_aggregate(where: {removed: {_eq: false}, contract_details: {expiry_date: {_gt: $mon2, _lte: $mon3}}}) {\n          aggregate {\n            count\n          }\n        }\n        list_4mon_expiry_aggregate: contract_list_aggregate(where: {removed: {_eq: false}, contract_details: {expiry_date: {_gt: $mon3}}}) {\n          aggregate {\n            count\n          }\n        }\n      }\n    }\n  }\n}\n"
  }
};
})();

node.hash = "6f2c0a113781f41fc8708369d433d4da";

module.exports = node;
