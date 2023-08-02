/**
 * @generated SignedSource<<41390136406a1d9965f393da9d01d88e>>
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
                "concreteType": "hr_employees_docs_job_appointments_aggregate",
                "kind": "LinkedField",
                "name": "job_appointment_list_aggregate",
                "plural": false,
                "selections": [
                  {
                    "alias": null,
                    "args": null,
                    "concreteType": "hr_employees_docs_job_appointments_aggregate_fields",
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
    "name": "findByIdCompanyHRJobAppointmentsDateRangeDashboardStatsQuery",
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
    "name": "findByIdCompanyHRJobAppointmentsDateRangeDashboardStatsQuery",
    "selections": (v3/*: any*/)
  },
  "params": {
    "cacheID": "249b80ab3ba865165b5b6519d71923f8",
    "id": null,
    "metadata": {},
    "name": "findByIdCompanyHRJobAppointmentsDateRangeDashboardStatsQuery",
    "operationKind": "query",
    "text": "query findByIdCompanyHRJobAppointmentsDateRangeDashboardStatsQuery(\n  $id: bigint\n  $dateStart: date\n  $dateEnd: date\n) {\n  default_companies_connection(where: {id: {_eq: $id}}) {\n    edges {\n      node {\n        id\n        list_aggregate: job_appointment_list_aggregate(where: {removed: {_eq: false}, expiry_date: {_gte: $dateStart, _lte: $dateEnd}}) {\n          aggregate {\n            count\n          }\n        }\n      }\n    }\n  }\n}\n"
  }
};
})();

node.hash = "ad114ee2c6e427caaff905cb01097534";

module.exports = node;
