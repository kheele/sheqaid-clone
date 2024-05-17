/**
 * @generated SignedSource<<640844b4b894e395837f78f4048a27f8>>
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
v2 = [
  (v1/*: any*/),
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
    "name": "fname",
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
  "concreteType": "default_projects",
  "kind": "LinkedField",
  "name": "project",
  "plural": false,
  "selections": (v4/*: any*/),
  "storageKey": null
},
v6 = {
  "alias": null,
  "args": null,
  "concreteType": "default_clients",
  "kind": "LinkedField",
  "name": "client",
  "plural": false,
  "selections": (v4/*: any*/),
  "storageKey": null
},
v7 = [
  (v1/*: any*/)
],
v8 = [
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
                "concreteType": "sheq_non_conformance_docs",
                "kind": "LinkedField",
                "name": "document_list",
                "plural": true,
                "selections": [
                  (v1/*: any*/),
                  {
                    "alias": null,
                    "args": null,
                    "kind": "ScalarField",
                    "name": "doc",
                    "storageKey": null
                  }
                ],
                "storageKey": null
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
                "concreteType": "hr_employees",
                "kind": "LinkedField",
                "name": "approving_person",
                "plural": false,
                "selections": (v2/*: any*/),
                "storageKey": null
              },
              {
                "alias": null,
                "args": null,
                "concreteType": "hr_employees",
                "kind": "LinkedField",
                "name": "responsible_person",
                "plural": false,
                "selections": (v2/*: any*/),
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
                  (v5/*: any*/),
                  (v6/*: any*/)
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
                "selections": (v7/*: any*/),
                "storageKey": null
              },
              {
                "alias": null,
                "args": null,
                "concreteType": "default_contractor_questionnaires",
                "kind": "LinkedField",
                "name": "selected_source_inspection",
                "plural": false,
                "selections": (v7/*: any*/),
                "storageKey": null
              },
              {
                "alias": null,
                "args": null,
                "concreteType": "sheq_compliance_audits",
                "kind": "LinkedField",
                "name": "selected_source_compliance_audit",
                "plural": false,
                "selections": (v7/*: any*/),
                "storageKey": null
              },
              (v6/*: any*/),
              (v5/*: any*/),
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
    "name": "listAllNCRByLoggedClientQuery",
    "selections": (v8/*: any*/),
    "type": "query_root",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "listAllNCRByLoggedClientQuery",
    "selections": (v8/*: any*/)
  },
  "params": {
    "cacheID": "b0eaec7872c5ca36ecaa1da9a7e6cd74",
    "id": null,
    "metadata": {},
    "name": "listAllNCRByLoggedClientQuery",
    "operationKind": "query",
    "text": "query listAllNCRByLoggedClientQuery(\n  $client_id: bigint\n) {\n  sheq_non_conformances_connection(where: {client_id: {_eq: $client_id}}) {\n    edges {\n      node {\n        id\n        created_at\n        comments\n        completed_date\n        desc\n        due_date\n        process\n        remarks\n        type\n        source\n        document_list {\n          id\n          doc\n        }\n        progress_list {\n          id\n          outstanding\n          notes\n          date\n        }\n        approving_person {\n          id\n          lname\n          fname\n          email\n          phone\n        }\n        responsible_person {\n          id\n          lname\n          fname\n          email\n          phone\n        }\n        selected_source_site {\n          id\n          name\n          project {\n            id\n            name\n          }\n          client {\n            id\n            name\n          }\n        }\n        selected_source_incident {\n          id\n        }\n        selected_source_inspection {\n          id\n        }\n        selected_source_compliance_audit {\n          id\n        }\n        client {\n          id\n          name\n        }\n        project {\n          id\n          name\n        }\n        site {\n          id\n          name\n        }\n      }\n    }\n  }\n}\n"
  }
};
})();

node.hash = "96dc0116121f3f4fb2fd51f084190085";

module.exports = node;
