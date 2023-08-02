/**
 * @generated SignedSource<<e7de549a131006e6d32244407780290a>>
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
v4 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "username",
  "storageKey": null
},
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
v10 = [
  (v2/*: any*/),
  (v3/*: any*/)
],
v11 = {
  "alias": null,
  "args": null,
  "concreteType": "default_companies",
  "kind": "LinkedField",
  "name": "company",
  "plural": false,
  "selections": (v10/*: any*/),
  "storageKey": null
},
v12 = {
  "alias": null,
  "args": null,
  "concreteType": "default_clients",
  "kind": "LinkedField",
  "name": "client",
  "plural": false,
  "selections": (v10/*: any*/),
  "storageKey": null
},
v13 = {
  "alias": null,
  "args": null,
  "concreteType": "default_projects",
  "kind": "LinkedField",
  "name": "project",
  "plural": false,
  "selections": (v10/*: any*/),
  "storageKey": null
},
v14 = [
  (v2/*: any*/),
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
      (v2/*: any*/),
      (v3/*: any*/),
      (v4/*: any*/)
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
      (v2/*: any*/),
      (v3/*: any*/),
      (v11/*: any*/),
      (v12/*: any*/),
      (v13/*: any*/)
    ],
    "storageKey": null
  }
],
v15 = [
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
    "concreteType": "default_contractors",
    "kind": "LinkedField",
    "name": "update_default_contractors_by_pk",
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
      (v4/*: any*/),
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
              (v2/*: any*/),
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
        "selections": (v14/*: any*/),
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
        "selections": (v14/*: any*/),
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
        "selections": (v14/*: any*/),
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
        "selections": (v14/*: any*/),
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
        "selections": (v14/*: any*/),
        "storageKey": "site_list(where:{\"status\":{\"_eq\":\"Removed\"}})"
      },
      {
        "alias": null,
        "args": null,
        "concreteType": "proxy_contractors__sites",
        "kind": "LinkedField",
        "name": "site_list",
        "plural": true,
        "selections": (v14/*: any*/),
        "storageKey": null
      },
      (v11/*: any*/),
      (v12/*: any*/),
      (v13/*: any*/)
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
    "name": "updateContractorMutation",
    "selections": (v15/*: any*/),
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
    "name": "updateContractorMutation",
    "selections": (v15/*: any*/)
  },
  "params": {
    "cacheID": "b689f1888732494712be34e017abc47b",
    "id": null,
    "metadata": {},
    "name": "updateContractorMutation",
    "operationKind": "mutation",
    "text": "mutation updateContractorMutation(\n  $id: default_contractors_pk_columns_input!\n  $_set: default_contractors_set_input!\n) {\n  update_default_contractors_by_pk(pk_columns: $id, _set: $_set) {\n    id\n    created_at\n    name\n    username\n    inc_contractor_pack\n    contractor_user_list_aggregate {\n      aggregate {\n        count\n      }\n    }\n    employee_list_aggregate {\n      aggregate {\n        count\n      }\n    }\n    questionnaire_list_aggregate: contractor_questionnaire_list_aggregate {\n      aggregate {\n        count\n      }\n    }\n    questionnaire_active_list_aggregate: contractor_questionnaire_list_aggregate(where: {status: {_neq: \"CompleteAccepted\"}}) {\n      aggregate {\n        count\n      }\n    }\n    questionnaire_complete_list_aggregate: contractor_questionnaire_list_aggregate(where: {status: {_eq: \"CompleteAccepted\"}}) {\n      aggregate {\n        count\n      }\n    }\n    questionnaire_compliance_list_aggregate: contractor_questionnaire_list_aggregate(where: {status: {_eq: \"CompleteAccepted\"}}) {\n      nodes {\n        id\n        question_list_aggregate {\n          aggregate {\n            sum {\n              score\n              maxScore\n            }\n            min {\n              score\n            }\n            max {\n              score\n            }\n            avg {\n              score\n            }\n          }\n        }\n      }\n    }\n    incident_list_aggregate {\n      aggregate {\n        count\n      }\n    }\n    site_pending_list: site_list(where: {status: {_eq: \"Pending\"}}) {\n      id\n      status\n      contractor {\n        id\n        name\n        username\n      }\n      site {\n        id\n        name\n        company {\n          id\n          name\n        }\n        client {\n          id\n          name\n        }\n        project {\n          id\n          name\n        }\n      }\n    }\n    site_accepted_list: site_list(where: {status: {_eq: \"Accepted\"}}) {\n      id\n      status\n      contractor {\n        id\n        name\n        username\n      }\n      site {\n        id\n        name\n        company {\n          id\n          name\n        }\n        client {\n          id\n          name\n        }\n        project {\n          id\n          name\n        }\n      }\n    }\n    site_declined_list: site_list(where: {status: {_eq: \"Declined\"}}) {\n      id\n      status\n      contractor {\n        id\n        name\n        username\n      }\n      site {\n        id\n        name\n        company {\n          id\n          name\n        }\n        client {\n          id\n          name\n        }\n        project {\n          id\n          name\n        }\n      }\n    }\n    site_cancelled_list: site_list(where: {status: {_eq: \"Cancelled\"}}) {\n      id\n      status\n      contractor {\n        id\n        name\n        username\n      }\n      site {\n        id\n        name\n        company {\n          id\n          name\n        }\n        client {\n          id\n          name\n        }\n        project {\n          id\n          name\n        }\n      }\n    }\n    site_removed_list: site_list(where: {status: {_eq: \"Removed\"}}) {\n      id\n      status\n      contractor {\n        id\n        name\n        username\n      }\n      site {\n        id\n        name\n        company {\n          id\n          name\n        }\n        client {\n          id\n          name\n        }\n        project {\n          id\n          name\n        }\n      }\n    }\n    site_list {\n      id\n      status\n      contractor {\n        id\n        name\n        username\n      }\n      site {\n        id\n        name\n        company {\n          id\n          name\n        }\n        client {\n          id\n          name\n        }\n        project {\n          id\n          name\n        }\n      }\n    }\n    company {\n      id\n      name\n    }\n    client {\n      id\n      name\n    }\n    project {\n      id\n      name\n    }\n  }\n}\n"
  }
};
})();

node.hash = "684f5250ca56f743098f0282eb94525b";

module.exports = node;
