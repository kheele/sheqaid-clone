/**
 * @generated SignedSource<<e5e52cf668065aa1fd686664cc66418a>>
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
    "name": "linked_company_id"
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
v3 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "username",
  "storageKey": null
},
v4 = [
  (v1/*: any*/),
  (v2/*: any*/)
],
v5 = [
  {
    "alias": null,
    "args": null,
    "kind": "ScalarField",
    "name": "count",
    "storageKey": null
  }
],
v6 = [
  {
    "alias": null,
    "args": null,
    "concreteType": "default_contractor_questionnaires_aggregate_fields",
    "kind": "LinkedField",
    "name": "aggregate",
    "plural": false,
    "selections": (v5/*: any*/),
    "storageKey": null
  }
],
v7 = [
  {
    "kind": "Literal",
    "name": "where",
    "value": {
      "status": {
        "_eq": "CompleteAccepted"
      }
    }
  }
],
v8 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "score",
  "storageKey": null
},
v9 = [
  (v8/*: any*/)
],
v10 = {
  "alias": null,
  "args": null,
  "concreteType": "default_companies",
  "kind": "LinkedField",
  "name": "company",
  "plural": false,
  "selections": (v4/*: any*/),
  "storageKey": null
},
v11 = {
  "alias": null,
  "args": null,
  "concreteType": "default_clients",
  "kind": "LinkedField",
  "name": "client",
  "plural": false,
  "selections": (v4/*: any*/),
  "storageKey": null
},
v12 = {
  "alias": null,
  "args": null,
  "concreteType": "default_projects",
  "kind": "LinkedField",
  "name": "project",
  "plural": false,
  "selections": (v4/*: any*/),
  "storageKey": null
},
v13 = [
  (v1/*: any*/),
  {
    "alias": null,
    "args": null,
    "kind": "ScalarField",
    "name": "status",
    "storageKey": null
  },
  {
    "alias": null,
    "args": null,
    "concreteType": "default_contractors",
    "kind": "LinkedField",
    "name": "contractor",
    "plural": false,
    "selections": [
      (v1/*: any*/),
      (v2/*: any*/),
      (v3/*: any*/)
    ],
    "storageKey": null
  },
  {
    "alias": null,
    "args": null,
    "concreteType": "default_sites",
    "kind": "LinkedField",
    "name": "site",
    "plural": false,
    "selections": [
      (v1/*: any*/),
      (v2/*: any*/),
      (v10/*: any*/),
      (v11/*: any*/),
      (v12/*: any*/)
    ],
    "storageKey": null
  }
],
v14 = [
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
                "variableName": "linked_company_id"
              }
            ],
            "kind": "ObjectValue",
            "name": "linked_company_id"
          }
        ],
        "kind": "ObjectValue",
        "name": "where"
      }
    ],
    "concreteType": "default_contractorsConnection",
    "kind": "LinkedField",
    "name": "default_contractors_connection",
    "plural": false,
    "selections": [
      {
        "alias": null,
        "args": null,
        "concreteType": "default_contractorsEdge",
        "kind": "LinkedField",
        "name": "edges",
        "plural": true,
        "selections": [
          {
            "alias": null,
            "args": null,
            "concreteType": "default_contractors",
            "kind": "LinkedField",
            "name": "node",
            "plural": false,
            "selections": [
              (v1/*: any*/),
              {
                "alias": null,
                "args": null,
                "kind": "ScalarField",
                "name": "created_at",
                "storageKey": null
              },
              (v2/*: any*/),
              (v3/*: any*/),
              {
                "alias": null,
                "args": null,
                "kind": "ScalarField",
                "name": "inc_contractor_pack",
                "storageKey": null
              },
              {
                "alias": null,
                "args": null,
                "kind": "ScalarField",
                "name": "linked_company_id",
                "storageKey": null
              },
              {
                "alias": null,
                "args": null,
                "concreteType": "default_clients",
                "kind": "LinkedField",
                "name": "linked_company",
                "plural": false,
                "selections": (v4/*: any*/),
                "storageKey": null
              },
              {
                "alias": null,
                "args": null,
                "concreteType": "default_contractor_users_aggregate",
                "kind": "LinkedField",
                "name": "contractor_user_list_aggregate",
                "plural": false,
                "selections": [
                  {
                    "alias": null,
                    "args": null,
                    "concreteType": "default_contractor_users_aggregate_fields",
                    "kind": "LinkedField",
                    "name": "aggregate",
                    "plural": false,
                    "selections": (v5/*: any*/),
                    "storageKey": null
                  }
                ],
                "storageKey": null
              },
              {
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
                    "concreteType": "hr_employees_aggregate_fields",
                    "kind": "LinkedField",
                    "name": "aggregate",
                    "plural": false,
                    "selections": (v5/*: any*/),
                    "storageKey": null
                  }
                ],
                "storageKey": null
              },
              {
                "alias": "questionnaire_list_aggregate",
                "args": null,
                "concreteType": "default_contractor_questionnaires_aggregate",
                "kind": "LinkedField",
                "name": "contractor_questionnaire_list_aggregate",
                "plural": false,
                "selections": (v6/*: any*/),
                "storageKey": null
              },
              {
                "alias": "questionnaire_active_list_aggregate",
                "args": [
                  {
                    "kind": "Literal",
                    "name": "where",
                    "value": {
                      "status": {
                        "_neq": "CompleteAccepted"
                      }
                    }
                  }
                ],
                "concreteType": "default_contractor_questionnaires_aggregate",
                "kind": "LinkedField",
                "name": "contractor_questionnaire_list_aggregate",
                "plural": false,
                "selections": (v6/*: any*/),
                "storageKey": "contractor_questionnaire_list_aggregate(where:{\"status\":{\"_neq\":\"CompleteAccepted\"}})"
              },
              {
                "alias": "questionnaire_complete_list_aggregate",
                "args": (v7/*: any*/),
                "concreteType": "default_contractor_questionnaires_aggregate",
                "kind": "LinkedField",
                "name": "contractor_questionnaire_list_aggregate",
                "plural": false,
                "selections": (v6/*: any*/),
                "storageKey": "contractor_questionnaire_list_aggregate(where:{\"status\":{\"_eq\":\"CompleteAccepted\"}})"
              },
              {
                "alias": "questionnaire_compliance_list_aggregate",
                "args": (v7/*: any*/),
                "concreteType": "default_contractor_questionnaires_aggregate",
                "kind": "LinkedField",
                "name": "contractor_questionnaire_list_aggregate",
                "plural": false,
                "selections": [
                  {
                    "alias": null,
                    "args": null,
                    "concreteType": "default_contractor_questionnaires",
                    "kind": "LinkedField",
                    "name": "nodes",
                    "plural": true,
                    "selections": [
                      (v1/*: any*/),
                      {
                        "alias": null,
                        "args": null,
                        "concreteType": "default_contractor_questionnaires_ques_aggregate",
                        "kind": "LinkedField",
                        "name": "question_list_aggregate",
                        "plural": false,
                        "selections": [
                          {
                            "alias": null,
                            "args": null,
                            "concreteType": "default_contractor_questionnaires_ques_aggregate_fields",
                            "kind": "LinkedField",
                            "name": "aggregate",
                            "plural": false,
                            "selections": [
                              {
                                "alias": null,
                                "args": null,
                                "concreteType": "default_contractor_questionnaires_ques_sum_fields",
                                "kind": "LinkedField",
                                "name": "sum",
                                "plural": false,
                                "selections": [
                                  (v8/*: any*/),
                                  {
                                    "alias": null,
                                    "args": null,
                                    "kind": "ScalarField",
                                    "name": "maxScore",
                                    "storageKey": null
                                  }
                                ],
                                "storageKey": null
                              },
                              {
                                "alias": null,
                                "args": null,
                                "concreteType": "default_contractor_questionnaires_ques_min_fields",
                                "kind": "LinkedField",
                                "name": "min",
                                "plural": false,
                                "selections": (v9/*: any*/),
                                "storageKey": null
                              },
                              {
                                "alias": null,
                                "args": null,
                                "concreteType": "default_contractor_questionnaires_ques_max_fields",
                                "kind": "LinkedField",
                                "name": "max",
                                "plural": false,
                                "selections": (v9/*: any*/),
                                "storageKey": null
                              },
                              {
                                "alias": null,
                                "args": null,
                                "concreteType": "default_contractor_questionnaires_ques_avg_fields",
                                "kind": "LinkedField",
                                "name": "avg",
                                "plural": false,
                                "selections": (v9/*: any*/),
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
                "storageKey": "contractor_questionnaire_list_aggregate(where:{\"status\":{\"_eq\":\"CompleteAccepted\"}})"
              },
              {
                "alias": null,
                "args": null,
                "concreteType": "sheq_incident_investigation_aggregate",
                "kind": "LinkedField",
                "name": "incident_list_aggregate",
                "plural": false,
                "selections": [
                  {
                    "alias": null,
                    "args": null,
                    "concreteType": "sheq_incident_investigation_aggregate_fields",
                    "kind": "LinkedField",
                    "name": "aggregate",
                    "plural": false,
                    "selections": (v5/*: any*/),
                    "storageKey": null
                  }
                ],
                "storageKey": null
              },
              {
                "alias": "site_pending_list",
                "args": [
                  {
                    "kind": "Literal",
                    "name": "where",
                    "value": {
                      "status": {
                        "_eq": "Pending"
                      }
                    }
                  }
                ],
                "concreteType": "proxy_contractors__sites",
                "kind": "LinkedField",
                "name": "site_list",
                "plural": true,
                "selections": (v13/*: any*/),
                "storageKey": "site_list(where:{\"status\":{\"_eq\":\"Pending\"}})"
              },
              {
                "alias": "site_accepted_list",
                "args": [
                  {
                    "kind": "Literal",
                    "name": "where",
                    "value": {
                      "status": {
                        "_eq": "Accepted"
                      }
                    }
                  }
                ],
                "concreteType": "proxy_contractors__sites",
                "kind": "LinkedField",
                "name": "site_list",
                "plural": true,
                "selections": (v13/*: any*/),
                "storageKey": "site_list(where:{\"status\":{\"_eq\":\"Accepted\"}})"
              },
              {
                "alias": "site_declined_list",
                "args": [
                  {
                    "kind": "Literal",
                    "name": "where",
                    "value": {
                      "status": {
                        "_eq": "Declined"
                      }
                    }
                  }
                ],
                "concreteType": "proxy_contractors__sites",
                "kind": "LinkedField",
                "name": "site_list",
                "plural": true,
                "selections": (v13/*: any*/),
                "storageKey": "site_list(where:{\"status\":{\"_eq\":\"Declined\"}})"
              },
              {
                "alias": "site_cancelled_list",
                "args": [
                  {
                    "kind": "Literal",
                    "name": "where",
                    "value": {
                      "status": {
                        "_eq": "Cancelled"
                      }
                    }
                  }
                ],
                "concreteType": "proxy_contractors__sites",
                "kind": "LinkedField",
                "name": "site_list",
                "plural": true,
                "selections": (v13/*: any*/),
                "storageKey": "site_list(where:{\"status\":{\"_eq\":\"Cancelled\"}})"
              },
              {
                "alias": "site_removed_list",
                "args": [
                  {
                    "kind": "Literal",
                    "name": "where",
                    "value": {
                      "status": {
                        "_eq": "Removed"
                      }
                    }
                  }
                ],
                "concreteType": "proxy_contractors__sites",
                "kind": "LinkedField",
                "name": "site_list",
                "plural": true,
                "selections": (v13/*: any*/),
                "storageKey": "site_list(where:{\"status\":{\"_eq\":\"Removed\"}})"
              },
              {
                "alias": null,
                "args": null,
                "concreteType": "proxy_contractors__sites",
                "kind": "LinkedField",
                "name": "site_list",
                "plural": true,
                "selections": (v13/*: any*/),
                "storageKey": null
              },
              (v10/*: any*/),
              (v11/*: any*/),
              (v12/*: any*/)
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
    "name": "findByLinkedCompanyIdUsernameContractorQuery",
    "selections": (v14/*: any*/),
    "type": "query_root",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "findByLinkedCompanyIdUsernameContractorQuery",
    "selections": (v14/*: any*/)
  },
  "params": {
    "cacheID": "5244eb93da35a23f4083baac6fa33312",
    "id": null,
    "metadata": {},
    "name": "findByLinkedCompanyIdUsernameContractorQuery",
    "operationKind": "query",
    "text": "query findByLinkedCompanyIdUsernameContractorQuery(\n  $linked_company_id: bigint\n) {\n  default_contractors_connection(where: {linked_company_id: {_eq: $linked_company_id}}) {\n    edges {\n      node {\n        id\n        created_at\n        name\n        username\n        inc_contractor_pack\n        linked_company_id\n        linked_company {\n          id\n          name\n        }\n        contractor_user_list_aggregate {\n          aggregate {\n            count\n          }\n        }\n        employee_list_aggregate {\n          aggregate {\n            count\n          }\n        }\n        questionnaire_list_aggregate: contractor_questionnaire_list_aggregate {\n          aggregate {\n            count\n          }\n        }\n        questionnaire_active_list_aggregate: contractor_questionnaire_list_aggregate(where: {status: {_neq: \"CompleteAccepted\"}}) {\n          aggregate {\n            count\n          }\n        }\n        questionnaire_complete_list_aggregate: contractor_questionnaire_list_aggregate(where: {status: {_eq: \"CompleteAccepted\"}}) {\n          aggregate {\n            count\n          }\n        }\n        questionnaire_compliance_list_aggregate: contractor_questionnaire_list_aggregate(where: {status: {_eq: \"CompleteAccepted\"}}) {\n          nodes {\n            id\n            question_list_aggregate {\n              aggregate {\n                sum {\n                  score\n                  maxScore\n                }\n                min {\n                  score\n                }\n                max {\n                  score\n                }\n                avg {\n                  score\n                }\n              }\n            }\n          }\n        }\n        incident_list_aggregate {\n          aggregate {\n            count\n          }\n        }\n        site_pending_list: site_list(where: {status: {_eq: \"Pending\"}}) {\n          id\n          status\n          contractor {\n            id\n            name\n            username\n          }\n          site {\n            id\n            name\n            company {\n              id\n              name\n            }\n            client {\n              id\n              name\n            }\n            project {\n              id\n              name\n            }\n          }\n        }\n        site_accepted_list: site_list(where: {status: {_eq: \"Accepted\"}}) {\n          id\n          status\n          contractor {\n            id\n            name\n            username\n          }\n          site {\n            id\n            name\n            company {\n              id\n              name\n            }\n            client {\n              id\n              name\n            }\n            project {\n              id\n              name\n            }\n          }\n        }\n        site_declined_list: site_list(where: {status: {_eq: \"Declined\"}}) {\n          id\n          status\n          contractor {\n            id\n            name\n            username\n          }\n          site {\n            id\n            name\n            company {\n              id\n              name\n            }\n            client {\n              id\n              name\n            }\n            project {\n              id\n              name\n            }\n          }\n        }\n        site_cancelled_list: site_list(where: {status: {_eq: \"Cancelled\"}}) {\n          id\n          status\n          contractor {\n            id\n            name\n            username\n          }\n          site {\n            id\n            name\n            company {\n              id\n              name\n            }\n            client {\n              id\n              name\n            }\n            project {\n              id\n              name\n            }\n          }\n        }\n        site_removed_list: site_list(where: {status: {_eq: \"Removed\"}}) {\n          id\n          status\n          contractor {\n            id\n            name\n            username\n          }\n          site {\n            id\n            name\n            company {\n              id\n              name\n            }\n            client {\n              id\n              name\n            }\n            project {\n              id\n              name\n            }\n          }\n        }\n        site_list {\n          id\n          status\n          contractor {\n            id\n            name\n            username\n          }\n          site {\n            id\n            name\n            company {\n              id\n              name\n            }\n            client {\n              id\n              name\n            }\n            project {\n              id\n              name\n            }\n          }\n        }\n        company {\n          id\n          name\n        }\n        client {\n          id\n          name\n        }\n        project {\n          id\n          name\n        }\n      }\n    }\n  }\n}\n"
  }
};
})();

node.hash = "e320ef1221dcd225283419812376073a";

module.exports = node;
