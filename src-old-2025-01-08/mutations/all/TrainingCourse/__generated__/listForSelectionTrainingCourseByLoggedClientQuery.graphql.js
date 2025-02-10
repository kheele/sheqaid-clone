/**
 * @generated SignedSource<<149128f0178aadde2dc64c389ccbecdc>>
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
    "name": "client_id"
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
  "name": "name",
  "storageKey": null
},
v3 = [
  (v1/*: any*/),
  (v2/*: any*/)
],
v4 = {
  "alias": null,
  "args": null,
  "concreteType": "default_job_positions",
  "kind": "LinkedField",
  "name": "job_position",
  "plural": false,
  "selections": (v3/*: any*/),
  "storageKey": null
},
v5 = {
  "alias": null,
  "args": null,
  "concreteType": "sheq_training_courses",
  "kind": "LinkedField",
  "name": "course",
  "plural": false,
  "selections": (v3/*: any*/),
  "storageKey": null
},
v6 = [
  {
    "alias": null,
    "args": [
      {
        "kind": "Literal",
        "name": "order_by",
        "value": [
          {
            "name": "asc_nulls_last"
          },
          {
            "unit_standard": "asc_nulls_last"
          },
          {
            "unit_standard_desc": "asc_nulls_last"
          }
        ]
      },
      {
        "fields": [
          {
            "fields": [
              {
                "kind": "Variable",
                "name": "_eq",
                "variableName": "client_id"
              }
            ],
            "kind": "ObjectValue",
            "name": "client_id"
          }
        ],
        "kind": "ObjectValue",
        "name": "where"
      }
    ],
    "concreteType": "sheq_training_coursesConnection",
    "kind": "LinkedField",
    "name": "sheq_training_courses_connection",
    "plural": false,
    "selections": [
      {
        "alias": null,
        "args": null,
        "concreteType": "sheq_training_coursesEdge",
        "kind": "LinkedField",
        "name": "edges",
        "plural": true,
        "selections": [
          {
            "alias": null,
            "args": null,
            "concreteType": "sheq_training_courses",
            "kind": "LinkedField",
            "name": "node",
            "plural": false,
            "selections": [
              (v1/*: any*/),
              (v2/*: any*/),
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
                "concreteType": "proxy_sector__training_course",
                "kind": "LinkedField",
                "name": "sector_list",
                "plural": true,
                "selections": [
                  (v1/*: any*/),
                  {
                    "alias": null,
                    "args": null,
                    "concreteType": "default_sectors",
                    "kind": "LinkedField",
                    "name": "sector",
                    "plural": false,
                    "selections": (v3/*: any*/),
                    "storageKey": null
                  }
                ],
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
                  (v1/*: any*/),
                  (v4/*: any*/)
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
                      (v1/*: any*/),
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
                      (v4/*: any*/),
                      {
                        "alias": null,
                        "args": null,
                        "concreteType": "default_departments",
                        "kind": "LinkedField",
                        "name": "department",
                        "plural": false,
                        "selections": (v3/*: any*/),
                        "storageKey": null
                      }
                    ],
                    "storageKey": null
                  },
                  (v5/*: any*/),
                  {
                    "alias": null,
                    "args": null,
                    "concreteType": "sheq_training_matrices",
                    "kind": "LinkedField",
                    "name": "training",
                    "plural": false,
                    "selections": [
                      (v1/*: any*/),
                      (v5/*: any*/)
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
    "name": "listForSelectionTrainingCourseByLoggedClientQuery",
    "selections": (v6/*: any*/),
    "type": "query_root",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "listForSelectionTrainingCourseByLoggedClientQuery",
    "selections": (v6/*: any*/)
  },
  "params": {
    "cacheID": "4424f326f276d2d1096fe28ba1c6b286",
    "id": null,
    "metadata": {},
    "name": "listForSelectionTrainingCourseByLoggedClientQuery",
    "operationKind": "query",
    "text": "query listForSelectionTrainingCourseByLoggedClientQuery(\n  $client_id: bigint\n) {\n  sheq_training_courses_connection(where: {client_id: {_eq: $client_id}}, order_by: [{name: asc_nulls_last}, {unit_standard: asc_nulls_last}, {unit_standard_desc: asc_nulls_last}]) {\n    edges {\n      node {\n        id\n        name\n        unit_standard\n        sector_list {\n          id\n          sector {\n            id\n            name\n          }\n        }\n        job_position_list {\n          id\n          job_position {\n            id\n            name\n          }\n        }\n        training_plan_list {\n          id\n          completion_status\n          result\n          result_status\n          year\n          employee {\n            id\n            fname\n            lname\n            email\n            phone\n            id_num\n            passport_num\n            employment_num\n            job_position {\n              id\n              name\n            }\n            department {\n              id\n              name\n            }\n          }\n          course {\n            id\n            name\n          }\n          training {\n            id\n            course {\n              id\n              name\n            }\n          }\n        }\n      }\n    }\n  }\n}\n"
  }
};
})();

node.hash = "45036c28b0a139aad0b84c49569d72ec";

module.exports = node;
