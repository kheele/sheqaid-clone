/**
 * @generated SignedSource<<e196b00a372cba8fac3df9d943a2434e>>
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
  }
],
v1 = [
  {
    "alias": null,
    "args": null,
    "kind": "ScalarField",
    "name": "count",
    "storageKey": null
  }
],
v2 = {
  "kind": "Literal",
  "name": "distinct",
  "value": true
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
    "concreteType": "default_projectsConnection",
    "kind": "LinkedField",
    "name": "default_projects_connection",
    "plural": false,
    "selections": [
      {
        "alias": null,
        "args": null,
        "concreteType": "default_projectsEdge",
        "kind": "LinkedField",
        "name": "edges",
        "plural": true,
        "selections": [
          {
            "alias": null,
            "args": null,
            "concreteType": "default_projects",
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
                "alias": "cost_list_aggregate",
                "args": null,
                "concreteType": "sheq_training_matrices_aggregate",
                "kind": "LinkedField",
                "name": "training_matrix_list_aggregate",
                "plural": false,
                "selections": [
                  {
                    "alias": null,
                    "args": null,
                    "concreteType": "sheq_training_matrices_aggregate_fields",
                    "kind": "LinkedField",
                    "name": "aggregate",
                    "plural": false,
                    "selections": [
                      {
                        "alias": null,
                        "args": null,
                        "concreteType": "sheq_training_matrices_sum_fields",
                        "kind": "LinkedField",
                        "name": "sum",
                        "plural": false,
                        "selections": [
                          {
                            "alias": null,
                            "args": null,
                            "kind": "ScalarField",
                            "name": "cost",
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
              },
              {
                "alias": "training_list_aggregate",
                "args": null,
                "concreteType": "sheq_training_matrices_aggregate",
                "kind": "LinkedField",
                "name": "training_matrix_list_aggregate",
                "plural": false,
                "selections": [
                  {
                    "alias": null,
                    "args": null,
                    "concreteType": "sheq_training_matrices_aggregate_fields",
                    "kind": "LinkedField",
                    "name": "aggregate",
                    "plural": false,
                    "selections": (v1/*: any*/),
                    "storageKey": null
                  }
                ],
                "storageKey": null
              },
              {
                "alias": "participant_list_aggregate",
                "args": [
                  {
                    "kind": "Literal",
                    "name": "where",
                    "value": {
                      "completion_status": {
                        "_eq": "Completed"
                      }
                    }
                  }
                ],
                "concreteType": "sheq_training_plans__employee_training_aggregate",
                "kind": "LinkedField",
                "name": "training_plan_list_aggregate",
                "plural": false,
                "selections": [
                  {
                    "alias": null,
                    "args": null,
                    "concreteType": "sheq_training_plans__employee_training_aggregate_fields",
                    "kind": "LinkedField",
                    "name": "aggregate",
                    "plural": false,
                    "selections": [
                      {
                        "alias": null,
                        "args": [
                          {
                            "kind": "Literal",
                            "name": "columns",
                            "value": "employee_id"
                          },
                          (v2/*: any*/)
                        ],
                        "kind": "ScalarField",
                        "name": "count",
                        "storageKey": "count(columns:\"employee_id\",distinct:true)"
                      }
                    ],
                    "storageKey": null
                  }
                ],
                "storageKey": "training_plan_list_aggregate(where:{\"completion_status\":{\"_eq\":\"Completed\"}})"
              },
              {
                "alias": null,
                "args": null,
                "concreteType": "sheq_training_courses_aggregate",
                "kind": "LinkedField",
                "name": "training_course_list_aggregate",
                "plural": false,
                "selections": [
                  {
                    "alias": null,
                    "args": null,
                    "concreteType": "sheq_training_courses_aggregate_fields",
                    "kind": "LinkedField",
                    "name": "aggregate",
                    "plural": false,
                    "selections": (v1/*: any*/),
                    "storageKey": null
                  }
                ],
                "storageKey": null
              },
              {
                "alias": "institution_list_aggregate",
                "args": null,
                "concreteType": "sheq_training_matrices_aggregate",
                "kind": "LinkedField",
                "name": "training_matrix_list_aggregate",
                "plural": false,
                "selections": [
                  {
                    "alias": null,
                    "args": null,
                    "concreteType": "sheq_training_matrices_aggregate_fields",
                    "kind": "LinkedField",
                    "name": "aggregate",
                    "plural": false,
                    "selections": [
                      {
                        "alias": null,
                        "args": [
                          {
                            "kind": "Literal",
                            "name": "columns",
                            "value": "institution_conducting_training"
                          },
                          (v2/*: any*/)
                        ],
                        "kind": "ScalarField",
                        "name": "count",
                        "storageKey": "count(columns:\"institution_conducting_training\",distinct:true)"
                      }
                    ],
                    "storageKey": null
                  }
                ],
                "storageKey": null
              },
              {
                "alias": "trainer_internal_list_aggregate",
                "args": null,
                "concreteType": "sheq_training_matrices_aggregate",
                "kind": "LinkedField",
                "name": "training_matrix_list_aggregate",
                "plural": false,
                "selections": [
                  {
                    "alias": null,
                    "args": null,
                    "concreteType": "sheq_training_matrices_aggregate_fields",
                    "kind": "LinkedField",
                    "name": "aggregate",
                    "plural": false,
                    "selections": [
                      {
                        "alias": null,
                        "args": [
                          {
                            "kind": "Literal",
                            "name": "columns",
                            "value": "trainer_id"
                          },
                          (v2/*: any*/)
                        ],
                        "kind": "ScalarField",
                        "name": "count",
                        "storageKey": "count(columns:\"trainer_id\",distinct:true)"
                      }
                    ],
                    "storageKey": null
                  }
                ],
                "storageKey": null
              },
              {
                "alias": "trainer_external_list_aggregate",
                "args": null,
                "concreteType": "sheq_training_matrices_aggregate",
                "kind": "LinkedField",
                "name": "training_matrix_list_aggregate",
                "plural": false,
                "selections": [
                  {
                    "alias": null,
                    "args": null,
                    "concreteType": "sheq_training_matrices_aggregate_fields",
                    "kind": "LinkedField",
                    "name": "aggregate",
                    "plural": false,
                    "selections": [
                      {
                        "alias": null,
                        "args": [
                          {
                            "kind": "Literal",
                            "name": "columns",
                            "value": "trainer_external_id"
                          },
                          (v2/*: any*/)
                        ],
                        "kind": "ScalarField",
                        "name": "count",
                        "storageKey": "count(columns:\"trainer_external_id\",distinct:true)"
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
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Fragment",
    "metadata": null,
    "name": "findByIdProjectTrainingDashboardStatsQuery",
    "selections": (v3/*: any*/),
    "type": "query_root",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "findByIdProjectTrainingDashboardStatsQuery",
    "selections": (v3/*: any*/)
  },
  "params": {
    "cacheID": "caa8c10547cb86fc34181a68c3e8769d",
    "id": null,
    "metadata": {},
    "name": "findByIdProjectTrainingDashboardStatsQuery",
    "operationKind": "query",
    "text": "query findByIdProjectTrainingDashboardStatsQuery(\n  $id: bigint\n) {\n  default_projects_connection(where: {id: {_eq: $id}}) {\n    edges {\n      node {\n        id\n        cost_list_aggregate: training_matrix_list_aggregate {\n          aggregate {\n            sum {\n              cost\n            }\n          }\n        }\n        training_list_aggregate: training_matrix_list_aggregate {\n          aggregate {\n            count\n          }\n        }\n        participant_list_aggregate: training_plan_list_aggregate(where: {completion_status: {_eq: \"Completed\"}}) {\n          aggregate {\n            count(distinct: true, columns: employee_id)\n          }\n        }\n        training_course_list_aggregate {\n          aggregate {\n            count\n          }\n        }\n        institution_list_aggregate: training_matrix_list_aggregate {\n          aggregate {\n            count(distinct: true, columns: institution_conducting_training)\n          }\n        }\n        trainer_internal_list_aggregate: training_matrix_list_aggregate {\n          aggregate {\n            count(distinct: true, columns: trainer_id)\n          }\n        }\n        trainer_external_list_aggregate: training_matrix_list_aggregate {\n          aggregate {\n            count(distinct: true, columns: trainer_external_id)\n          }\n        }\n      }\n    }\n  }\n}\n"
  }
};
})();

node.hash = "b62c96952cc92faddb85789bfcffb928";

module.exports = node;
