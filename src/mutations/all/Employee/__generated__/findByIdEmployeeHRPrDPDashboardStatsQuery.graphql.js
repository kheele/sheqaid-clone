/**
 * @generated SignedSource<<041cbf2bc2bef8b49aecf0df881e0eb4>>
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
v2 = {
  "_eq": "PrDP"
},
v3 = [
  {
    "alias": null,
    "args": null,
    "concreteType": "hr_employees_documents_aggregate_fields",
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
v4 = {
  "kind": "Literal",
  "name": "removed",
  "value": (v1/*: any*/)
},
v5 = {
  "kind": "Literal",
  "name": "type",
  "value": (v2/*: any*/)
},
v6 = [
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
    "concreteType": "hr_employeesConnection",
    "kind": "LinkedField",
    "name": "hr_employees_connection",
    "plural": false,
    "selections": [
      {
        "alias": null,
        "args": null,
        "concreteType": "hr_employeesEdge",
        "kind": "LinkedField",
        "name": "edges",
        "plural": true,
        "selections": [
          {
            "alias": null,
            "args": null,
            "concreteType": "hr_employees",
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
                      "removed": (v1/*: any*/),
                      "type": (v2/*: any*/)
                    }
                  }
                ],
                "concreteType": "hr_employees_documents_aggregate",
                "kind": "LinkedField",
                "name": "document_list_aggregate",
                "plural": false,
                "selections": (v3/*: any*/),
                "storageKey": "document_list_aggregate(where:{\"removed\":{\"_eq\":false},\"type\":{\"_eq\":\"PrDP\"}})"
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
                      },
                      "type": (v2/*: any*/)
                    }
                  }
                ],
                "concreteType": "hr_employees_documents_aggregate",
                "kind": "LinkedField",
                "name": "document_list_aggregate",
                "plural": false,
                "selections": (v3/*: any*/),
                "storageKey": "document_list_aggregate(where:{\"removed\":{\"_eq\":true},\"type\":{\"_eq\":\"PrDP\"}})"
              },
              {
                "alias": "list_no_expiry_aggregate",
                "args": [
                  {
                    "kind": "Literal",
                    "name": "where",
                    "value": {
                      "expiry_date": {
                        "_is_null": true
                      },
                      "removed": (v1/*: any*/),
                      "type": (v2/*: any*/)
                    }
                  }
                ],
                "concreteType": "hr_employees_documents_aggregate",
                "kind": "LinkedField",
                "name": "document_list_aggregate",
                "plural": false,
                "selections": (v3/*: any*/),
                "storageKey": "document_list_aggregate(where:{\"expiry_date\":{\"_is_null\":true},\"removed\":{\"_eq\":false},\"type\":{\"_eq\":\"PrDP\"}})"
              },
              {
                "alias": "list_expired_aggregate",
                "args": [
                  {
                    "kind": "Literal",
                    "name": "where",
                    "value": {
                      "expiry_date": {
                        "_lte": "now()"
                      },
                      "removed": (v1/*: any*/),
                      "type": (v2/*: any*/)
                    }
                  }
                ],
                "concreteType": "hr_employees_documents_aggregate",
                "kind": "LinkedField",
                "name": "document_list_aggregate",
                "plural": false,
                "selections": (v3/*: any*/),
                "storageKey": "document_list_aggregate(where:{\"expiry_date\":{\"_lte\":\"now()\"},\"removed\":{\"_eq\":false},\"type\":{\"_eq\":\"PrDP\"}})"
              },
              {
                "alias": "list_mon_expiry_aggregate",
                "args": [
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
                      },
                      (v4/*: any*/),
                      (v5/*: any*/)
                    ],
                    "kind": "ObjectValue",
                    "name": "where"
                  }
                ],
                "concreteType": "hr_employees_documents_aggregate",
                "kind": "LinkedField",
                "name": "document_list_aggregate",
                "plural": false,
                "selections": (v3/*: any*/),
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
                      },
                      (v4/*: any*/),
                      (v5/*: any*/)
                    ],
                    "kind": "ObjectValue",
                    "name": "where"
                  }
                ],
                "concreteType": "hr_employees_documents_aggregate",
                "kind": "LinkedField",
                "name": "document_list_aggregate",
                "plural": false,
                "selections": (v3/*: any*/),
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
                      },
                      (v4/*: any*/),
                      (v5/*: any*/)
                    ],
                    "kind": "ObjectValue",
                    "name": "where"
                  }
                ],
                "concreteType": "hr_employees_documents_aggregate",
                "kind": "LinkedField",
                "name": "document_list_aggregate",
                "plural": false,
                "selections": (v3/*: any*/),
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
                            "kind": "Variable",
                            "name": "_gt",
                            "variableName": "mon3"
                          }
                        ],
                        "kind": "ObjectValue",
                        "name": "expiry_date"
                      },
                      (v4/*: any*/),
                      (v5/*: any*/)
                    ],
                    "kind": "ObjectValue",
                    "name": "where"
                  }
                ],
                "concreteType": "hr_employees_documents_aggregate",
                "kind": "LinkedField",
                "name": "document_list_aggregate",
                "plural": false,
                "selections": (v3/*: any*/),
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
    "name": "findByIdEmployeeHRPrDPDashboardStatsQuery",
    "selections": (v6/*: any*/),
    "type": "query_root",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "findByIdEmployeeHRPrDPDashboardStatsQuery",
    "selections": (v6/*: any*/)
  },
  "params": {
    "cacheID": "b612e97c4da31d96cda6219663a31263",
    "id": null,
    "metadata": {},
    "name": "findByIdEmployeeHRPrDPDashboardStatsQuery",
    "operationKind": "query",
    "text": "query findByIdEmployeeHRPrDPDashboardStatsQuery(\n  $id: bigint\n  $mon: date\n  $mon2: date\n  $mon3: date\n) {\n  hr_employees_connection(where: {id: {_eq: $id}}) {\n    edges {\n      node {\n        id\n        list_active_aggregate: document_list_aggregate(where: {removed: {_eq: false}, type: {_eq: \"PrDP\"}}) {\n          aggregate {\n            count\n          }\n        }\n        list_removed_aggregate: document_list_aggregate(where: {removed: {_eq: true}, type: {_eq: \"PrDP\"}}) {\n          aggregate {\n            count\n          }\n        }\n        list_no_expiry_aggregate: document_list_aggregate(where: {removed: {_eq: false}, expiry_date: {_is_null: true}, type: {_eq: \"PrDP\"}}) {\n          aggregate {\n            count\n          }\n        }\n        list_expired_aggregate: document_list_aggregate(where: {removed: {_eq: false}, expiry_date: {_lte: \"now()\"}, type: {_eq: \"PrDP\"}}) {\n          aggregate {\n            count\n          }\n        }\n        list_mon_expiry_aggregate: document_list_aggregate(where: {removed: {_eq: false}, expiry_date: {_gt: \"now()\", _lte: $mon}, type: {_eq: \"PrDP\"}}) {\n          aggregate {\n            count\n          }\n        }\n        list_2mon_expiry_aggregate: document_list_aggregate(where: {removed: {_eq: false}, expiry_date: {_gt: $mon, _lte: $mon2}, type: {_eq: \"PrDP\"}}) {\n          aggregate {\n            count\n          }\n        }\n        list_3mon_expiry_aggregate: document_list_aggregate(where: {removed: {_eq: false}, expiry_date: {_gt: $mon2, _lte: $mon3}, type: {_eq: \"PrDP\"}}) {\n          aggregate {\n            count\n          }\n        }\n        list_4mon_expiry_aggregate: document_list_aggregate(where: {removed: {_eq: false}, expiry_date: {_gt: $mon3}, type: {_eq: \"PrDP\"}}) {\n          aggregate {\n            count\n          }\n        }\n      }\n    }\n  }\n}\n"
  }
};
})();

node.hash = "e754c3e7f4f83905e67b443c5bcdb9e1";

module.exports = node;
