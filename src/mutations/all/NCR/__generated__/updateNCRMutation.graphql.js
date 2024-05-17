/**
 * @generated SignedSource<<993b7b391ad95fe85976f2d43cbe72e8>>
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
v3 = [
  (v2/*: any*/),
  {
    "alias": null,
    "args": null,
    "kind": "ScalarField",
    "name": "doc",
    "storageKey": null
  }
],
v4 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "name",
  "storageKey": null
},
v5 = [
  (v2/*: any*/),
  (v4/*: any*/)
],
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
  "name": "email",
  "storageKey": null
},
v9 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "phone",
  "storageKey": null
},
v10 = {
  "alias": null,
  "args": null,
  "concreteType": "default_projects",
  "kind": "LinkedField",
  "name": "project",
  "plural": false,
  "selections": (v5/*: any*/),
  "storageKey": null
},
v11 = {
  "alias": null,
  "args": null,
  "concreteType": "default_clients",
  "kind": "LinkedField",
  "name": "client",
  "plural": false,
  "selections": (v5/*: any*/),
  "storageKey": null
},
v12 = [
  (v2/*: any*/)
],
v13 = [
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
    "concreteType": "sheq_non_conformances",
    "kind": "LinkedField",
    "name": "update_sheq_non_conformances_by_pk",
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
        "selections": (v3/*: any*/),
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
        "selections": (v3/*: any*/),
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
          (v2/*: any*/),
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
          (v2/*: any*/),
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
          (v2/*: any*/),
          {
            "alias": null,
            "args": null,
            "concreteType": "default_job_positions",
            "kind": "LinkedField",
            "name": "job_position",
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
        "concreteType": "sheq_non_conformance_assignee_persons",
        "kind": "LinkedField",
        "name": "assigned_person_list",
        "plural": true,
        "selections": [
          (v2/*: any*/),
          {
            "alias": null,
            "args": null,
            "concreteType": "hr_employees",
            "kind": "LinkedField",
            "name": "employee",
            "plural": false,
            "selections": [
              (v2/*: any*/),
              (v6/*: any*/),
              (v7/*: any*/),
              {
                "alias": null,
                "args": null,
                "kind": "ScalarField",
                "name": "full_name",
                "storageKey": null
              },
              (v8/*: any*/),
              (v9/*: any*/),
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
          (v2/*: any*/),
          (v7/*: any*/),
          (v6/*: any*/),
          (v8/*: any*/),
          (v9/*: any*/)
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
          (v2/*: any*/),
          (v4/*: any*/),
          (v10/*: any*/),
          (v11/*: any*/)
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
        "selections": (v12/*: any*/),
        "storageKey": null
      },
      {
        "alias": null,
        "args": null,
        "concreteType": "default_contractor_questionnaires",
        "kind": "LinkedField",
        "name": "selected_source_inspection",
        "plural": false,
        "selections": (v12/*: any*/),
        "storageKey": null
      },
      {
        "alias": null,
        "args": null,
        "concreteType": "sheq_compliance_audits",
        "kind": "LinkedField",
        "name": "selected_source_compliance_audit",
        "plural": false,
        "selections": (v12/*: any*/),
        "storageKey": null
      },
      (v11/*: any*/),
      (v10/*: any*/),
      {
        "alias": null,
        "args": null,
        "concreteType": "default_sites",
        "kind": "LinkedField",
        "name": "site",
        "plural": false,
        "selections": (v5/*: any*/),
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
    "name": "updateNCRMutation",
    "selections": (v13/*: any*/),
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
    "name": "updateNCRMutation",
    "selections": (v13/*: any*/)
  },
  "params": {
    "cacheID": "7d93b2ab5f26ea245cd296d9fcba8baf",
    "id": null,
    "metadata": {},
    "name": "updateNCRMutation",
    "operationKind": "mutation",
    "text": "mutation updateNCRMutation(\n  $id: sheq_non_conformances_pk_columns_input!\n  $_set: sheq_non_conformances_set_input!\n) {\n  update_sheq_non_conformances_by_pk(pk_columns: $id, _set: $_set) {\n    id\n    created_at\n    comments\n    completed_date\n    desc\n    due_date\n    process\n    remarks\n    type\n    source\n    priority\n    allocation\n    additional_notes\n    status_acceptance\n    status_progress\n    result\n    document_list(where: {type: {_eq: \"Document Incident\"}}) {\n      id\n      doc\n    }\n    document_proof_list: document_list(where: {type: {_eq: \"Document Proof\"}}) {\n      id\n      doc\n    }\n    progress_list {\n      id\n      outstanding\n      notes\n      date\n    }\n    responsible_party_list {\n      id\n      value\n    }\n    assigned_job_position_list {\n      id\n      job_position {\n        id\n        name\n      }\n    }\n    assigned_person_list {\n      id\n      employee {\n        id\n        fname\n        lname\n        full_name\n        email\n        phone\n        id_num\n        passport_num\n      }\n    }\n    approving_person {\n      id\n      lname\n      fname\n      email\n      phone\n    }\n    selected_source_site {\n      id\n      name\n      project {\n        id\n        name\n      }\n      client {\n        id\n        name\n      }\n    }\n    selected_source_incident {\n      id\n    }\n    selected_source_inspection {\n      id\n    }\n    selected_source_compliance_audit {\n      id\n    }\n    client {\n      id\n      name\n    }\n    project {\n      id\n      name\n    }\n    site {\n      id\n      name\n    }\n  }\n}\n"
  }
};
})();

node.hash = "b3171541cc39cf0c43abd1a2dbd7bf38";

module.exports = node;
