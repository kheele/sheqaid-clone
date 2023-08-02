/**
 * @generated SignedSource<<7a5899c625b0c1248d206ff15f5ec0ae>>
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
    "name": "site_id"
  }
],
v1 = {
  "unit_standard": "asc_nulls_last"
},
v2 = {
  "unit_standard_desc": "asc_nulls_last"
},
v3 = [
  {
    "kind": "Literal",
    "name": "order_by",
    "value": [
      {
        "course": {
          "name": "asc_nulls_last"
        }
      },
      {
        "course": (v1/*: any*/)
      },
      {
        "course": (v2/*: any*/)
      },
      (v1/*: any*/),
      (v2/*: any*/)
    ]
  },
  {
    "fields": [
      {
        "fields": [
          {
            "kind": "Variable",
            "name": "_eq",
            "variableName": "site_id"
          }
        ],
        "kind": "ObjectValue",
        "name": "site_id"
      }
    ],
    "kind": "ObjectValue",
    "name": "where"
  }
],
v4 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "id",
  "storageKey": null
},
v5 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "created_at",
  "storageKey": null
},
v6 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "competency_evaluation",
  "storageKey": null
},
v7 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "cost",
  "storageKey": null
},
v8 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "credits",
  "storageKey": null
},
v9 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "date_range_start",
  "storageKey": null
},
v10 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "date_range_end",
  "storageKey": null
},
v11 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "institution_conducting_training",
  "storageKey": null
},
v12 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "max_participants_per_course",
  "storageKey": null
},
v13 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "nqf_level",
  "storageKey": null
},
v14 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "provider_requirement",
  "storageKey": null
},
v15 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "requirement",
  "storageKey": null
},
v16 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "requirement_legal",
  "storageKey": null
},
v17 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "status",
  "storageKey": null
},
v18 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "training_frequency",
  "storageKey": null
},
v19 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "training_standard",
  "storageKey": null
},
v20 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "unit_standard",
  "storageKey": null
},
v21 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "unit_standard_desc",
  "storageKey": null
},
v22 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "fname",
  "storageKey": null
},
v23 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "lname",
  "storageKey": null
},
v24 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "email",
  "storageKey": null
},
v25 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "phone",
  "storageKey": null
},
v26 = [
  (v4/*: any*/),
  (v22/*: any*/),
  (v23/*: any*/),
  (v24/*: any*/),
  (v25/*: any*/)
],
v27 = {
  "alias": null,
  "args": null,
  "concreteType": "hr_employees",
  "kind": "LinkedField",
  "name": "trainer",
  "plural": false,
  "selections": (v26/*: any*/),
  "storageKey": null
},
v28 = {
  "alias": null,
  "args": null,
  "concreteType": "hr_employees_external",
  "kind": "LinkedField",
  "name": "trainer_external",
  "plural": false,
  "selections": (v26/*: any*/),
  "storageKey": null
},
v29 = [
  (v4/*: any*/),
  {
    "alias": null,
    "args": null,
    "kind": "ScalarField",
    "name": "name",
    "storageKey": null
  }
],
v30 = {
  "alias": null,
  "args": null,
  "concreteType": "default_job_positions",
  "kind": "LinkedField",
  "name": "trainer_job_position",
  "plural": false,
  "selections": (v29/*: any*/),
  "storageKey": null
},
v31 = {
  "alias": null,
  "args": null,
  "concreteType": "sheq_training_courses",
  "kind": "LinkedField",
  "name": "course",
  "plural": false,
  "selections": (v29/*: any*/),
  "storageKey": null
},
v32 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "id_num",
  "storageKey": null
},
v33 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "passport_num",
  "storageKey": null
},
v34 = {
  "alias": null,
  "args": null,
  "concreteType": "hr_employees_docs_competencies",
  "kind": "LinkedField",
  "name": "competency_list",
  "plural": true,
  "selections": [
    (v4/*: any*/),
    (v5/*: any*/),
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
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "type",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "doc",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "issued_date",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "expiry_date",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "expiry_updated",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "concreteType": "hr_employees",
      "kind": "LinkedField",
      "name": "employee",
      "plural": false,
      "selections": [
        (v4/*: any*/),
        (v22/*: any*/),
        (v23/*: any*/),
        (v25/*: any*/),
        (v24/*: any*/),
        (v32/*: any*/),
        (v33/*: any*/)
      ],
      "storageKey": null
    }
  ],
  "storageKey": null
},
v35 = {
  "alias": null,
  "args": null,
  "concreteType": "proxy_job_category__training_matrix",
  "kind": "LinkedField",
  "name": "job_category_list",
  "plural": true,
  "selections": [
    (v4/*: any*/),
    {
      "alias": null,
      "args": null,
      "concreteType": "default_job_categories",
      "kind": "LinkedField",
      "name": "job_category",
      "plural": false,
      "selections": (v29/*: any*/),
      "storageKey": null
    }
  ],
  "storageKey": null
},
v36 = {
  "alias": null,
  "args": null,
  "concreteType": "default_job_positions",
  "kind": "LinkedField",
  "name": "job_position",
  "plural": false,
  "selections": (v29/*: any*/),
  "storageKey": null
},
v37 = {
  "alias": null,
  "args": null,
  "concreteType": "proxy_job_position__training_matrix",
  "kind": "LinkedField",
  "name": "job_position_list",
  "plural": true,
  "selections": [
    (v4/*: any*/),
    (v36/*: any*/)
  ],
  "storageKey": null
},
v38 = {
  "alias": null,
  "args": null,
  "concreteType": "proxy_sector__training_matrix",
  "kind": "LinkedField",
  "name": "sector_list",
  "plural": true,
  "selections": [
    (v4/*: any*/),
    {
      "alias": null,
      "args": null,
      "concreteType": "default_sectors",
      "kind": "LinkedField",
      "name": "sector",
      "plural": false,
      "selections": (v29/*: any*/),
      "storageKey": null
    }
  ],
  "storageKey": null
},
v39 = {
  "alias": null,
  "args": null,
  "concreteType": "sheq_training_plans__employee_training",
  "kind": "LinkedField",
  "name": "training_plan_list",
  "plural": true,
  "selections": [
    (v4/*: any*/),
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
      "name": "result",
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
      "name": "year",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "concreteType": "hr_employees",
      "kind": "LinkedField",
      "name": "employee",
      "plural": false,
      "selections": [
        (v4/*: any*/),
        (v22/*: any*/),
        (v23/*: any*/),
        (v24/*: any*/),
        (v25/*: any*/),
        (v32/*: any*/),
        (v33/*: any*/),
        {
          "alias": null,
          "args": null,
          "kind": "ScalarField",
          "name": "employment_num",
          "storageKey": null
        },
        (v36/*: any*/),
        {
          "alias": null,
          "args": null,
          "concreteType": "default_departments",
          "kind": "LinkedField",
          "name": "department",
          "plural": false,
          "selections": (v29/*: any*/),
          "storageKey": null
        }
      ],
      "storageKey": null
    },
    (v31/*: any*/),
    {
      "alias": null,
      "args": null,
      "concreteType": "sheq_training_matrices",
      "kind": "LinkedField",
      "name": "training",
      "plural": false,
      "selections": [
        (v4/*: any*/),
        (v31/*: any*/)
      ],
      "storageKey": null
    }
  ],
  "storageKey": null
},
v40 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "date",
  "storageKey": null
},
v41 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "time_or_duration",
  "storageKey": null
},
v42 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "list_proof",
  "storageKey": null
},
v43 = {
  "alias": null,
  "args": null,
  "concreteType": "hr_employees",
  "kind": "LinkedField",
  "name": "employee",
  "plural": false,
  "selections": (v26/*: any*/),
  "storageKey": null
},
v44 = {
  "alias": null,
  "args": null,
  "concreteType": "default_companies",
  "kind": "LinkedField",
  "name": "company",
  "plural": false,
  "selections": (v29/*: any*/),
  "storageKey": null
},
v45 = {
  "alias": null,
  "args": null,
  "concreteType": "default_clients",
  "kind": "LinkedField",
  "name": "client",
  "plural": false,
  "selections": (v29/*: any*/),
  "storageKey": null
},
v46 = {
  "alias": null,
  "args": null,
  "concreteType": "default_projects",
  "kind": "LinkedField",
  "name": "project",
  "plural": false,
  "selections": (v29/*: any*/),
  "storageKey": null
},
v47 = {
  "alias": null,
  "args": null,
  "concreteType": "default_sites",
  "kind": "LinkedField",
  "name": "site",
  "plural": false,
  "selections": (v29/*: any*/),
  "storageKey": null
};
return {
  "fragment": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Fragment",
    "metadata": null,
    "name": "listAllTrainingMatrixByLoggedSiteQuery",
    "selections": [
      {
        "alias": null,
        "args": (v3/*: any*/),
        "concreteType": "sheq_training_matricesConnection",
        "kind": "LinkedField",
        "name": "sheq_training_matrices_connection",
        "plural": false,
        "selections": [
          {
            "alias": null,
            "args": null,
            "concreteType": "sheq_training_matricesEdge",
            "kind": "LinkedField",
            "name": "edges",
            "plural": true,
            "selections": [
              {
                "alias": null,
                "args": null,
                "concreteType": "sheq_training_matrices",
                "kind": "LinkedField",
                "name": "node",
                "plural": false,
                "selections": [
                  (v4/*: any*/),
                  (v5/*: any*/),
                  (v6/*: any*/),
                  (v7/*: any*/),
                  (v8/*: any*/),
                  (v9/*: any*/),
                  (v10/*: any*/),
                  (v11/*: any*/),
                  (v12/*: any*/),
                  (v13/*: any*/),
                  (v14/*: any*/),
                  (v15/*: any*/),
                  (v16/*: any*/),
                  (v17/*: any*/),
                  (v18/*: any*/),
                  (v19/*: any*/),
                  (v20/*: any*/),
                  (v21/*: any*/),
                  (v27/*: any*/),
                  (v28/*: any*/),
                  (v30/*: any*/),
                  (v31/*: any*/),
                  (v34/*: any*/),
                  (v35/*: any*/),
                  (v37/*: any*/),
                  (v38/*: any*/),
                  (v39/*: any*/),
                  {
                    "alias": null,
                    "args": null,
                    "concreteType": "sheq_training_registers",
                    "kind": "LinkedField",
                    "name": "training_register_list",
                    "plural": true,
                    "selections": [
                      (v4/*: any*/),
                      (v40/*: any*/),
                      (v41/*: any*/),
                      (v42/*: any*/),
                      (v11/*: any*/),
                      (v27/*: any*/),
                      (v28/*: any*/),
                      {
                        "alias": null,
                        "args": null,
                        "concreteType": "proxy_employee__training_register",
                        "kind": "LinkedField",
                        "name": "employee_list",
                        "plural": true,
                        "selections": [
                          (v43/*: any*/)
                        ],
                        "storageKey": null
                      }
                    ],
                    "storageKey": null
                  },
                  (v44/*: any*/),
                  (v45/*: any*/),
                  (v46/*: any*/),
                  (v47/*: any*/)
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
    "name": "listAllTrainingMatrixByLoggedSiteQuery",
    "selections": [
      {
        "alias": null,
        "args": (v3/*: any*/),
        "concreteType": "sheq_training_matricesConnection",
        "kind": "LinkedField",
        "name": "sheq_training_matrices_connection",
        "plural": false,
        "selections": [
          {
            "alias": null,
            "args": null,
            "concreteType": "sheq_training_matricesEdge",
            "kind": "LinkedField",
            "name": "edges",
            "plural": true,
            "selections": [
              {
                "alias": null,
                "args": null,
                "concreteType": "sheq_training_matrices",
                "kind": "LinkedField",
                "name": "node",
                "plural": false,
                "selections": [
                  (v4/*: any*/),
                  (v5/*: any*/),
                  (v6/*: any*/),
                  (v7/*: any*/),
                  (v8/*: any*/),
                  (v9/*: any*/),
                  (v10/*: any*/),
                  (v11/*: any*/),
                  (v12/*: any*/),
                  (v13/*: any*/),
                  (v14/*: any*/),
                  (v15/*: any*/),
                  (v16/*: any*/),
                  (v17/*: any*/),
                  (v18/*: any*/),
                  (v19/*: any*/),
                  (v20/*: any*/),
                  (v21/*: any*/),
                  (v27/*: any*/),
                  (v28/*: any*/),
                  (v30/*: any*/),
                  (v31/*: any*/),
                  (v34/*: any*/),
                  (v35/*: any*/),
                  (v37/*: any*/),
                  (v38/*: any*/),
                  (v39/*: any*/),
                  {
                    "alias": null,
                    "args": null,
                    "concreteType": "sheq_training_registers",
                    "kind": "LinkedField",
                    "name": "training_register_list",
                    "plural": true,
                    "selections": [
                      (v4/*: any*/),
                      (v40/*: any*/),
                      (v41/*: any*/),
                      (v42/*: any*/),
                      (v11/*: any*/),
                      (v27/*: any*/),
                      (v28/*: any*/),
                      {
                        "alias": null,
                        "args": null,
                        "concreteType": "proxy_employee__training_register",
                        "kind": "LinkedField",
                        "name": "employee_list",
                        "plural": true,
                        "selections": [
                          (v43/*: any*/),
                          (v4/*: any*/)
                        ],
                        "storageKey": null
                      }
                    ],
                    "storageKey": null
                  },
                  (v44/*: any*/),
                  (v45/*: any*/),
                  (v46/*: any*/),
                  (v47/*: any*/)
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
    "cacheID": "41855e5af24966457276fd90c6d5fbd7",
    "id": null,
    "metadata": {},
    "name": "listAllTrainingMatrixByLoggedSiteQuery",
    "operationKind": "query",
    "text": "query listAllTrainingMatrixByLoggedSiteQuery(\n  $site_id: bigint\n) {\n  sheq_training_matrices_connection(where: {site_id: {_eq: $site_id}}, order_by: [{course: {name: asc_nulls_last}}, {course: {unit_standard: asc_nulls_last}}, {course: {unit_standard_desc: asc_nulls_last}}, {unit_standard: asc_nulls_last}, {unit_standard_desc: asc_nulls_last}]) {\n    edges {\n      node {\n        id\n        created_at\n        competency_evaluation\n        cost\n        credits\n        date_range_start\n        date_range_end\n        institution_conducting_training\n        max_participants_per_course\n        nqf_level\n        provider_requirement\n        requirement\n        requirement_legal\n        status\n        training_frequency\n        training_standard\n        unit_standard\n        unit_standard_desc\n        trainer {\n          id\n          fname\n          lname\n          email\n          phone\n        }\n        trainer_external {\n          id\n          fname\n          lname\n          email\n          phone\n        }\n        trainer_job_position {\n          id\n          name\n        }\n        course {\n          id\n          name\n        }\n        competency_list {\n          id\n          created_at\n          accreditation_num\n          competency_type\n          type\n          doc\n          issued_date\n          expiry_date\n          expiry_updated\n          employee {\n            id\n            fname\n            lname\n            phone\n            email\n            id_num\n            passport_num\n          }\n        }\n        job_category_list {\n          id\n          job_category {\n            id\n            name\n          }\n        }\n        job_position_list {\n          id\n          job_position {\n            id\n            name\n          }\n        }\n        sector_list {\n          id\n          sector {\n            id\n            name\n          }\n        }\n        training_plan_list {\n          id\n          completion_status\n          result\n          result_status\n          year\n          employee {\n            id\n            fname\n            lname\n            email\n            phone\n            id_num\n            passport_num\n            employment_num\n            job_position {\n              id\n              name\n            }\n            department {\n              id\n              name\n            }\n          }\n          course {\n            id\n            name\n          }\n          training {\n            id\n            course {\n              id\n              name\n            }\n          }\n        }\n        training_register_list {\n          id\n          date\n          time_or_duration\n          list_proof\n          institution_conducting_training\n          trainer {\n            id\n            fname\n            lname\n            email\n            phone\n          }\n          trainer_external {\n            id\n            fname\n            lname\n            email\n            phone\n          }\n          employee_list {\n            employee {\n              id\n              fname\n              lname\n              email\n              phone\n            }\n            id\n          }\n        }\n        company {\n          id\n          name\n        }\n        client {\n          id\n          name\n        }\n        project {\n          id\n          name\n        }\n        site {\n          id\n          name\n        }\n      }\n    }\n  }\n}\n"
  }
};
})();

node.hash = "6bbfcf0774a67de3ef9c765e15d19497";

module.exports = node;
