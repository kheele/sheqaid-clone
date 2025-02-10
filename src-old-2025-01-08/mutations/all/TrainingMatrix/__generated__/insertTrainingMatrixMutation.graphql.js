/**
 * @generated SignedSource<<2193c08104976c172070f9664ff29df2>>
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
    "name": "object"
  }
],
v1 = [
  {
    "kind": "Variable",
    "name": "object",
    "variableName": "object"
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
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "created_at",
  "storageKey": null
},
v4 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "competency_evaluation",
  "storageKey": null
},
v5 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "cost",
  "storageKey": null
},
v6 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "credits",
  "storageKey": null
},
v7 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "date_range_start",
  "storageKey": null
},
v8 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "date_range_end",
  "storageKey": null
},
v9 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "institution_conducting_training",
  "storageKey": null
},
v10 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "max_participants_per_course",
  "storageKey": null
},
v11 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "nqf_level",
  "storageKey": null
},
v12 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "provider_requirement",
  "storageKey": null
},
v13 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "requirement",
  "storageKey": null
},
v14 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "requirement_legal",
  "storageKey": null
},
v15 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "status",
  "storageKey": null
},
v16 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "training_frequency",
  "storageKey": null
},
v17 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "training_standard",
  "storageKey": null
},
v18 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "unit_standard",
  "storageKey": null
},
v19 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "unit_standard_desc",
  "storageKey": null
},
v20 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "fname",
  "storageKey": null
},
v21 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "lname",
  "storageKey": null
},
v22 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "email",
  "storageKey": null
},
v23 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "phone",
  "storageKey": null
},
v24 = [
  (v2/*: any*/),
  (v20/*: any*/),
  (v21/*: any*/),
  (v22/*: any*/),
  (v23/*: any*/)
],
v25 = {
  "alias": null,
  "args": null,
  "concreteType": "hr_employees",
  "kind": "LinkedField",
  "name": "trainer",
  "plural": false,
  "selections": (v24/*: any*/),
  "storageKey": null
},
v26 = {
  "alias": null,
  "args": null,
  "concreteType": "hr_employees_external",
  "kind": "LinkedField",
  "name": "trainer_external",
  "plural": false,
  "selections": (v24/*: any*/),
  "storageKey": null
},
v27 = [
  (v2/*: any*/),
  {
    "alias": null,
    "args": null,
    "kind": "ScalarField",
    "name": "name",
    "storageKey": null
  }
],
v28 = {
  "alias": null,
  "args": null,
  "concreteType": "default_job_positions",
  "kind": "LinkedField",
  "name": "trainer_job_position",
  "plural": false,
  "selections": (v27/*: any*/),
  "storageKey": null
},
v29 = {
  "alias": null,
  "args": null,
  "concreteType": "sheq_training_courses",
  "kind": "LinkedField",
  "name": "course",
  "plural": false,
  "selections": (v27/*: any*/),
  "storageKey": null
},
v30 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "id_num",
  "storageKey": null
},
v31 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "passport_num",
  "storageKey": null
},
v32 = {
  "alias": null,
  "args": null,
  "concreteType": "hr_employees_docs_competencies",
  "kind": "LinkedField",
  "name": "competency_list",
  "plural": true,
  "selections": [
    (v2/*: any*/),
    (v3/*: any*/),
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
        (v2/*: any*/),
        (v20/*: any*/),
        (v21/*: any*/),
        (v23/*: any*/),
        (v22/*: any*/),
        (v30/*: any*/),
        (v31/*: any*/)
      ],
      "storageKey": null
    }
  ],
  "storageKey": null
},
v33 = {
  "alias": null,
  "args": null,
  "concreteType": "proxy_job_category__training_matrix",
  "kind": "LinkedField",
  "name": "job_category_list",
  "plural": true,
  "selections": [
    (v2/*: any*/),
    {
      "alias": null,
      "args": null,
      "concreteType": "default_job_categories",
      "kind": "LinkedField",
      "name": "job_category",
      "plural": false,
      "selections": (v27/*: any*/),
      "storageKey": null
    }
  ],
  "storageKey": null
},
v34 = {
  "alias": null,
  "args": null,
  "concreteType": "default_job_positions",
  "kind": "LinkedField",
  "name": "job_position",
  "plural": false,
  "selections": (v27/*: any*/),
  "storageKey": null
},
v35 = {
  "alias": null,
  "args": null,
  "concreteType": "proxy_job_position__training_matrix",
  "kind": "LinkedField",
  "name": "job_position_list",
  "plural": true,
  "selections": [
    (v2/*: any*/),
    (v34/*: any*/)
  ],
  "storageKey": null
},
v36 = {
  "alias": null,
  "args": null,
  "concreteType": "proxy_sector__training_matrix",
  "kind": "LinkedField",
  "name": "sector_list",
  "plural": true,
  "selections": [
    (v2/*: any*/),
    {
      "alias": null,
      "args": null,
      "concreteType": "default_sectors",
      "kind": "LinkedField",
      "name": "sector",
      "plural": false,
      "selections": (v27/*: any*/),
      "storageKey": null
    }
  ],
  "storageKey": null
},
v37 = {
  "alias": null,
  "args": null,
  "concreteType": "sheq_training_plans__employee_training",
  "kind": "LinkedField",
  "name": "training_plan_list",
  "plural": true,
  "selections": [
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
        (v2/*: any*/),
        (v20/*: any*/),
        (v21/*: any*/),
        (v22/*: any*/),
        (v23/*: any*/),
        (v30/*: any*/),
        (v31/*: any*/),
        {
          "alias": null,
          "args": null,
          "kind": "ScalarField",
          "name": "employment_num",
          "storageKey": null
        },
        (v34/*: any*/),
        {
          "alias": null,
          "args": null,
          "concreteType": "default_departments",
          "kind": "LinkedField",
          "name": "department",
          "plural": false,
          "selections": (v27/*: any*/),
          "storageKey": null
        }
      ],
      "storageKey": null
    },
    (v29/*: any*/),
    {
      "alias": null,
      "args": null,
      "concreteType": "sheq_training_matrices",
      "kind": "LinkedField",
      "name": "training",
      "plural": false,
      "selections": [
        (v2/*: any*/),
        (v29/*: any*/)
      ],
      "storageKey": null
    }
  ],
  "storageKey": null
},
v38 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "date",
  "storageKey": null
},
v39 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "time_or_duration",
  "storageKey": null
},
v40 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "list_proof",
  "storageKey": null
},
v41 = {
  "alias": null,
  "args": null,
  "concreteType": "hr_employees",
  "kind": "LinkedField",
  "name": "employee",
  "plural": false,
  "selections": (v24/*: any*/),
  "storageKey": null
},
v42 = {
  "alias": null,
  "args": null,
  "concreteType": "default_companies",
  "kind": "LinkedField",
  "name": "company",
  "plural": false,
  "selections": (v27/*: any*/),
  "storageKey": null
},
v43 = {
  "alias": null,
  "args": null,
  "concreteType": "default_clients",
  "kind": "LinkedField",
  "name": "client",
  "plural": false,
  "selections": (v27/*: any*/),
  "storageKey": null
},
v44 = {
  "alias": null,
  "args": null,
  "concreteType": "default_projects",
  "kind": "LinkedField",
  "name": "project",
  "plural": false,
  "selections": (v27/*: any*/),
  "storageKey": null
},
v45 = {
  "alias": null,
  "args": null,
  "concreteType": "default_sites",
  "kind": "LinkedField",
  "name": "site",
  "plural": false,
  "selections": (v27/*: any*/),
  "storageKey": null
};
return {
  "fragment": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Fragment",
    "metadata": null,
    "name": "insertTrainingMatrixMutation",
    "selections": [
      {
        "alias": null,
        "args": (v1/*: any*/),
        "concreteType": "sheq_training_matrices",
        "kind": "LinkedField",
        "name": "insert_sheq_training_matrices_one",
        "plural": false,
        "selections": [
          (v2/*: any*/),
          (v3/*: any*/),
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
          (v25/*: any*/),
          (v26/*: any*/),
          (v28/*: any*/),
          (v29/*: any*/),
          (v32/*: any*/),
          (v33/*: any*/),
          (v35/*: any*/),
          (v36/*: any*/),
          (v37/*: any*/),
          {
            "alias": null,
            "args": null,
            "concreteType": "sheq_training_registers",
            "kind": "LinkedField",
            "name": "training_register_list",
            "plural": true,
            "selections": [
              (v2/*: any*/),
              (v38/*: any*/),
              (v39/*: any*/),
              (v40/*: any*/),
              (v9/*: any*/),
              (v25/*: any*/),
              (v26/*: any*/),
              {
                "alias": null,
                "args": null,
                "concreteType": "proxy_employee__training_register",
                "kind": "LinkedField",
                "name": "employee_list",
                "plural": true,
                "selections": [
                  (v41/*: any*/)
                ],
                "storageKey": null
              }
            ],
            "storageKey": null
          },
          (v42/*: any*/),
          (v43/*: any*/),
          (v44/*: any*/),
          (v45/*: any*/)
        ],
        "storageKey": null
      }
    ],
    "type": "mutation_root",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "insertTrainingMatrixMutation",
    "selections": [
      {
        "alias": null,
        "args": (v1/*: any*/),
        "concreteType": "sheq_training_matrices",
        "kind": "LinkedField",
        "name": "insert_sheq_training_matrices_one",
        "plural": false,
        "selections": [
          (v2/*: any*/),
          (v3/*: any*/),
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
          (v25/*: any*/),
          (v26/*: any*/),
          (v28/*: any*/),
          (v29/*: any*/),
          (v32/*: any*/),
          (v33/*: any*/),
          (v35/*: any*/),
          (v36/*: any*/),
          (v37/*: any*/),
          {
            "alias": null,
            "args": null,
            "concreteType": "sheq_training_registers",
            "kind": "LinkedField",
            "name": "training_register_list",
            "plural": true,
            "selections": [
              (v2/*: any*/),
              (v38/*: any*/),
              (v39/*: any*/),
              (v40/*: any*/),
              (v9/*: any*/),
              (v25/*: any*/),
              (v26/*: any*/),
              {
                "alias": null,
                "args": null,
                "concreteType": "proxy_employee__training_register",
                "kind": "LinkedField",
                "name": "employee_list",
                "plural": true,
                "selections": [
                  (v41/*: any*/),
                  (v2/*: any*/)
                ],
                "storageKey": null
              }
            ],
            "storageKey": null
          },
          (v42/*: any*/),
          (v43/*: any*/),
          (v44/*: any*/),
          (v45/*: any*/)
        ],
        "storageKey": null
      }
    ]
  },
  "params": {
    "cacheID": "5cbb7f807191cf1ed705b633c6d320c9",
    "id": null,
    "metadata": {},
    "name": "insertTrainingMatrixMutation",
    "operationKind": "mutation",
    "text": "mutation insertTrainingMatrixMutation(\n  $object: sheq_training_matrices_insert_input!\n) {\n  insert_sheq_training_matrices_one(object: $object) {\n    id\n    created_at\n    competency_evaluation\n    cost\n    credits\n    date_range_start\n    date_range_end\n    institution_conducting_training\n    max_participants_per_course\n    nqf_level\n    provider_requirement\n    requirement\n    requirement_legal\n    status\n    training_frequency\n    training_standard\n    unit_standard\n    unit_standard_desc\n    trainer {\n      id\n      fname\n      lname\n      email\n      phone\n    }\n    trainer_external {\n      id\n      fname\n      lname\n      email\n      phone\n    }\n    trainer_job_position {\n      id\n      name\n    }\n    course {\n      id\n      name\n    }\n    competency_list {\n      id\n      created_at\n      accreditation_num\n      competency_type\n      type\n      doc\n      issued_date\n      expiry_date\n      expiry_updated\n      employee {\n        id\n        fname\n        lname\n        phone\n        email\n        id_num\n        passport_num\n      }\n    }\n    job_category_list {\n      id\n      job_category {\n        id\n        name\n      }\n    }\n    job_position_list {\n      id\n      job_position {\n        id\n        name\n      }\n    }\n    sector_list {\n      id\n      sector {\n        id\n        name\n      }\n    }\n    training_plan_list {\n      id\n      completion_status\n      result\n      result_status\n      year\n      employee {\n        id\n        fname\n        lname\n        email\n        phone\n        id_num\n        passport_num\n        employment_num\n        job_position {\n          id\n          name\n        }\n        department {\n          id\n          name\n        }\n      }\n      course {\n        id\n        name\n      }\n      training {\n        id\n        course {\n          id\n          name\n        }\n      }\n    }\n    training_register_list {\n      id\n      date\n      time_or_duration\n      list_proof\n      institution_conducting_training\n      trainer {\n        id\n        fname\n        lname\n        email\n        phone\n      }\n      trainer_external {\n        id\n        fname\n        lname\n        email\n        phone\n      }\n      employee_list {\n        employee {\n          id\n          fname\n          lname\n          email\n          phone\n        }\n        id\n      }\n    }\n    company {\n      id\n      name\n    }\n    client {\n      id\n      name\n    }\n    project {\n      id\n      name\n    }\n    site {\n      id\n      name\n    }\n  }\n}\n"
  }
};
})();

node.hash = "76b6e036e3a393c75726fb50ed16e8b8";

module.exports = node;
