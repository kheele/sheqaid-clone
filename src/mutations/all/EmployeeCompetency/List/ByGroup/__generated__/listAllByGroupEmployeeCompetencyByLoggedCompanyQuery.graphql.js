/**
 * @generated SignedSource<<13e06e850c80b48c1316ee836d195f02>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* eslint-disable */

'use strict';

var node = (function(){
var v0 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "company_id"
},
v1 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "removed"
},
v2 = [
  {
    "fields": [
      {
        "kind": "Variable",
        "name": "_eq",
        "variableName": "removed"
      }
    ],
    "kind": "ObjectValue",
    "name": "removed"
  }
],
v3 = [
  {
    "fields": [
      {
        "fields": [
          {
            "kind": "Variable",
            "name": "_eq",
            "variableName": "company_id"
          }
        ],
        "kind": "ObjectValue",
        "name": "company_id"
      },
      {
        "fields": (v2/*: any*/),
        "kind": "ObjectValue",
        "name": "competency_list"
      },
      {
        "kind": "Literal",
        "name": "competency_list_aggregate",
        "value": {
          "count": {
            "predicate": {
              "_gt": 0
            }
          }
        }
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
  "name": "fname",
  "storageKey": null
},
v7 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "lname",
  "storageKey": null
},
v8 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "phone",
  "storageKey": null
},
v9 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "email",
  "storageKey": null
},
v10 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "id_num",
  "storageKey": null
},
v11 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "passport_num",
  "storageKey": null
},
v12 = [
  {
    "kind": "Literal",
    "name": "order_by",
    "value": {
      "expiry_date": "desc_nulls_last"
    }
  },
  {
    "fields": (v2/*: any*/),
    "kind": "ObjectValue",
    "name": "where"
  }
],
v13 = [
  (v4/*: any*/),
  {
    "alias": null,
    "args": null,
    "kind": "ScalarField",
    "name": "name",
    "storageKey": null
  }
],
v14 = {
  "alias": null,
  "args": null,
  "concreteType": "default_companies",
  "kind": "LinkedField",
  "name": "company",
  "plural": false,
  "selections": (v13/*: any*/),
  "storageKey": null
},
v15 = {
  "alias": null,
  "args": null,
  "concreteType": "default_clients",
  "kind": "LinkedField",
  "name": "client",
  "plural": false,
  "selections": (v13/*: any*/),
  "storageKey": null
},
v16 = {
  "alias": null,
  "args": null,
  "concreteType": "default_projects",
  "kind": "LinkedField",
  "name": "project",
  "plural": false,
  "selections": (v13/*: any*/),
  "storageKey": null
},
v17 = {
  "alias": null,
  "args": null,
  "concreteType": "default_sites",
  "kind": "LinkedField",
  "name": "site",
  "plural": false,
  "selections": (v13/*: any*/),
  "storageKey": null
};
return {
  "fragment": {
    "argumentDefinitions": [
      (v0/*: any*/),
      (v1/*: any*/)
    ],
    "kind": "Fragment",
    "metadata": null,
    "name": "listAllByGroupEmployeeCompetencyByLoggedCompanyQuery",
    "selections": [
      {
        "alias": null,
        "args": (v3/*: any*/),
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
                  (v4/*: any*/),
                  (v5/*: any*/),
                  (v6/*: any*/),
                  (v7/*: any*/),
                  (v8/*: any*/),
                  (v9/*: any*/),
                  (v10/*: any*/),
                  (v11/*: any*/),
                  {
                    "alias": null,
                    "args": (v12/*: any*/),
                    "concreteType": "hr_employees_docs_competencies",
                    "kind": "LinkedField",
                    "name": "competency_list",
                    "plural": true,
                    "selections": [
                      {
                        "args": null,
                        "kind": "FragmentSpread",
                        "name": "EmployeeCompetencyInsideEmployeeFragment"
                      }
                    ],
                    "storageKey": null
                  },
                  (v14/*: any*/),
                  (v15/*: any*/),
                  (v16/*: any*/),
                  (v17/*: any*/)
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
    "name": "listAllByGroupEmployeeCompetencyByLoggedCompanyQuery",
    "selections": [
      {
        "alias": null,
        "args": (v3/*: any*/),
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
                  (v4/*: any*/),
                  (v5/*: any*/),
                  (v6/*: any*/),
                  (v7/*: any*/),
                  (v8/*: any*/),
                  (v9/*: any*/),
                  (v10/*: any*/),
                  (v11/*: any*/),
                  {
                    "alias": null,
                    "args": (v12/*: any*/),
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
                          (v4/*: any*/)
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
                            "selections": (v13/*: any*/),
                            "storageKey": null
                          }
                        ],
                        "storageKey": null
                      },
                      (v14/*: any*/),
                      (v15/*: any*/),
                      (v16/*: any*/),
                      (v17/*: any*/)
                    ],
                    "storageKey": null
                  },
                  (v14/*: any*/),
                  (v15/*: any*/),
                  (v16/*: any*/),
                  (v17/*: any*/)
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
    "cacheID": "5ca6c98946716660f3f84ef9d2353e84",
    "id": null,
    "metadata": {},
    "name": "listAllByGroupEmployeeCompetencyByLoggedCompanyQuery",
    "operationKind": "query",
    "text": "query listAllByGroupEmployeeCompetencyByLoggedCompanyQuery(\n  $removed: Boolean\n  $company_id: bigint\n) {\n  hr_employees_connection(where: {company_id: {_eq: $company_id}, competency_list_aggregate: {count: {predicate: {_gt: 0}}}, competency_list: {removed: {_eq: $removed}}}) {\n    edges {\n      node {\n        id\n        created_at\n        fname\n        lname\n        phone\n        email\n        id_num\n        passport_num\n        competency_list(where: {removed: {_eq: $removed}}, order_by: {expiry_date: desc_nulls_last}) {\n          ...EmployeeCompetencyInsideEmployeeFragment\n          id\n        }\n        company {\n          id\n          name\n        }\n        client {\n          id\n          name\n        }\n        project {\n          id\n          name\n        }\n        site {\n          id\n          name\n        }\n      }\n    }\n  }\n}\n\nfragment EmployeeCompetencyInsideEmployeeFragment on hr_employees_docs_competencies {\n  id\n  created_at\n  accreditation_num\n  competency_type\n  type\n  doc\n  issued_date\n  expiry_date\n  expiry_updated\n  employee {\n    id\n  }\n  training {\n    id\n    course {\n      id\n      name\n    }\n  }\n  company {\n    id\n    name\n  }\n  client {\n    id\n    name\n  }\n  project {\n    id\n    name\n  }\n  site {\n    id\n    name\n  }\n}\n"
  }
};
})();

node.hash = "a395af42cde293a4e23517bb493fe210";

module.exports = node;
