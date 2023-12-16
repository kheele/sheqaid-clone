/**
 * @generated SignedSource<<5ca5b3bca68fef4d119e8f7dd3ac8a87>>
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
  "name": "created_at",
  "storageKey": null
},
v3 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "fname",
  "storageKey": null
},
v4 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "lname",
  "storageKey": null
},
v5 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "email",
  "storageKey": null
},
v6 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "phone",
  "storageKey": null
},
v7 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "dob",
  "storageKey": null
},
v8 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "id_num",
  "storageKey": null
},
v9 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "passport_num",
  "storageKey": null
},
v10 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "profile_pic",
  "storageKey": null
},
v11 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "employment_num",
  "storageKey": null
},
v12 = [
  {
    "kind": "Literal",
    "name": "where",
    "value": {
      "removed": {
        "_eq": false
      }
    }
  }
],
v13 = [
  {
    "alias": null,
    "args": null,
    "kind": "ScalarField",
    "name": "count",
    "storageKey": null
  }
],
v14 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "name",
  "storageKey": null
},
v15 = [
  (v1/*: any*/),
  (v14/*: any*/)
],
v16 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "doc",
  "storageKey": null
},
v17 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "is_default",
  "storageKey": null
},
v18 = {
  "kind": "Literal",
  "name": "distinct",
  "value": true
},
v19 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "unit_standard",
  "storageKey": null
},
v20 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "unit_standard_desc",
  "storageKey": null
},
v21 = {
  "alias": null,
  "args": null,
  "concreteType": "sheq_training_courses",
  "kind": "LinkedField",
  "name": "course",
  "plural": false,
  "selections": [
    (v1/*: any*/),
    (v14/*: any*/),
    (v19/*: any*/),
    (v20/*: any*/)
  ],
  "storageKey": null
},
v22 = {
  "alias": null,
  "args": null,
  "concreteType": "sheq_training_courses",
  "kind": "LinkedField",
  "name": "course",
  "plural": false,
  "selections": (v15/*: any*/),
  "storageKey": null
},
v23 = {
  "alias": null,
  "args": null,
  "concreteType": "sheq_training_matrices",
  "kind": "LinkedField",
  "name": "training",
  "plural": false,
  "selections": [
    (v1/*: any*/),
    (v22/*: any*/)
  ],
  "storageKey": null
},
v24 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "date_range_start",
  "storageKey": null
},
v25 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "date_range_end",
  "storageKey": null
},
v26 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "training_standard",
  "storageKey": null
},
v27 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "credits",
  "storageKey": null
},
v28 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "nqf_level",
  "storageKey": null
},
v29 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "requirement",
  "storageKey": null
},
v30 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "provider_requirement",
  "storageKey": null
},
v31 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "requirement_legal",
  "storageKey": null
},
v32 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "training_frequency",
  "storageKey": null
},
v33 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "cost",
  "storageKey": null
},
v34 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "type",
  "storageKey": null
},
v35 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "expiry_date",
  "storageKey": null
},
v36 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "expiry_updated",
  "storageKey": null
},
v37 = {
  "alias": null,
  "args": null,
  "concreteType": "hr_employees",
  "kind": "LinkedField",
  "name": "employee",
  "plural": false,
  "selections": [
    (v1/*: any*/)
  ],
  "storageKey": null
},
v38 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "removed",
  "storageKey": null
},
v39 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "notes",
  "storageKey": null
},
v40 = [
  (v1/*: any*/),
  (v3/*: any*/),
  (v4/*: any*/),
  (v5/*: any*/),
  (v6/*: any*/),
  (v8/*: any*/),
  (v9/*: any*/),
  (v10/*: any*/),
  (v11/*: any*/)
],
v41 = [
  (v1/*: any*/),
  {
    "alias": null,
    "args": null,
    "concreteType": "hr_employees",
    "kind": "LinkedField",
    "name": "witness",
    "plural": false,
    "selections": (v40/*: any*/),
    "storageKey": null
  }
],
v42 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "date",
  "storageKey": null
},
v43 = [
  (v1/*: any*/),
  (v2/*: any*/),
  (v38/*: any*/),
  (v39/*: any*/),
  (v16/*: any*/),
  (v42/*: any*/),
  (v35/*: any*/),
  (v36/*: any*/)
],
v44 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "employee_comments",
  "storageKey": null
},
v45 = [
  {
    "alias": null,
    "args": null,
    "concreteType": "hr_employees_documents_aggregate_fields",
    "kind": "LinkedField",
    "name": "aggregate",
    "plural": false,
    "selections": (v13/*: any*/),
    "storageKey": null
  }
],
v46 = [
  (v1/*: any*/),
  (v3/*: any*/),
  (v4/*: any*/),
  (v5/*: any*/),
  (v6/*: any*/)
],
v47 = [
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
              (v1/*: any*/),
              (v2/*: any*/),
              (v3/*: any*/),
              (v4/*: any*/),
              {
                "alias": null,
                "args": null,
                "kind": "ScalarField",
                "name": "full_name",
                "storageKey": null
              },
              (v5/*: any*/),
              (v6/*: any*/),
              (v7/*: any*/),
              {
                "alias": null,
                "args": null,
                "kind": "ScalarField",
                "name": "sex",
                "storageKey": null
              },
              (v8/*: any*/),
              (v9/*: any*/),
              (v10/*: any*/),
              (v11/*: any*/),
              {
                "alias": null,
                "args": null,
                "kind": "ScalarField",
                "name": "employment_date",
                "storageKey": null
              },
              {
                "alias": null,
                "args": (v12/*: any*/),
                "concreteType": "default_contractor_questionnaires_aggregate",
                "kind": "LinkedField",
                "name": "job_observation_list_aggregate",
                "plural": false,
                "selections": [
                  {
                    "alias": null,
                    "args": null,
                    "concreteType": "default_contractor_questionnaires_aggregate_fields",
                    "kind": "LinkedField",
                    "name": "aggregate",
                    "plural": false,
                    "selections": (v13/*: any*/),
                    "storageKey": null
                  }
                ],
                "storageKey": "job_observation_list_aggregate(where:{\"removed\":{\"_eq\":false}})"
              },
              {
                "alias": null,
                "args": null,
                "concreteType": "default_contractor_questionnaires",
                "kind": "LinkedField",
                "name": "job_observation_list",
                "plural": true,
                "selections": (v15/*: any*/),
                "storageKey": null
              },
              {
                "alias": null,
                "args": null,
                "concreteType": "hr_employees_banking_details_aggregate",
                "kind": "LinkedField",
                "name": "banking_detail_list_aggregate",
                "plural": false,
                "selections": [
                  {
                    "alias": null,
                    "args": null,
                    "concreteType": "hr_employees_banking_details_aggregate_fields",
                    "kind": "LinkedField",
                    "name": "aggregate",
                    "plural": false,
                    "selections": (v13/*: any*/),
                    "storageKey": null
                  }
                ],
                "storageKey": null
              },
              {
                "alias": null,
                "args": null,
                "concreteType": "hr_employees_banking_details",
                "kind": "LinkedField",
                "name": "banking_detail_list",
                "plural": true,
                "selections": [
                  (v1/*: any*/),
                  (v2/*: any*/),
                  (v14/*: any*/),
                  {
                    "alias": null,
                    "args": null,
                    "kind": "ScalarField",
                    "name": "account_num",
                    "storageKey": null
                  },
                  {
                    "alias": null,
                    "args": null,
                    "kind": "ScalarField",
                    "name": "code",
                    "storageKey": null
                  },
                  {
                    "alias": null,
                    "args": null,
                    "kind": "ScalarField",
                    "name": "branch",
                    "storageKey": null
                  },
                  (v16/*: any*/),
                  (v17/*: any*/)
                ],
                "storageKey": null
              },
              {
                "alias": null,
                "args": null,
                "concreteType": "hr_employees_living_address_aggregate",
                "kind": "LinkedField",
                "name": "living_address_list_aggregate",
                "plural": false,
                "selections": [
                  {
                    "alias": null,
                    "args": null,
                    "concreteType": "hr_employees_living_address_aggregate_fields",
                    "kind": "LinkedField",
                    "name": "aggregate",
                    "plural": false,
                    "selections": (v13/*: any*/),
                    "storageKey": null
                  }
                ],
                "storageKey": null
              },
              {
                "alias": null,
                "args": null,
                "concreteType": "hr_employees_living_address",
                "kind": "LinkedField",
                "name": "living_address_list",
                "plural": true,
                "selections": [
                  (v1/*: any*/),
                  (v2/*: any*/),
                  {
                    "alias": null,
                    "args": null,
                    "kind": "ScalarField",
                    "name": "local_address",
                    "storageKey": null
                  },
                  {
                    "alias": null,
                    "args": null,
                    "kind": "ScalarField",
                    "name": "street_address",
                    "storageKey": null
                  },
                  (v16/*: any*/),
                  (v17/*: any*/),
                  {
                    "alias": null,
                    "args": null,
                    "concreteType": "default_countries",
                    "kind": "LinkedField",
                    "name": "country",
                    "plural": false,
                    "selections": (v15/*: any*/),
                    "storageKey": null
                  },
                  {
                    "alias": null,
                    "args": null,
                    "concreteType": "default_zones",
                    "kind": "LinkedField",
                    "name": "zone",
                    "plural": false,
                    "selections": (v15/*: any*/),
                    "storageKey": null
                  },
                  {
                    "alias": null,
                    "args": null,
                    "concreteType": "default_cities",
                    "kind": "LinkedField",
                    "name": "city",
                    "plural": false,
                    "selections": (v15/*: any*/),
                    "storageKey": null
                  }
                ],
                "storageKey": null
              },
              {
                "alias": null,
                "args": null,
                "concreteType": "hr_employees_dependents_aggregate",
                "kind": "LinkedField",
                "name": "dependent_list_aggregate",
                "plural": false,
                "selections": [
                  {
                    "alias": null,
                    "args": null,
                    "concreteType": "hr_employees_dependents_aggregate_fields",
                    "kind": "LinkedField",
                    "name": "aggregate",
                    "plural": false,
                    "selections": (v13/*: any*/),
                    "storageKey": null
                  }
                ],
                "storageKey": null
              },
              {
                "alias": null,
                "args": null,
                "concreteType": "hr_employees_dependents",
                "kind": "LinkedField",
                "name": "dependent_list",
                "plural": true,
                "selections": [
                  (v1/*: any*/),
                  (v3/*: any*/),
                  (v4/*: any*/),
                  (v7/*: any*/),
                  {
                    "alias": null,
                    "args": null,
                    "kind": "ScalarField",
                    "name": "gender",
                    "storageKey": null
                  }
                ],
                "storageKey": null
              },
              {
                "alias": null,
                "args": null,
                "concreteType": "hr_employees_next_of_kin_aggregate",
                "kind": "LinkedField",
                "name": "next_of_kin_list_aggregate",
                "plural": false,
                "selections": [
                  {
                    "alias": null,
                    "args": null,
                    "concreteType": "hr_employees_next_of_kin_aggregate_fields",
                    "kind": "LinkedField",
                    "name": "aggregate",
                    "plural": false,
                    "selections": (v13/*: any*/),
                    "storageKey": null
                  }
                ],
                "storageKey": null
              },
              {
                "alias": null,
                "args": null,
                "concreteType": "hr_employees_next_of_kin",
                "kind": "LinkedField",
                "name": "next_of_kin_list",
                "plural": true,
                "selections": [
                  (v1/*: any*/),
                  (v3/*: any*/),
                  (v4/*: any*/),
                  {
                    "alias": null,
                    "args": null,
                    "kind": "ScalarField",
                    "name": "phone1",
                    "storageKey": null
                  },
                  {
                    "alias": null,
                    "args": null,
                    "kind": "ScalarField",
                    "name": "phone2",
                    "storageKey": null
                  },
                  {
                    "alias": null,
                    "args": null,
                    "kind": "ScalarField",
                    "name": "relationship",
                    "storageKey": null
                  }
                ],
                "storageKey": null
              },
              {
                "alias": "training_course_list_aggregate",
                "args": null,
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
                            "value": "course_id"
                          },
                          (v18/*: any*/)
                        ],
                        "kind": "ScalarField",
                        "name": "count",
                        "storageKey": "count(columns:\"course_id\",distinct:true)"
                      }
                    ],
                    "storageKey": null
                  }
                ],
                "storageKey": null
              },
              {
                "alias": "training_course_list",
                "args": [
                  {
                    "kind": "Literal",
                    "name": "distinct_on",
                    "value": [
                      "course_id"
                    ]
                  }
                ],
                "concreteType": "sheq_training_plans__employee_training",
                "kind": "LinkedField",
                "name": "training_plan_list",
                "plural": true,
                "selections": [
                  (v1/*: any*/),
                  (v21/*: any*/)
                ],
                "storageKey": "training_plan_list(distinct_on:[\"course_id\"])"
              },
              {
                "alias": null,
                "args": null,
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
                    "selections": (v13/*: any*/),
                    "storageKey": null
                  }
                ],
                "storageKey": null
              },
              {
                "alias": null,
                "args": null,
                "concreteType": "sheq_training_plans__employee_training",
                "kind": "LinkedField",
                "name": "training_plan_list",
                "plural": true,
                "selections": [
                  (v1/*: any*/),
                  (v2/*: any*/),
                  {
                    "alias": null,
                    "args": null,
                    "kind": "ScalarField",
                    "name": "completion_status",
                    "storageKey": null
                  },
                  {
                    "alias": null,
                    "args": null,
                    "kind": "ScalarField",
                    "name": "result_status",
                    "storageKey": null
                  },
                  {
                    "alias": null,
                    "args": null,
                    "kind": "ScalarField",
                    "name": "result",
                    "storageKey": null
                  },
                  {
                    "alias": null,
                    "args": null,
                    "kind": "ScalarField",
                    "name": "year",
                    "storageKey": null
                  },
                  (v22/*: any*/),
                  (v23/*: any*/)
                ],
                "storageKey": null
              },
              {
                "alias": "training_matrix_list_aggregate",
                "args": null,
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
                            "value": "training_id"
                          },
                          (v18/*: any*/)
                        ],
                        "kind": "ScalarField",
                        "name": "count",
                        "storageKey": "count(columns:\"training_id\",distinct:true)"
                      }
                    ],
                    "storageKey": null
                  }
                ],
                "storageKey": null
              },
              {
                "alias": "training_matrix_list",
                "args": [
                  {
                    "kind": "Literal",
                    "name": "distinct_on",
                    "value": [
                      "training_id"
                    ]
                  }
                ],
                "concreteType": "sheq_training_plans__employee_training",
                "kind": "LinkedField",
                "name": "training_plan_list",
                "plural": true,
                "selections": [
                  (v1/*: any*/),
                  {
                    "alias": null,
                    "args": null,
                    "concreteType": "sheq_training_matrices",
                    "kind": "LinkedField",
                    "name": "training",
                    "plural": false,
                    "selections": [
                      (v1/*: any*/),
                      (v24/*: any*/),
                      (v25/*: any*/),
                      (v26/*: any*/),
                      (v19/*: any*/),
                      (v20/*: any*/),
                      (v27/*: any*/),
                      (v28/*: any*/),
                      (v29/*: any*/),
                      (v30/*: any*/),
                      (v31/*: any*/),
                      (v32/*: any*/),
                      (v33/*: any*/),
                      (v21/*: any*/)
                    ],
                    "storageKey": null
                  }
                ],
                "storageKey": "training_plan_list(distinct_on:[\"training_id\"])"
              },
              {
                "alias": null,
                "args": (v12/*: any*/),
                "concreteType": "hr_employees_docs_competencies_aggregate",
                "kind": "LinkedField",
                "name": "competency_list_aggregate",
                "plural": false,
                "selections": [
                  {
                    "alias": null,
                    "args": null,
                    "concreteType": "hr_employees_docs_competencies_aggregate_fields",
                    "kind": "LinkedField",
                    "name": "aggregate",
                    "plural": false,
                    "selections": (v13/*: any*/),
                    "storageKey": null
                  }
                ],
                "storageKey": "competency_list_aggregate(where:{\"removed\":{\"_eq\":false}})"
              },
              {
                "alias": null,
                "args": (v12/*: any*/),
                "concreteType": "hr_employees_docs_competencies",
                "kind": "LinkedField",
                "name": "competency_list",
                "plural": true,
                "selections": [
                  (v1/*: any*/),
                  (v2/*: any*/),
                  {
                    "alias": null,
                    "args": null,
                    "kind": "ScalarField",
                    "name": "accreditation_num",
                    "storageKey": null
                  },
                  {
                    "alias": null,
                    "args": null,
                    "kind": "ScalarField",
                    "name": "competency_type",
                    "storageKey": null
                  },
                  (v34/*: any*/),
                  (v16/*: any*/),
                  {
                    "alias": null,
                    "args": null,
                    "kind": "ScalarField",
                    "name": "issued_date",
                    "storageKey": null
                  },
                  (v35/*: any*/),
                  (v36/*: any*/),
                  (v37/*: any*/),
                  (v23/*: any*/)
                ],
                "storageKey": "competency_list(where:{\"removed\":{\"_eq\":false}})"
              },
              {
                "alias": null,
                "args": (v12/*: any*/),
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
                    "selections": (v13/*: any*/),
                    "storageKey": null
                  }
                ],
                "storageKey": "contract_list_aggregate(where:{\"removed\":{\"_eq\":false}})"
              },
              {
                "alias": null,
                "args": (v12/*: any*/),
                "concreteType": "hr_employees_docs_contracts",
                "kind": "LinkedField",
                "name": "contract_list",
                "plural": true,
                "selections": [
                  (v1/*: any*/),
                  (v2/*: any*/),
                  (v16/*: any*/),
                  {
                    "alias": null,
                    "args": null,
                    "kind": "ScalarField",
                    "name": "job_profile_doc",
                    "storageKey": null
                  },
                  (v36/*: any*/),
                  (v38/*: any*/),
                  (v37/*: any*/),
                  {
                    "alias": null,
                    "args": null,
                    "concreteType": "hr_employees_docs_contracts_details",
                    "kind": "LinkedField",
                    "name": "contract_details",
                    "plural": true,
                    "selections": [
                      (v1/*: any*/),
                      {
                        "alias": null,
                        "args": null,
                        "kind": "ScalarField",
                        "name": "contract_type",
                        "storageKey": null
                      },
                      {
                        "alias": null,
                        "args": null,
                        "kind": "ScalarField",
                        "name": "daily_working_hours",
                        "storageKey": null
                      },
                      {
                        "alias": null,
                        "args": null,
                        "kind": "ScalarField",
                        "name": "end_of_trial_period",
                        "storageKey": null
                      },
                      {
                        "alias": null,
                        "args": null,
                        "kind": "ScalarField",
                        "name": "end_time",
                        "storageKey": null
                      },
                      (v35/*: any*/),
                      (v39/*: any*/),
                      {
                        "alias": null,
                        "args": null,
                        "kind": "ScalarField",
                        "name": "start_date",
                        "storageKey": null
                      },
                      {
                        "alias": null,
                        "args": null,
                        "kind": "ScalarField",
                        "name": "start_time",
                        "storageKey": null
                      }
                    ],
                    "storageKey": null
                  },
                  {
                    "alias": null,
                    "args": null,
                    "concreteType": "hr_employees_docs_contracts_salary_info",
                    "kind": "LinkedField",
                    "name": "salary_info",
                    "plural": true,
                    "selections": [
                      (v1/*: any*/),
                      {
                        "alias": null,
                        "args": null,
                        "concreteType": "hr_employees_docs_contracts_salary_deductibles",
                        "kind": "LinkedField",
                        "name": "deductible_list",
                        "plural": true,
                        "selections": [
                          (v1/*: any*/),
                          (v2/*: any*/),
                          {
                            "alias": null,
                            "args": null,
                            "kind": "ScalarField",
                            "name": "text",
                            "storageKey": null
                          },
                          {
                            "alias": null,
                            "args": null,
                            "kind": "ScalarField",
                            "name": "value",
                            "storageKey": null
                          }
                        ],
                        "storageKey": null
                      },
                      {
                        "alias": null,
                        "args": null,
                        "kind": "ScalarField",
                        "name": "payment_type",
                        "storageKey": null
                      },
                      {
                        "alias": null,
                        "args": null,
                        "kind": "ScalarField",
                        "name": "salary",
                        "storageKey": null
                      },
                      {
                        "alias": null,
                        "args": null,
                        "kind": "ScalarField",
                        "name": "salary_interval",
                        "storageKey": null
                      },
                      {
                        "alias": null,
                        "args": null,
                        "kind": "ScalarField",
                        "name": "wage",
                        "storageKey": null
                      }
                    ],
                    "storageKey": null
                  }
                ],
                "storageKey": "contract_list(where:{\"removed\":{\"_eq\":false}})"
              },
              {
                "alias": null,
                "args": (v12/*: any*/),
                "concreteType": "hr_employees_docs_counsellings_aggregate",
                "kind": "LinkedField",
                "name": "counselling_list_aggregate",
                "plural": false,
                "selections": [
                  {
                    "alias": null,
                    "args": null,
                    "concreteType": "hr_employees_docs_counsellings_aggregate_fields",
                    "kind": "LinkedField",
                    "name": "aggregate",
                    "plural": false,
                    "selections": (v13/*: any*/),
                    "storageKey": null
                  }
                ],
                "storageKey": "counselling_list_aggregate(where:{\"removed\":{\"_eq\":false}})"
              },
              {
                "alias": null,
                "args": (v12/*: any*/),
                "concreteType": "hr_employees_docs_counsellings",
                "kind": "LinkedField",
                "name": "counselling_list",
                "plural": true,
                "selections": [
                  (v1/*: any*/),
                  (v2/*: any*/),
                  (v16/*: any*/),
                  {
                    "alias": null,
                    "args": null,
                    "kind": "ScalarField",
                    "name": "corrective_actions",
                    "storageKey": null
                  },
                  {
                    "alias": null,
                    "args": null,
                    "kind": "ScalarField",
                    "name": "counselling_hrs_to_complete",
                    "storageKey": null
                  },
                  (v35/*: any*/),
                  (v36/*: any*/),
                  (v38/*: any*/),
                  {
                    "alias": null,
                    "args": null,
                    "kind": "ScalarField",
                    "name": "incident_desc",
                    "storageKey": null
                  },
                  {
                    "alias": null,
                    "args": null,
                    "kind": "ScalarField",
                    "name": "reasons",
                    "storageKey": null
                  },
                  {
                    "alias": null,
                    "args": null,
                    "kind": "ScalarField",
                    "name": "types",
                    "storageKey": null
                  },
                  {
                    "alias": null,
                    "args": null,
                    "concreteType": "hr_employees",
                    "kind": "LinkedField",
                    "name": "responsible_person",
                    "plural": false,
                    "selections": (v40/*: any*/),
                    "storageKey": null
                  },
                  {
                    "alias": null,
                    "args": null,
                    "concreteType": "proxy_employees_docs_counselling__witness",
                    "kind": "LinkedField",
                    "name": "witness_list",
                    "plural": true,
                    "selections": (v41/*: any*/),
                    "storageKey": null
                  }
                ],
                "storageKey": "counselling_list(where:{\"removed\":{\"_eq\":false}})"
              },
              {
                "alias": null,
                "args": (v12/*: any*/),
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
                    "selections": (v13/*: any*/),
                    "storageKey": null
                  }
                ],
                "storageKey": "job_appointment_list_aggregate(where:{\"removed\":{\"_eq\":false}})"
              },
              {
                "alias": null,
                "args": (v12/*: any*/),
                "concreteType": "hr_employees_docs_job_appointments",
                "kind": "LinkedField",
                "name": "job_appointment_list",
                "plural": true,
                "selections": (v43/*: any*/),
                "storageKey": "job_appointment_list(where:{\"removed\":{\"_eq\":false}})"
              },
              {
                "alias": null,
                "args": (v12/*: any*/),
                "concreteType": "hr_employees_docs_leaves_aggregate",
                "kind": "LinkedField",
                "name": "leave_list_aggregate",
                "plural": false,
                "selections": [
                  {
                    "alias": null,
                    "args": null,
                    "concreteType": "hr_employees_docs_leaves_aggregate_fields",
                    "kind": "LinkedField",
                    "name": "aggregate",
                    "plural": false,
                    "selections": (v13/*: any*/),
                    "storageKey": null
                  }
                ],
                "storageKey": "leave_list_aggregate(where:{\"removed\":{\"_eq\":false}})"
              },
              {
                "alias": null,
                "args": (v12/*: any*/),
                "concreteType": "hr_employees_docs_leaves",
                "kind": "LinkedField",
                "name": "leave_list",
                "plural": true,
                "selections": [
                  (v1/*: any*/),
                  (v2/*: any*/),
                  {
                    "alias": null,
                    "args": null,
                    "kind": "ScalarField",
                    "name": "days_booked",
                    "storageKey": null
                  },
                  {
                    "alias": null,
                    "args": null,
                    "kind": "ScalarField",
                    "name": "due_to",
                    "storageKey": null
                  },
                  (v38/*: any*/),
                  (v34/*: any*/),
                  (v44/*: any*/),
                  {
                    "alias": null,
                    "args": null,
                    "kind": "ScalarField",
                    "name": "reason",
                    "storageKey": null
                  },
                  (v39/*: any*/),
                  (v16/*: any*/),
                  (v42/*: any*/),
                  (v35/*: any*/),
                  (v36/*: any*/)
                ],
                "storageKey": "leave_list(where:{\"removed\":{\"_eq\":false}})"
              },
              {
                "alias": null,
                "args": null,
                "concreteType": "hr_employees_docs_licenses_aggregate",
                "kind": "LinkedField",
                "name": "license_list_aggregate",
                "plural": false,
                "selections": [
                  {
                    "alias": null,
                    "args": null,
                    "concreteType": "hr_employees_docs_licenses_aggregate_fields",
                    "kind": "LinkedField",
                    "name": "aggregate",
                    "plural": false,
                    "selections": (v13/*: any*/),
                    "storageKey": null
                  }
                ],
                "storageKey": null
              },
              {
                "alias": null,
                "args": (v12/*: any*/),
                "concreteType": "hr_employees_docs_licenses",
                "kind": "LinkedField",
                "name": "license_list",
                "plural": true,
                "selections": (v43/*: any*/),
                "storageKey": "license_list(where:{\"removed\":{\"_eq\":false}})"
              },
              {
                "alias": null,
                "args": (v12/*: any*/),
                "concreteType": "hr_employees_docs_medicals_aggregate",
                "kind": "LinkedField",
                "name": "medical_list_aggregate",
                "plural": false,
                "selections": [
                  {
                    "alias": null,
                    "args": null,
                    "concreteType": "hr_employees_docs_medicals_aggregate_fields",
                    "kind": "LinkedField",
                    "name": "aggregate",
                    "plural": false,
                    "selections": (v13/*: any*/),
                    "storageKey": null
                  }
                ],
                "storageKey": "medical_list_aggregate(where:{\"removed\":{\"_eq\":false}})"
              },
              {
                "alias": null,
                "args": (v12/*: any*/),
                "concreteType": "hr_employees_docs_medicals",
                "kind": "LinkedField",
                "name": "medical_list",
                "plural": true,
                "selections": [
                  (v1/*: any*/),
                  (v2/*: any*/),
                  (v38/*: any*/),
                  {
                    "alias": null,
                    "args": null,
                    "kind": "ScalarField",
                    "name": "annexture_3",
                    "storageKey": null
                  },
                  {
                    "alias": null,
                    "args": null,
                    "kind": "ScalarField",
                    "name": "restrictions",
                    "storageKey": null
                  },
                  (v16/*: any*/),
                  (v35/*: any*/),
                  (v36/*: any*/)
                ],
                "storageKey": "medical_list(where:{\"removed\":{\"_eq\":false}})"
              },
              {
                "alias": null,
                "args": (v12/*: any*/),
                "concreteType": "hr_employees_docs_warnings_aggregate",
                "kind": "LinkedField",
                "name": "warning_list_aggregate",
                "plural": false,
                "selections": [
                  {
                    "alias": null,
                    "args": null,
                    "concreteType": "hr_employees_docs_warnings_aggregate_fields",
                    "kind": "LinkedField",
                    "name": "aggregate",
                    "plural": false,
                    "selections": (v13/*: any*/),
                    "storageKey": null
                  }
                ],
                "storageKey": "warning_list_aggregate(where:{\"removed\":{\"_eq\":false}})"
              },
              {
                "alias": null,
                "args": (v12/*: any*/),
                "concreteType": "hr_employees_docs_warnings",
                "kind": "LinkedField",
                "name": "warning_list",
                "plural": true,
                "selections": [
                  (v1/*: any*/),
                  (v2/*: any*/),
                  (v38/*: any*/),
                  (v34/*: any*/),
                  {
                    "alias": null,
                    "args": null,
                    "kind": "ScalarField",
                    "name": "details",
                    "storageKey": null
                  },
                  (v44/*: any*/),
                  (v39/*: any*/),
                  (v16/*: any*/),
                  (v42/*: any*/),
                  (v35/*: any*/),
                  (v36/*: any*/),
                  {
                    "alias": null,
                    "args": null,
                    "concreteType": "proxy_employees_docs_warning__witness",
                    "kind": "LinkedField",
                    "name": "witness_list",
                    "plural": true,
                    "selections": (v41/*: any*/),
                    "storageKey": null
                  },
                  {
                    "alias": null,
                    "args": null,
                    "concreteType": "hr_employees",
                    "kind": "LinkedField",
                    "name": "issued_by",
                    "plural": false,
                    "selections": (v40/*: any*/),
                    "storageKey": null
                  }
                ],
                "storageKey": "warning_list(where:{\"removed\":{\"_eq\":false}})"
              },
              {
                "alias": null,
                "args": null,
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
                    "selections": (v13/*: any*/),
                    "storageKey": null
                  }
                ],
                "storageKey": null
              },
              {
                "alias": null,
                "args": (v12/*: any*/),
                "concreteType": "hr_employees_docs_work_permits",
                "kind": "LinkedField",
                "name": "work_permit_list",
                "plural": true,
                "selections": (v43/*: any*/),
                "storageKey": "work_permit_list(where:{\"removed\":{\"_eq\":false}})"
              },
              {
                "alias": null,
                "args": null,
                "concreteType": "hr_employees_documents_aggregate",
                "kind": "LinkedField",
                "name": "document_list_aggregate",
                "plural": false,
                "selections": (v45/*: any*/),
                "storageKey": null
              },
              {
                "alias": "document_id_passport_list_aggregate",
                "args": [
                  {
                    "kind": "Literal",
                    "name": "where",
                    "value": {
                      "type": {
                        "_eq": "ID/Passport"
                      }
                    }
                  }
                ],
                "concreteType": "hr_employees_documents_aggregate",
                "kind": "LinkedField",
                "name": "document_list_aggregate",
                "plural": false,
                "selections": (v45/*: any*/),
                "storageKey": "document_list_aggregate(where:{\"type\":{\"_eq\":\"ID/Passport\"}})"
              },
              {
                "alias": "document_prdp_list_aggregate",
                "args": [
                  {
                    "kind": "Literal",
                    "name": "where",
                    "value": {
                      "type": {
                        "_eq": "PrDP"
                      }
                    }
                  }
                ],
                "concreteType": "hr_employees_documents_aggregate",
                "kind": "LinkedField",
                "name": "document_list_aggregate",
                "plural": false,
                "selections": (v45/*: any*/),
                "storageKey": "document_list_aggregate(where:{\"type\":{\"_eq\":\"PrDP\"}})"
              },
              {
                "alias": null,
                "args": null,
                "concreteType": "hr_employees_documents",
                "kind": "LinkedField",
                "name": "document_list",
                "plural": true,
                "selections": [
                  (v1/*: any*/),
                  (v2/*: any*/),
                  (v35/*: any*/),
                  (v34/*: any*/),
                  {
                    "alias": null,
                    "args": null,
                    "kind": "ScalarField",
                    "name": "desc",
                    "storageKey": null
                  },
                  (v16/*: any*/)
                ],
                "storageKey": null
              },
              {
                "alias": null,
                "args": null,
                "concreteType": "proxy_employee__ppe_aggregate",
                "kind": "LinkedField",
                "name": "ppe_list_aggregate",
                "plural": false,
                "selections": [
                  {
                    "alias": null,
                    "args": null,
                    "concreteType": "proxy_employee__ppe_aggregate_fields",
                    "kind": "LinkedField",
                    "name": "aggregate",
                    "plural": false,
                    "selections": (v13/*: any*/),
                    "storageKey": null
                  }
                ],
                "storageKey": null
              },
              {
                "alias": null,
                "args": null,
                "concreteType": "proxy_employee__ppe",
                "kind": "LinkedField",
                "name": "ppe_list",
                "plural": true,
                "selections": [
                  (v1/*: any*/),
                  (v2/*: any*/),
                  {
                    "alias": null,
                    "args": null,
                    "kind": "ScalarField",
                    "name": "assignment_status",
                    "storageKey": null
                  },
                  {
                    "alias": null,
                    "args": null,
                    "kind": "ScalarField",
                    "name": "date_assigned",
                    "storageKey": null
                  },
                  {
                    "alias": null,
                    "args": null,
                    "kind": "ScalarField",
                    "name": "ppe_condition",
                    "storageKey": null
                  },
                  {
                    "alias": null,
                    "args": null,
                    "concreteType": "ppe",
                    "kind": "LinkedField",
                    "name": "ppe",
                    "plural": false,
                    "selections": [
                      (v1/*: any*/),
                      (v2/*: any*/),
                      (v14/*: any*/),
                      {
                        "alias": null,
                        "args": null,
                        "kind": "ScalarField",
                        "name": "unit",
                        "storageKey": null
                      },
                      {
                        "alias": null,
                        "args": null,
                        "kind": "ScalarField",
                        "name": "qty_received",
                        "storageKey": null
                      },
                      {
                        "alias": null,
                        "args": null,
                        "kind": "ScalarField",
                        "name": "qty_issued",
                        "storageKey": null
                      },
                      {
                        "alias": null,
                        "args": null,
                        "kind": "ScalarField",
                        "name": "qty_in_stock",
                        "storageKey": null
                      },
                      {
                        "alias": null,
                        "args": null,
                        "kind": "ScalarField",
                        "name": "duration_type",
                        "storageKey": null
                      },
                      {
                        "alias": null,
                        "args": null,
                        "kind": "ScalarField",
                        "name": "duration_value",
                        "storageKey": null
                      },
                      (v39/*: any*/),
                      (v10/*: any*/)
                    ],
                    "storageKey": null
                  }
                ],
                "storageKey": null
              },
              {
                "alias": "trainer_training_list_aggregate",
                "args": null,
                "concreteType": "sheq_training_matrices_aggregate",
                "kind": "LinkedField",
                "name": "trainer_training_matrix_list_aggregate",
                "plural": false,
                "selections": [
                  {
                    "alias": null,
                    "args": null,
                    "concreteType": "sheq_training_matrices_aggregate_fields",
                    "kind": "LinkedField",
                    "name": "aggregate",
                    "plural": false,
                    "selections": (v13/*: any*/),
                    "storageKey": null
                  }
                ],
                "storageKey": null
              },
              {
                "alias": "trainer_training_list",
                "args": null,
                "concreteType": "sheq_training_matrices",
                "kind": "LinkedField",
                "name": "trainer_training_matrix_list",
                "plural": true,
                "selections": [
                  (v1/*: any*/),
                  (v2/*: any*/),
                  {
                    "alias": null,
                    "args": null,
                    "kind": "ScalarField",
                    "name": "competency_evaluation",
                    "storageKey": null
                  },
                  (v33/*: any*/),
                  (v27/*: any*/),
                  (v24/*: any*/),
                  (v25/*: any*/),
                  {
                    "alias": null,
                    "args": null,
                    "kind": "ScalarField",
                    "name": "institution_conducting_training",
                    "storageKey": null
                  },
                  {
                    "alias": null,
                    "args": null,
                    "kind": "ScalarField",
                    "name": "max_participants_per_course",
                    "storageKey": null
                  },
                  (v28/*: any*/),
                  (v30/*: any*/),
                  (v29/*: any*/),
                  (v31/*: any*/),
                  {
                    "alias": null,
                    "args": null,
                    "kind": "ScalarField",
                    "name": "status",
                    "storageKey": null
                  },
                  (v32/*: any*/),
                  (v26/*: any*/),
                  (v19/*: any*/),
                  (v20/*: any*/),
                  {
                    "alias": null,
                    "args": null,
                    "concreteType": "hr_employees",
                    "kind": "LinkedField",
                    "name": "trainer",
                    "plural": false,
                    "selections": (v46/*: any*/),
                    "storageKey": null
                  },
                  {
                    "alias": null,
                    "args": null,
                    "concreteType": "hr_employees_external",
                    "kind": "LinkedField",
                    "name": "trainer_external",
                    "plural": false,
                    "selections": (v46/*: any*/),
                    "storageKey": null
                  },
                  {
                    "alias": null,
                    "args": null,
                    "concreteType": "default_job_positions",
                    "kind": "LinkedField",
                    "name": "trainer_job_position",
                    "plural": false,
                    "selections": (v15/*: any*/),
                    "storageKey": null
                  },
                  (v22/*: any*/)
                ],
                "storageKey": null
              },
              {
                "alias": null,
                "args": (v12/*: any*/),
                "concreteType": "hr_employees_aggregate",
                "kind": "LinkedField",
                "name": "supervisor_employee_list_aggregate",
                "plural": false,
                "selections": [
                  {
                    "alias": null,
                    "args": null,
                    "concreteType": "hr_employees_aggregate_fields",
                    "kind": "LinkedField",
                    "name": "aggregate",
                    "plural": false,
                    "selections": (v13/*: any*/),
                    "storageKey": null
                  }
                ],
                "storageKey": "supervisor_employee_list_aggregate(where:{\"removed\":{\"_eq\":false}})"
              },
              {
                "alias": null,
                "args": (v12/*: any*/),
                "concreteType": "hr_employees",
                "kind": "LinkedField",
                "name": "supervisor_employee_list",
                "plural": true,
                "selections": (v40/*: any*/),
                "storageKey": "supervisor_employee_list(where:{\"removed\":{\"_eq\":false}})"
              },
              {
                "alias": null,
                "args": null,
                "concreteType": "hr_employees",
                "kind": "LinkedField",
                "name": "supervisor",
                "plural": false,
                "selections": (v40/*: any*/),
                "storageKey": null
              },
              {
                "alias": null,
                "args": null,
                "concreteType": "default_users",
                "kind": "LinkedField",
                "name": "linked_user",
                "plural": false,
                "selections": [
                  (v1/*: any*/),
                  (v3/*: any*/),
                  (v4/*: any*/),
                  {
                    "alias": null,
                    "args": null,
                    "kind": "ScalarField",
                    "name": "username",
                    "storageKey": null
                  },
                  (v6/*: any*/)
                ],
                "storageKey": null
              },
              {
                "alias": null,
                "args": null,
                "concreteType": "default_departments",
                "kind": "LinkedField",
                "name": "department",
                "plural": false,
                "selections": (v15/*: any*/),
                "storageKey": null
              },
              {
                "alias": null,
                "args": null,
                "concreteType": "default_job_positions",
                "kind": "LinkedField",
                "name": "job_position",
                "plural": false,
                "selections": [
                  (v1/*: any*/),
                  (v14/*: any*/),
                  {
                    "alias": null,
                    "args": null,
                    "concreteType": "default_job_categories",
                    "kind": "LinkedField",
                    "name": "job_category",
                    "plural": false,
                    "selections": (v15/*: any*/),
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
                "selections": (v15/*: any*/),
                "storageKey": null
              },
              {
                "alias": null,
                "args": null,
                "concreteType": "default_clients",
                "kind": "LinkedField",
                "name": "client",
                "plural": false,
                "selections": (v15/*: any*/),
                "storageKey": null
              },
              {
                "alias": null,
                "args": null,
                "concreteType": "default_projects",
                "kind": "LinkedField",
                "name": "project",
                "plural": false,
                "selections": (v15/*: any*/),
                "storageKey": null
              },
              {
                "alias": null,
                "args": null,
                "concreteType": "default_sites",
                "kind": "LinkedField",
                "name": "site",
                "plural": false,
                "selections": (v15/*: any*/),
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
    "name": "findByIdEmployeeQuery",
    "selections": (v47/*: any*/),
    "type": "query_root",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "findByIdEmployeeQuery",
    "selections": (v47/*: any*/)
  },
  "params": {
    "cacheID": "31d9454308b8d9a0e884fb504b3db4bf",
    "id": null,
    "metadata": {},
    "name": "findByIdEmployeeQuery",
    "operationKind": "query",
    "text": "query findByIdEmployeeQuery(\n  $id: bigint\n) {\n  hr_employees_connection(where: {id: {_eq: $id}}) {\n    edges {\n      node {\n        id\n        created_at\n        fname\n        lname\n        full_name\n        email\n        phone\n        dob\n        sex\n        id_num\n        passport_num\n        profile_pic\n        employment_num\n        employment_date\n        job_observation_list_aggregate(where: {removed: {_eq: false}}) {\n          aggregate {\n            count\n          }\n        }\n        job_observation_list {\n          id\n          name\n        }\n        banking_detail_list_aggregate {\n          aggregate {\n            count\n          }\n        }\n        banking_detail_list {\n          id\n          created_at\n          name\n          account_num\n          code\n          branch\n          doc\n          is_default\n        }\n        living_address_list_aggregate {\n          aggregate {\n            count\n          }\n        }\n        living_address_list {\n          id\n          created_at\n          local_address\n          street_address\n          doc\n          is_default\n          country {\n            id\n            name\n          }\n          zone {\n            id\n            name\n          }\n          city {\n            id\n            name\n          }\n        }\n        dependent_list_aggregate {\n          aggregate {\n            count\n          }\n        }\n        dependent_list {\n          id\n          fname\n          lname\n          dob\n          gender\n        }\n        next_of_kin_list_aggregate {\n          aggregate {\n            count\n          }\n        }\n        next_of_kin_list {\n          id\n          fname\n          lname\n          phone1\n          phone2\n          relationship\n        }\n        training_course_list_aggregate: training_plan_list_aggregate {\n          aggregate {\n            count(distinct: true, columns: course_id)\n          }\n        }\n        training_course_list: training_plan_list(distinct_on: [course_id]) {\n          id\n          course {\n            id\n            name\n            unit_standard\n            unit_standard_desc\n          }\n        }\n        training_plan_list_aggregate {\n          aggregate {\n            count\n          }\n        }\n        training_plan_list {\n          id\n          created_at\n          completion_status\n          result_status\n          result\n          year\n          course {\n            id\n            name\n          }\n          training {\n            id\n            course {\n              id\n              name\n            }\n          }\n        }\n        training_matrix_list_aggregate: training_plan_list_aggregate {\n          aggregate {\n            count(distinct: true, columns: training_id)\n          }\n        }\n        training_matrix_list: training_plan_list(distinct_on: [training_id]) {\n          id\n          training {\n            id\n            date_range_start\n            date_range_end\n            training_standard\n            unit_standard\n            unit_standard_desc\n            credits\n            nqf_level\n            requirement\n            provider_requirement\n            requirement_legal\n            training_frequency\n            cost\n            course {\n              id\n              name\n              unit_standard\n              unit_standard_desc\n            }\n          }\n        }\n        competency_list_aggregate(where: {removed: {_eq: false}}) {\n          aggregate {\n            count\n          }\n        }\n        competency_list(where: {removed: {_eq: false}}) {\n          id\n          created_at\n          accreditation_num\n          competency_type\n          type\n          doc\n          issued_date\n          expiry_date\n          expiry_updated\n          employee {\n            id\n          }\n          training {\n            id\n            course {\n              id\n              name\n            }\n          }\n        }\n        contract_list_aggregate(where: {removed: {_eq: false}}) {\n          aggregate {\n            count\n          }\n        }\n        contract_list(where: {removed: {_eq: false}}) {\n          id\n          created_at\n          doc\n          job_profile_doc\n          expiry_updated\n          removed\n          employee {\n            id\n          }\n          contract_details {\n            id\n            contract_type\n            daily_working_hours\n            end_of_trial_period\n            end_time\n            expiry_date\n            notes\n            start_date\n            start_time\n          }\n          salary_info {\n            id\n            deductible_list {\n              id\n              created_at\n              text\n              value\n            }\n            payment_type\n            salary\n            salary_interval\n            wage\n          }\n        }\n        counselling_list_aggregate(where: {removed: {_eq: false}}) {\n          aggregate {\n            count\n          }\n        }\n        counselling_list(where: {removed: {_eq: false}}) {\n          id\n          created_at\n          doc\n          corrective_actions\n          counselling_hrs_to_complete\n          expiry_date\n          expiry_updated\n          removed\n          incident_desc\n          reasons\n          types\n          responsible_person {\n            id\n            fname\n            lname\n            email\n            phone\n            id_num\n            passport_num\n            profile_pic\n            employment_num\n          }\n          witness_list {\n            id\n            witness {\n              id\n              fname\n              lname\n              email\n              phone\n              id_num\n              passport_num\n              profile_pic\n              employment_num\n            }\n          }\n        }\n        job_appointment_list_aggregate(where: {removed: {_eq: false}}) {\n          aggregate {\n            count\n          }\n        }\n        job_appointment_list(where: {removed: {_eq: false}}) {\n          id\n          created_at\n          removed\n          notes\n          doc\n          date\n          expiry_date\n          expiry_updated\n        }\n        leave_list_aggregate(where: {removed: {_eq: false}}) {\n          aggregate {\n            count\n          }\n        }\n        leave_list(where: {removed: {_eq: false}}) {\n          id\n          created_at\n          days_booked\n          due_to\n          removed\n          type\n          employee_comments\n          reason\n          notes\n          doc\n          date\n          expiry_date\n          expiry_updated\n        }\n        license_list_aggregate {\n          aggregate {\n            count\n          }\n        }\n        license_list(where: {removed: {_eq: false}}) {\n          id\n          created_at\n          removed\n          notes\n          doc\n          date\n          expiry_date\n          expiry_updated\n        }\n        medical_list_aggregate(where: {removed: {_eq: false}}) {\n          aggregate {\n            count\n          }\n        }\n        medical_list(where: {removed: {_eq: false}}) {\n          id\n          created_at\n          removed\n          annexture_3\n          restrictions\n          doc\n          expiry_date\n          expiry_updated\n        }\n        warning_list_aggregate(where: {removed: {_eq: false}}) {\n          aggregate {\n            count\n          }\n        }\n        warning_list(where: {removed: {_eq: false}}) {\n          id\n          created_at\n          removed\n          type\n          details\n          employee_comments\n          notes\n          doc\n          date\n          expiry_date\n          expiry_updated\n          witness_list {\n            id\n            witness {\n              id\n              fname\n              lname\n              email\n              phone\n              id_num\n              passport_num\n              profile_pic\n              employment_num\n            }\n          }\n          issued_by {\n            id\n            fname\n            lname\n            email\n            phone\n            id_num\n            passport_num\n            profile_pic\n            employment_num\n          }\n        }\n        work_permit_list_aggregate {\n          aggregate {\n            count\n          }\n        }\n        work_permit_list(where: {removed: {_eq: false}}) {\n          id\n          created_at\n          removed\n          notes\n          doc\n          date\n          expiry_date\n          expiry_updated\n        }\n        document_list_aggregate {\n          aggregate {\n            count\n          }\n        }\n        document_id_passport_list_aggregate: document_list_aggregate(where: {type: {_eq: \"ID/Passport\"}}) {\n          aggregate {\n            count\n          }\n        }\n        document_prdp_list_aggregate: document_list_aggregate(where: {type: {_eq: \"PrDP\"}}) {\n          aggregate {\n            count\n          }\n        }\n        document_list {\n          id\n          created_at\n          expiry_date\n          type\n          desc\n          doc\n        }\n        ppe_list_aggregate {\n          aggregate {\n            count\n          }\n        }\n        ppe_list {\n          id\n          created_at\n          assignment_status\n          date_assigned\n          ppe_condition\n          ppe {\n            id\n            created_at\n            name\n            unit\n            qty_received\n            qty_issued\n            qty_in_stock\n            duration_type\n            duration_value\n            notes\n            profile_pic\n          }\n        }\n        trainer_training_list_aggregate: trainer_training_matrix_list_aggregate {\n          aggregate {\n            count\n          }\n        }\n        trainer_training_list: trainer_training_matrix_list {\n          id\n          created_at\n          competency_evaluation\n          cost\n          credits\n          date_range_start\n          date_range_end\n          institution_conducting_training\n          max_participants_per_course\n          nqf_level\n          provider_requirement\n          requirement\n          requirement_legal\n          status\n          training_frequency\n          training_standard\n          unit_standard\n          unit_standard_desc\n          trainer {\n            id\n            fname\n            lname\n            email\n            phone\n          }\n          trainer_external {\n            id\n            fname\n            lname\n            email\n            phone\n          }\n          trainer_job_position {\n            id\n            name\n          }\n          course {\n            id\n            name\n          }\n        }\n        supervisor_employee_list_aggregate(where: {removed: {_eq: false}}) {\n          aggregate {\n            count\n          }\n        }\n        supervisor_employee_list(where: {removed: {_eq: false}}) {\n          id\n          fname\n          lname\n          email\n          phone\n          id_num\n          passport_num\n          profile_pic\n          employment_num\n        }\n        supervisor {\n          id\n          fname\n          lname\n          email\n          phone\n          id_num\n          passport_num\n          profile_pic\n          employment_num\n        }\n        linked_user {\n          id\n          fname\n          lname\n          username\n          phone\n        }\n        department {\n          id\n          name\n        }\n        job_position {\n          id\n          name\n          job_category {\n            id\n            name\n          }\n        }\n        company {\n          id\n          name\n        }\n        client {\n          id\n          name\n        }\n        project {\n          id\n          name\n        }\n        site {\n          id\n          name\n        }\n      }\n    }\n  }\n}\n"
  }
};
})();

node.hash = "32b9c688a80477090fbdf6245947a038";

module.exports = node;
