/**
 * @generated SignedSource<<bb62401d9c1602edb639231cf2bbae07>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* eslint-disable */

'use strict';

var node = (function(){
var v0 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "project_id"
},
v1 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "removed"
},
v2 = {
  "fields": [
    {
      "kind": "Variable",
      "name": "_eq",
      "variableName": "removed"
    }
  ],
  "kind": "ObjectValue",
  "name": "removed"
},
v3 = [
  {
    "fields": [
      {
        "fields": [
          {
            "kind": "Variable",
            "name": "_eq",
            "variableName": "project_id"
          }
        ],
        "kind": "ObjectValue",
        "name": "project_id"
      },
      (v2/*: any*/)
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
  "name": "expiry_date",
  "storageKey": null
},
v6 = [
  (v4/*: any*/),
  {
    "alias": null,
    "args": null,
    "kind": "ScalarField",
    "name": "name",
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
    "name": "listAllEachEmployeeCompetencyByLoggedProjectQuery",
    "selections": [
      {
        "alias": null,
        "args": (v3/*: any*/),
        "concreteType": "hr_employees_docs_competenciesConnection",
        "kind": "LinkedField",
        "name": "hr_employees_docs_competencies_connection",
        "plural": false,
        "selections": [
          {
            "alias": null,
            "args": null,
            "concreteType": "hr_employees_docs_competenciesEdge",
            "kind": "LinkedField",
            "name": "edges",
            "plural": true,
            "selections": [
              {
                "alias": null,
                "args": null,
                "concreteType": "hr_employees_docs_competencies",
                "kind": "LinkedField",
                "name": "node",
                "plural": false,
                "selections": [
                  {
                    "args": [
                      {
                        "kind": "Variable",
                        "name": "removed",
                        "variableName": "removed"
                      }
                    ],
                    "kind": "FragmentSpread",
                    "name": "EmployeeCompetencyFragment"
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
    "type": "query_root",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": [
      (v1/*: any*/),
      (v0/*: any*/)
    ],
    "kind": "Operation",
    "name": "listAllEachEmployeeCompetencyByLoggedProjectQuery",
    "selections": [
      {
        "alias": null,
        "args": (v3/*: any*/),
        "concreteType": "hr_employees_docs_competenciesConnection",
        "kind": "LinkedField",
        "name": "hr_employees_docs_competencies_connection",
        "plural": false,
        "selections": [
          {
            "alias": null,
            "args": null,
            "concreteType": "hr_employees_docs_competenciesEdge",
            "kind": "LinkedField",
            "name": "edges",
            "plural": true,
            "selections": [
              {
                "alias": null,
                "args": null,
                "concreteType": "hr_employees_docs_competencies",
                "kind": "LinkedField",
                "name": "node",
                "plural": false,
                "selections": [
                  (v4/*: any*/),
                  {
                    "alias": null,
                    "args": null,
                    "kind": "ScalarField",
                    "name": "created_at",
                    "storageKey": null
                  },
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
                  (v5/*: any*/),
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
                        "name": "phone",
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
                        "args": [
                          {
                            "fields": [
                              (v2/*: any*/)
                            ],
                            "kind": "ObjectValue",
                            "name": "where"
                          }
                        ],
                        "concreteType": "hr_employees_docs_competencies",
                        "kind": "LinkedField",
                        "name": "competency_list",
                        "plural": true,
                        "selections": [
                          (v4/*: any*/),
                          (v5/*: any*/)
                        ],
                        "storageKey": null
                      }
                    ],
                    "storageKey": null
                  },
                  {
                    "alias": null,
                    "args": null,
                    "concreteType": "sheq_training_matrices",
                    "kind": "LinkedField",
                    "name": "training",
                    "plural": false,
                    "selections": [
                      (v4/*: any*/),
                      {
                        "alias": null,
                        "args": null,
                        "concreteType": "sheq_training_courses",
                        "kind": "LinkedField",
                        "name": "course",
                        "plural": false,
                        "selections": (v6/*: any*/),
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
                    "selections": (v6/*: any*/),
                    "storageKey": null
                  },
                  {
                    "alias": null,
                    "args": null,
                    "concreteType": "default_clients",
                    "kind": "LinkedField",
                    "name": "client",
                    "plural": false,
                    "selections": (v6/*: any*/),
                    "storageKey": null
                  },
                  {
                    "alias": null,
                    "args": null,
                    "concreteType": "default_projects",
                    "kind": "LinkedField",
                    "name": "project",
                    "plural": false,
                    "selections": (v6/*: any*/),
                    "storageKey": null
                  },
                  {
                    "alias": null,
                    "args": null,
                    "concreteType": "default_sites",
                    "kind": "LinkedField",
                    "name": "site",
                    "plural": false,
                    "selections": (v6/*: any*/),
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
    ]
  },
  "params": {
    "cacheID": "f9941e199b7a339d1943f629e1976fcf",
    "id": null,
    "metadata": {},
    "name": "listAllEachEmployeeCompetencyByLoggedProjectQuery",
    "operationKind": "query",
    "text": "query listAllEachEmployeeCompetencyByLoggedProjectQuery(\n  $removed: Boolean\n  $project_id: bigint\n) {\n  hr_employees_docs_competencies_connection(where: {removed: {_eq: $removed}, project_id: {_eq: $project_id}}) {\n    edges {\n      node {\n        ...EmployeeCompetencyFragment_3qkEAc\n        id\n      }\n    }\n  }\n}\n\nfragment EmployeeCompetencyFragment_3qkEAc on hr_employees_docs_competencies {\n  id\n  created_at\n  accreditation_num\n  competency_type\n  type\n  doc\n  issued_date\n  expiry_date\n  expiry_updated\n  employee {\n    id\n    fname\n    lname\n    phone\n    email\n    id_num\n    passport_num\n    competency_list(where: {removed: {_eq: $removed}}) {\n      id\n      expiry_date\n    }\n  }\n  training {\n    id\n    course {\n      id\n      name\n    }\n  }\n  company {\n    id\n    name\n  }\n  client {\n    id\n    name\n  }\n  project {\n    id\n    name\n  }\n  site {\n    id\n    name\n  }\n}\n"
  }
};
})();

node.hash = "89de0aed3dcd830ef118aeb864069266";

module.exports = node;
