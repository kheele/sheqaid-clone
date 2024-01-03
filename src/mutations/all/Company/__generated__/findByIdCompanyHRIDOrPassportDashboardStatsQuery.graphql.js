/**
 * @generated SignedSource<<3e54a4e0e3844ef513157ed239771aa4>>
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
v1 = [
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
v2 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "id",
  "storageKey": null
},
v3 = {
  "_eq": false
},
v4 = {
  "_eq": "ID/Passport"
},
v5 = [
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
v6 = {
  "kind": "Literal",
  "name": "removed",
  "value": (v3/*: any*/)
},
v7 = {
  "kind": "Literal",
  "name": "type",
  "value": (v4/*: any*/)
},
v8 = {
  "alias": null,
  "args": null,
  "concreteType": "hr_employees_aggregate",
  "kind": "LinkedField",
  "name": "employee_list_aggregate",
  "plural": false,
  "selections": [
    {
      "alias": null,
      "args": null,
      "concreteType": "hr_employees",
      "kind": "LinkedField",
      "name": "nodes",
      "plural": true,
      "selections": [
        (v2/*: any*/),
        {
          "alias": "list_active_aggregate",
          "args": [
            {
              "kind": "Literal",
              "name": "where",
              "value": {
                "removed": (v3/*: any*/),
                "type": (v4/*: any*/)
              }
            }
          ],
          "concreteType": "hr_employees_documents_aggregate",
          "kind": "LinkedField",
          "name": "document_list_aggregate",
          "plural": false,
          "selections": (v5/*: any*/),
          "storageKey": "document_list_aggregate(where:{\"removed\":{\"_eq\":false},\"type\":{\"_eq\":\"ID/Passport\"}})"
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
                "type": (v4/*: any*/)
              }
            }
          ],
          "concreteType": "hr_employees_documents_aggregate",
          "kind": "LinkedField",
          "name": "document_list_aggregate",
          "plural": false,
          "selections": (v5/*: any*/),
          "storageKey": "document_list_aggregate(where:{\"removed\":{\"_eq\":true},\"type\":{\"_eq\":\"ID/Passport\"}})"
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
                "removed": (v3/*: any*/),
                "type": (v4/*: any*/)
              }
            }
          ],
          "concreteType": "hr_employees_documents_aggregate",
          "kind": "LinkedField",
          "name": "document_list_aggregate",
          "plural": false,
          "selections": (v5/*: any*/),
          "storageKey": "document_list_aggregate(where:{\"expiry_date\":{\"_is_null\":true},\"removed\":{\"_eq\":false},\"type\":{\"_eq\":\"ID/Passport\"}})"
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
                "removed": (v3/*: any*/),
                "type": (v4/*: any*/)
              }
            }
          ],
          "concreteType": "hr_employees_documents_aggregate",
          "kind": "LinkedField",
          "name": "document_list_aggregate",
          "plural": false,
          "selections": (v5/*: any*/),
          "storageKey": "document_list_aggregate(where:{\"expiry_date\":{\"_lte\":\"now()\"},\"removed\":{\"_eq\":false},\"type\":{\"_eq\":\"ID/Passport\"}})"
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
                (v6/*: any*/),
                (v7/*: any*/)
              ],
              "kind": "ObjectValue",
              "name": "where"
            }
          ],
          "concreteType": "hr_employees_documents_aggregate",
          "kind": "LinkedField",
          "name": "document_list_aggregate",
          "plural": false,
          "selections": (v5/*: any*/),
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
                (v6/*: any*/),
                (v7/*: any*/)
              ],
              "kind": "ObjectValue",
              "name": "where"
            }
          ],
          "concreteType": "hr_employees_documents_aggregate",
          "kind": "LinkedField",
          "name": "document_list_aggregate",
          "plural": false,
          "selections": (v5/*: any*/),
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
                (v6/*: any*/),
                (v7/*: any*/)
              ],
              "kind": "ObjectValue",
              "name": "where"
            }
          ],
          "concreteType": "hr_employees_documents_aggregate",
          "kind": "LinkedField",
          "name": "document_list_aggregate",
          "plural": false,
          "selections": (v5/*: any*/),
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
                (v6/*: any*/),
                (v7/*: any*/)
              ],
              "kind": "ObjectValue",
              "name": "where"
            }
          ],
          "concreteType": "hr_employees_documents_aggregate",
          "kind": "LinkedField",
          "name": "document_list_aggregate",
          "plural": false,
          "selections": (v5/*: any*/),
          "storageKey": null
        }
      ],
      "storageKey": null
    }
  ],
  "storageKey": null
};
return {
  "fragment": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Fragment",
    "metadata": null,
    "name": "findByIdCompanyHRIDOrPassportDashboardStatsQuery",
    "selections": [
      {
        "alias": null,
        "args": (v1/*: any*/),
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
                  (v8/*: any*/)
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
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "findByIdCompanyHRIDOrPassportDashboardStatsQuery",
    "selections": [
      {
        "alias": null,
        "args": (v1/*: any*/),
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
                  (v8/*: any*/),
                  (v2/*: any*/)
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
    "cacheID": "6e7f51fb7255d2cf06be0e3aab701b76",
    "id": null,
    "metadata": {},
    "name": "findByIdCompanyHRIDOrPassportDashboardStatsQuery",
    "operationKind": "query",
    "text": "query findByIdCompanyHRIDOrPassportDashboardStatsQuery(\n  $id: bigint\n  $mon: date\n  $mon2: date\n  $mon3: date\n) {\n  default_companies_connection(where: {id: {_eq: $id}}) {\n    edges {\n      node {\n        employee_list_aggregate {\n          nodes {\n            id\n            list_active_aggregate: document_list_aggregate(where: {removed: {_eq: false}, type: {_eq: \"ID/Passport\"}}) {\n              aggregate {\n                count\n              }\n            }\n            list_removed_aggregate: document_list_aggregate(where: {removed: {_eq: true}, type: {_eq: \"ID/Passport\"}}) {\n              aggregate {\n                count\n              }\n            }\n            list_no_expiry_aggregate: document_list_aggregate(where: {removed: {_eq: false}, expiry_date: {_is_null: true}, type: {_eq: \"ID/Passport\"}}) {\n              aggregate {\n                count\n              }\n            }\n            list_expired_aggregate: document_list_aggregate(where: {removed: {_eq: false}, expiry_date: {_lte: \"now()\"}, type: {_eq: \"ID/Passport\"}}) {\n              aggregate {\n                count\n              }\n            }\n            list_mon_expiry_aggregate: document_list_aggregate(where: {removed: {_eq: false}, expiry_date: {_gt: \"now()\", _lte: $mon}, type: {_eq: \"ID/Passport\"}}) {\n              aggregate {\n                count\n              }\n            }\n            list_2mon_expiry_aggregate: document_list_aggregate(where: {removed: {_eq: false}, expiry_date: {_gt: $mon, _lte: $mon2}, type: {_eq: \"ID/Passport\"}}) {\n              aggregate {\n                count\n              }\n            }\n            list_3mon_expiry_aggregate: document_list_aggregate(where: {removed: {_eq: false}, expiry_date: {_gt: $mon2, _lte: $mon3}, type: {_eq: \"ID/Passport\"}}) {\n              aggregate {\n                count\n              }\n            }\n            list_4mon_expiry_aggregate: document_list_aggregate(where: {removed: {_eq: false}, expiry_date: {_gt: $mon3}, type: {_eq: \"ID/Passport\"}}) {\n              aggregate {\n                count\n              }\n            }\n          }\n        }\n        id\n      }\n    }\n  }\n}\n"
  }
};
})();

node.hash = "953922138fc923c8d0498fbc89e455db";

module.exports = node;
