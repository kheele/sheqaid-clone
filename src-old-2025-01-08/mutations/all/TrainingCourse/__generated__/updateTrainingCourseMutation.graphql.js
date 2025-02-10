/**
 * @generated SignedSource<<04cd38a7eb64f5e67818ea74cb9c6dbd>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* eslint-disable */

'use strict';

var node = (function(){
var v0 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "_set"
},
v1 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "id"
},
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
  "name": "name",
  "storageKey": null
},
v4 = [
  (v2/*: any*/),
  (v3/*: any*/)
],
v5 = {
  "alias": null,
  "args": null,
  "concreteType": "default_job_positions",
  "kind": "LinkedField",
  "name": "job_position",
  "plural": false,
  "selections": (v4/*: any*/),
  "storageKey": null
},
v6 = [
  (v2/*: any*/)
],
v7 = {
  "alias": null,
  "args": null,
  "concreteType": "sheq_training_courses",
  "kind": "LinkedField",
  "name": "course",
  "plural": false,
  "selections": (v4/*: any*/),
  "storageKey": null
},
v8 = [
  {
    "alias": null,
    "args": [
      {
        "kind": "Variable",
        "name": "_set",
        "variableName": "_set"
      },
      {
        "kind": "Variable",
        "name": "pk_columns",
        "variableName": "id"
      }
    ],
    "concreteType": "sheq_training_courses",
    "kind": "LinkedField",
    "name": "update_sheq_training_courses_by_pk",
    "plural": false,
    "selections": [
      (v2/*: any*/),
      {
        "alias": null,
        "args": null,
        "kind": "ScalarField",
        "name": "created_at",
        "storageKey": null
      },
      (v3/*: any*/),
      {
        "alias": null,
        "args": null,
        "kind": "ScalarField",
        "name": "frequency",
        "storageKey": null
      },
      {
        "alias": null,
        "args": null,
        "kind": "ScalarField",
        "name": "provider",
        "storageKey": null
      },
      {
        "alias": null,
        "args": null,
        "kind": "ScalarField",
        "name": "unit_standard",
        "storageKey": null
      },
      {
        "alias": null,
        "args": null,
        "kind": "ScalarField",
        "name": "unit_standard_desc",
        "storageKey": null
      },
      {
        "alias": null,
        "args": null,
        "concreteType": "proxy_job_position__training_course",
        "kind": "LinkedField",
        "name": "job_position_list",
        "plural": true,
        "selections": [
          (v2/*: any*/),
          (v5/*: any*/)
        ],
        "storageKey": null
      },
      {
        "alias": null,
        "args": null,
        "concreteType": "proxy_sector__training_course",
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
            "selections": (v4/*: any*/),
            "storageKey": null
          }
        ],
        "storageKey": null
      },
      {
        "alias": null,
        "args": null,
        "concreteType": "sheq_training_manuals",
        "kind": "LinkedField",
        "name": "training_manual_list",
        "plural": true,
        "selections": (v6/*: any*/),
        "storageKey": null
      },
      {
        "alias": null,
        "args": null,
        "concreteType": "sheq_training_matrices",
        "kind": "LinkedField",
        "name": "training_matrix_list",
        "plural": true,
        "selections": (v6/*: any*/),
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
              {
                "alias": null,
                "args": null,
                "kind": "ScalarField",
                "name": "fname",
                "storageKey": null
              },
              {
                "alias": null,
                "args": null,
                "kind": "ScalarField",
                "name": "lname",
                "storageKey": null
              },
              {
                "alias": null,
                "args": null,
                "kind": "ScalarField",
                "name": "email",
                "storageKey": null
              },
              {
                "alias": null,
                "args": null,
                "kind": "ScalarField",
                "name": "phone",
                "storageKey": null
              },
              {
                "alias": null,
                "args": null,
                "kind": "ScalarField",
                "name": "id_num",
                "storageKey": null
              },
              {
                "alias": null,
                "args": null,
                "kind": "ScalarField",
                "name": "passport_num",
                "storageKey": null
              },
              {
                "alias": null,
                "args": null,
                "kind": "ScalarField",
                "name": "employment_num",
                "storageKey": null
              },
              (v5/*: any*/),
              {
                "alias": null,
                "args": null,
                "concreteType": "default_departments",
                "kind": "LinkedField",
                "name": "department",
                "plural": false,
                "selections": (v4/*: any*/),
                "storageKey": null
              }
            ],
            "storageKey": null
          },
          (v7/*: any*/),
          {
            "alias": null,
            "args": null,
            "concreteType": "sheq_training_matrices",
            "kind": "LinkedField",
            "name": "training",
            "plural": false,
            "selections": [
              (v2/*: any*/),
              (v7/*: any*/)
            ],
            "storageKey": null
          }
        ],
        "storageKey": null
      },
      {
        "alias": null,
        "args": null,
        "concreteType": "default_clients",
        "kind": "LinkedField",
        "name": "client",
        "plural": false,
        "selections": (v4/*: any*/),
        "storageKey": null
      },
      {
        "alias": null,
        "args": null,
        "concreteType": "default_projects",
        "kind": "LinkedField",
        "name": "project",
        "plural": false,
        "selections": (v4/*: any*/),
        "storageKey": null
      },
      {
        "alias": null,
        "args": null,
        "concreteType": "default_sites",
        "kind": "LinkedField",
        "name": "site",
        "plural": false,
        "selections": (v4/*: any*/),
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
      (v1/*: any*/)
    ],
    "kind": "Fragment",
    "metadata": null,
    "name": "updateTrainingCourseMutation",
    "selections": (v8/*: any*/),
    "type": "mutation_root",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": [
      (v1/*: any*/),
      (v0/*: any*/)
    ],
    "kind": "Operation",
    "name": "updateTrainingCourseMutation",
    "selections": (v8/*: any*/)
  },
  "params": {
    "cacheID": "b14e64f8ef7ec20deb5f76a7cb9a0929",
    "id": null,
    "metadata": {},
    "name": "updateTrainingCourseMutation",
    "operationKind": "mutation",
    "text": "mutation updateTrainingCourseMutation(\n  $id: sheq_training_courses_pk_columns_input!\n  $_set: sheq_training_courses_set_input!\n) {\n  update_sheq_training_courses_by_pk(pk_columns: $id, _set: $_set) {\n    id\n    created_at\n    name\n    frequency\n    provider\n    unit_standard\n    unit_standard_desc\n    job_position_list {\n      id\n      job_position {\n        id\n        name\n      }\n    }\n    sector_list {\n      id\n      sector {\n        id\n        name\n      }\n    }\n    training_manual_list {\n      id\n    }\n    training_matrix_list {\n      id\n    }\n    training_plan_list {\n      id\n      completion_status\n      result\n      result_status\n      year\n      employee {\n        id\n        fname\n        lname\n        email\n        phone\n        id_num\n        passport_num\n        employment_num\n        job_position {\n          id\n          name\n        }\n        department {\n          id\n          name\n        }\n      }\n      course {\n        id\n        name\n      }\n      training {\n        id\n        course {\n          id\n          name\n        }\n      }\n    }\n    client {\n      id\n      name\n    }\n    project {\n      id\n      name\n    }\n    site {\n      id\n      name\n    }\n  }\n}\n"
  }
};
})();

node.hash = "f5bd307ad5fea7d88d64762012ce86ac";

module.exports = node;
