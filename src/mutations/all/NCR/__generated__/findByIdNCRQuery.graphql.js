/**
 * @generated SignedSource<<4cb6c4f2892c8025fdf51ff13773f163>>
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
v2 = [
  (v1/*: any*/),
  {
    "alias": null,
    "args": null,
    "kind": "ScalarField",
    "name": "doc",
    "storageKey": null
  }
],
v3 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "name",
  "storageKey": null
},
v4 = [
  (v1/*: any*/),
  (v3/*: any*/)
],
v5 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "fname",
  "storageKey": null
},
v6 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "lname",
  "storageKey": null
},
v7 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "email",
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
  "concreteType": "default_projects",
  "kind": "LinkedField",
  "name": "project",
  "plural": false,
  "selections": (v4/*: any*/),
  "storageKey": null
},
v10 = {
  "alias": null,
  "args": null,
  "concreteType": "default_clients",
  "kind": "LinkedField",
  "name": "client",
  "plural": false,
  "selections": (v4/*: any*/),
  "storageKey": null
},
v11 = [
  (v1/*: any*/)
],
v12 = [
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
    "concreteType": "sheq_non_conformancesConnection",
    "kind": "LinkedField",
    "name": "sheq_non_conformances_connection",
    "plural": false,
    "selections": [
      {
        "alias": null,
        "args": null,
        "concreteType": "sheq_non_conformancesEdge",
        "kind": "LinkedField",
        "name": "edges",
        "plural": true,
        "selections": [
          {
            "alias": null,
            "args": null,
            "concreteType": "sheq_non_conformances",
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
              {
                "alias": null,
                "args": null,
                "kind": "ScalarField",
                "name": "comments",
                "storageKey": null
              },
              {
                "alias": null,
                "args": null,
                "kind": "ScalarField",
                "name": "completed_date",
                "storageKey": null
              },
              {
                "alias": null,
                "args": null,
                "kind": "ScalarField",
                "name": "desc",
                "storageKey": null
              },
              {
                "alias": null,
                "args": null,
                "kind": "ScalarField",
                "name": "due_date",
                "storageKey": null
              },
              {
                "alias": null,
                "args": null,
                "kind": "ScalarField",
                "name": "process",
                "storageKey": null
              },
              {
                "alias": null,
                "args": null,
                "kind": "ScalarField",
                "name": "remarks",
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
                "name": "source",
                "storageKey": null
              },
              {
                "alias": null,
                "args": null,
                "kind": "ScalarField",
                "name": "priority",
                "storageKey": null
              },
              {
                "alias": null,
                "args": null,
                "kind": "ScalarField",
                "name": "allocation",
                "storageKey": null
              },
              {
                "alias": null,
                "args": null,
                "kind": "ScalarField",
                "name": "additional_notes",
                "storageKey": null
              },
              {
                "alias": null,
                "args": null,
                "kind": "ScalarField",
                "name": "status_acceptance",
                "storageKey": null
              },
              {
                "alias": null,
                "args": null,
                "kind": "ScalarField",
                "name": "status_progress",
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
                "args": [
                  {
                    "kind": "Literal",
                    "name": "where",
                    "value": {
                      "type": {
                        "_eq": "Document Incident"
                      }
                    }
                  }
                ],
                "concreteType": "sheq_non_conformance_docs",
                "kind": "LinkedField",
                "name": "document_list",
                "plural": true,
                "selections": (v2/*: any*/),
                "storageKey": "document_list(where:{\"type\":{\"_eq\":\"Document Incident\"}})"
              },
              {
                "alias": "document_proof_list",
                "args": [
                  {
                    "kind": "Literal",
                    "name": "where",
                    "value": {
                      "type": {
                        "_eq": "Document Proof"
                      }
                    }
                  }
                ],
                "concreteType": "sheq_non_conformance_docs",
                "kind": "LinkedField",
                "name": "document_list",
                "plural": true,
                "selections": (v2/*: any*/),
                "storageKey": "document_list(where:{\"type\":{\"_eq\":\"Document Proof\"}})"
              },
              {
                "alias": null,
                "args": null,
                "concreteType": "sheq_non_conformance_progress",
                "kind": "LinkedField",
                "name": "progress_list",
                "plural": true,
                "selections": [
                  (v1/*: any*/),
                  {
                    "alias": null,
                    "args": null,
                    "kind": "ScalarField",
                    "name": "outstanding",
                    "storageKey": null
                  },
                  {
                    "alias": null,
                    "args": null,
                    "kind": "ScalarField",
                    "name": "notes",
                    "storageKey": null
                  },
                  {
                    "alias": null,
                    "args": null,
                    "kind": "ScalarField",
                    "name": "date",
                    "storageKey": null
                  }
                ],
                "storageKey": null
              },
              {
                "alias": null,
                "args": null,
                "concreteType": "sheq_non_conformance_responsible_parties",
                "kind": "LinkedField",
                "name": "responsible_party_list",
                "plural": true,
                "selections": [
                  (v1/*: any*/),
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
                "concreteType": "sheq_non_conformance_assignee_job_positions",
                "kind": "LinkedField",
                "name": "assigned_job_position_list",
                "plural": true,
                "selections": [
                  (v1/*: any*/),
                  {
                    "alias": null,
                    "args": null,
                    "concreteType": "default_job_positions",
                    "kind": "LinkedField",
                    "name": "job_position",
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
                "concreteType": "sheq_non_conformance_assignee_persons",
                "kind": "LinkedField",
                "name": "assigned_person_list",
                "plural": true,
                "selections": [
                  (v1/*: any*/),
                  {
                    "alias": null,
                    "args": null,
                    "concreteType": "hr_employees",
                    "kind": "LinkedField",
                    "name": "employee",
                    "plural": false,
                    "selections": [
                      (v1/*: any*/),
                      (v5/*: any*/),
                      (v6/*: any*/),
                      {
                        "alias": null,
                        "args": null,
                        "kind": "ScalarField",
                        "name": "full_name",
                        "storageKey": null
                      },
                      (v7/*: any*/),
                      (v8/*: any*/),
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
                      }
                    ],
                    "storageKey": null
                  }
                ],
                "storageKey": null
              },
              {
                "alias": null,
                "args": null,
                "concreteType": "hr_employees",
                "kind": "LinkedField",
                "name": "approving_person",
                "plural": false,
                "selections": [
                  (v1/*: any*/),
                  (v6/*: any*/),
                  (v5/*: any*/),
                  (v7/*: any*/),
                  (v8/*: any*/)
                ],
                "storageKey": null
              },
              {
                "alias": null,
                "args": null,
                "concreteType": "default_sites",
                "kind": "LinkedField",
                "name": "selected_source_site",
                "plural": false,
                "selections": [
                  (v1/*: any*/),
                  (v3/*: any*/),
                  (v9/*: any*/),
                  (v10/*: any*/)
                ],
                "storageKey": null
              },
              {
                "alias": null,
                "args": null,
                "concreteType": "sheq_incident_investigation",
                "kind": "LinkedField",
                "name": "selected_source_incident",
                "plural": false,
                "selections": (v11/*: any*/),
                "storageKey": null
              },
              {
                "alias": null,
                "args": null,
                "concreteType": "default_contractor_questionnaires_ques",
                "kind": "LinkedField",
                "name": "selected_source_inspection",
                "plural": false,
                "selections": (v11/*: any*/),
                "storageKey": null
              },
              {
                "alias": null,
                "args": null,
                "concreteType": "sheq_compliance_audits",
                "kind": "LinkedField",
                "name": "selected_source_compliance_audit",
                "plural": false,
                "selections": (v11/*: any*/),
                "storageKey": null
              },
              (v10/*: any*/),
              (v9/*: any*/),
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
    "name": "findByIdNCRQuery",
    "selections": (v12/*: any*/),
    "type": "query_root",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "findByIdNCRQuery",
    "selections": (v12/*: any*/)
  },
  "params": {
    "cacheID": "687f8ca449f2d37f699981fa30b54b21",
    "id": null,
    "metadata": {},
    "name": "findByIdNCRQuery",
    "operationKind": "query",
    "text": "query findByIdNCRQuery(\n  $id: bigint\n) {\n  sheq_non_conformances_connection(where: {id: {_eq: $id}}) {\n    edges {\n      node {\n        id\n        created_at\n        comments\n        completed_date\n        desc\n        due_date\n        process\n        remarks\n        type\n        source\n        priority\n        allocation\n        additional_notes\n        status_acceptance\n        status_progress\n        result\n        document_list(where: {type: {_eq: \"Document Incident\"}}) {\n          id\n          doc\n        }\n        document_proof_list: document_list(where: {type: {_eq: \"Document Proof\"}}) {\n          id\n          doc\n        }\n        progress_list {\n          id\n          outstanding\n          notes\n          date\n        }\n        responsible_party_list {\n          id\n          value\n        }\n        assigned_job_position_list {\n          id\n          job_position {\n            id\n            name\n          }\n        }\n        assigned_person_list {\n          id\n          employee {\n            id\n            fname\n            lname\n            full_name\n            email\n            phone\n            id_num\n            passport_num\n          }\n        }\n        approving_person {\n          id\n          lname\n          fname\n          email\n          phone\n        }\n        selected_source_site {\n          id\n          name\n          project {\n            id\n            name\n          }\n          client {\n            id\n            name\n          }\n        }\n        selected_source_incident {\n          id\n        }\n        selected_source_inspection {\n          id\n        }\n        selected_source_compliance_audit {\n          id\n        }\n        client {\n          id\n          name\n        }\n        project {\n          id\n          name\n        }\n        site {\n          id\n          name\n        }\n      }\n    }\n  }\n}\n"
  }
};
})();

node.hash = "8d91825c9e5f841027af6ec243395ed7";

module.exports = node;
