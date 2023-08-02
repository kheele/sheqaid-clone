/**
 * @generated SignedSource<<b373841e8a133379c5e143b11d5c9af4>>
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
  "name": "fname",
  "storageKey": null
},
v3 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "lname",
  "storageKey": null
},
v4 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "email",
  "storageKey": null
},
v5 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "phone",
  "storageKey": null
},
v6 = [
  {
    "alias": null,
    "args": null,
    "kind": "ScalarField",
    "name": "count",
    "storageKey": null
  }
],
v7 = [
  {
    "kind": "Literal",
    "name": "where",
    "value": {
      "removed": {
        "_eq": false
      }
    }
  }
],
v8 = [
  (v1/*: any*/),
  {
    "alias": null,
    "args": null,
    "kind": "ScalarField",
    "name": "name",
    "storageKey": null
  }
],
v9 = [
  {
    "alias": null,
    "args": [
      {
        "kind": "Variable",
        "name": "object",
        "variableName": "object"
      }
    ],
    "concreteType": "hr_employees",
    "kind": "LinkedField",
    "name": "insert_hr_employees_one",
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
        "name": "full_name",
        "storageKey": null
      },
      (v4/*: any*/),
      (v5/*: any*/),
      {
        "alias": null,
        "args": null,
        "kind": "ScalarField",
        "name": "dob",
        "storageKey": null
      },
      {
        "alias": null,
        "args": null,
        "kind": "ScalarField",
        "name": "sex",
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
        "name": "profile_pic",
        "storageKey": null
      },
      {
        "alias": null,
        "args": null,
        "kind": "ScalarField",
        "name": "employment_num",
        "storageKey": null
      },
      {
        "alias": null,
        "args": null,
        "kind": "ScalarField",
        "name": "employment_date",
        "storageKey": null
      },
      {
        "alias": null,
        "args": null,
        "concreteType": "hr_employees_documents_aggregate",
        "kind": "LinkedField",
        "name": "document_list_aggregate",
        "plural": false,
        "selections": [
          {
            "alias": null,
            "args": null,
            "concreteType": "hr_employees_documents_aggregate_fields",
            "kind": "LinkedField",
            "name": "aggregate",
            "plural": false,
            "selections": (v6/*: any*/),
            "storageKey": null
          }
        ],
        "storageKey": null
      },
      {
        "alias": null,
        "args": (v7/*: any*/),
        "concreteType": "hr_employees_docs_medicals_aggregate",
        "kind": "LinkedField",
        "name": "medical_list_aggregate",
        "plural": false,
        "selections": [
          {
            "alias": null,
            "args": null,
            "concreteType": "hr_employees_docs_medicals_aggregate_fields",
            "kind": "LinkedField",
            "name": "aggregate",
            "plural": false,
            "selections": (v6/*: any*/),
            "storageKey": null
          }
        ],
        "storageKey": "medical_list_aggregate(where:{\"removed\":{\"_eq\":false}})"
      },
      {
        "alias": null,
        "args": (v7/*: any*/),
        "concreteType": "hr_employees_docs_leaves_aggregate",
        "kind": "LinkedField",
        "name": "leave_list_aggregate",
        "plural": false,
        "selections": [
          {
            "alias": null,
            "args": null,
            "concreteType": "hr_employees_docs_leaves_aggregate_fields",
            "kind": "LinkedField",
            "name": "aggregate",
            "plural": false,
            "selections": (v6/*: any*/),
            "storageKey": null
          }
        ],
        "storageKey": "leave_list_aggregate(where:{\"removed\":{\"_eq\":false}})"
      },
      {
        "alias": null,
        "args": null,
        "concreteType": "proxy_employee__ppe_aggregate",
        "kind": "LinkedField",
        "name": "ppe_list_aggregate",
        "plural": false,
        "selections": [
          {
            "alias": null,
            "args": null,
            "concreteType": "proxy_employee__ppe_aggregate_fields",
            "kind": "LinkedField",
            "name": "aggregate",
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
        "concreteType": "sheq_training_matrices_aggregate",
        "kind": "LinkedField",
        "name": "trainer_training_matrix_list_aggregate",
        "plural": false,
        "selections": [
          {
            "alias": null,
            "args": null,
            "concreteType": "sheq_training_matrices_aggregate_fields",
            "kind": "LinkedField",
            "name": "aggregate",
            "plural": false,
            "selections": (v6/*: any*/),
            "storageKey": null
          }
        ],
        "storageKey": null
      },
      {
        "alias": null,
        "args": (v7/*: any*/),
        "concreteType": "hr_employees_docs_warnings_aggregate",
        "kind": "LinkedField",
        "name": "warning_list_aggregate",
        "plural": false,
        "selections": [
          {
            "alias": null,
            "args": null,
            "concreteType": "hr_employees_docs_warnings_aggregate_fields",
            "kind": "LinkedField",
            "name": "aggregate",
            "plural": false,
            "selections": (v6/*: any*/),
            "storageKey": null
          }
        ],
        "storageKey": "warning_list_aggregate(where:{\"removed\":{\"_eq\":false}})"
      },
      {
        "alias": null,
        "args": (v7/*: any*/),
        "concreteType": "hr_employees_aggregate",
        "kind": "LinkedField",
        "name": "supervisor_employee_list_aggregate",
        "plural": false,
        "selections": [
          {
            "alias": null,
            "args": null,
            "concreteType": "hr_employees_aggregate_fields",
            "kind": "LinkedField",
            "name": "aggregate",
            "plural": false,
            "selections": (v6/*: any*/),
            "storageKey": null
          }
        ],
        "storageKey": "supervisor_employee_list_aggregate(where:{\"removed\":{\"_eq\":false}})"
      },
      {
        "alias": null,
        "args": null,
        "concreteType": "hr_employees",
        "kind": "LinkedField",
        "name": "supervisor",
        "plural": false,
        "selections": [
          (v1/*: any*/),
          (v2/*: any*/),
          (v3/*: any*/),
          (v4/*: any*/),
          (v5/*: any*/)
        ],
        "storageKey": null
      },
      {
        "alias": null,
        "args": null,
        "concreteType": "default_users",
        "kind": "LinkedField",
        "name": "linked_user",
        "plural": false,
        "selections": [
          (v1/*: any*/),
          (v2/*: any*/),
          (v3/*: any*/),
          {
            "alias": null,
            "args": null,
            "kind": "ScalarField",
            "name": "username",
            "storageKey": null
          },
          (v5/*: any*/)
        ],
        "storageKey": null
      },
      {
        "alias": null,
        "args": null,
        "concreteType": "default_departments",
        "kind": "LinkedField",
        "name": "department",
        "plural": false,
        "selections": (v8/*: any*/),
        "storageKey": null
      },
      {
        "alias": null,
        "args": null,
        "concreteType": "default_job_positions",
        "kind": "LinkedField",
        "name": "job_position",
        "plural": false,
        "selections": (v8/*: any*/),
        "storageKey": null
      },
      {
        "alias": null,
        "args": null,
        "concreteType": "default_companies",
        "kind": "LinkedField",
        "name": "company",
        "plural": false,
        "selections": (v8/*: any*/),
        "storageKey": null
      },
      {
        "alias": null,
        "args": null,
        "concreteType": "default_clients",
        "kind": "LinkedField",
        "name": "client",
        "plural": false,
        "selections": (v8/*: any*/),
        "storageKey": null
      },
      {
        "alias": null,
        "args": null,
        "concreteType": "default_projects",
        "kind": "LinkedField",
        "name": "project",
        "plural": false,
        "selections": (v8/*: any*/),
        "storageKey": null
      },
      {
        "alias": null,
        "args": null,
        "concreteType": "default_sites",
        "kind": "LinkedField",
        "name": "site",
        "plural": false,
        "selections": (v8/*: any*/),
        "storageKey": null
      },
      {
        "alias": null,
        "args": null,
        "concreteType": "default_contractors",
        "kind": "LinkedField",
        "name": "contractor",
        "plural": false,
        "selections": (v8/*: any*/),
        "storageKey": null
      },
      {
        "alias": null,
        "args": null,
        "concreteType": "default_clients",
        "kind": "LinkedField",
        "name": "contractor_client",
        "plural": false,
        "selections": (v8/*: any*/),
        "storageKey": null
      },
      {
        "alias": null,
        "args": null,
        "concreteType": "default_sites",
        "kind": "LinkedField",
        "name": "contractor_site",
        "plural": false,
        "selections": (v8/*: any*/),
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
    "name": "insertEmployeeMutation",
    "selections": (v9/*: any*/),
    "type": "mutation_root",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "insertEmployeeMutation",
    "selections": (v9/*: any*/)
  },
  "params": {
    "cacheID": "e37d2a469e1c6d08bf6e0845c2d9a2ee",
    "id": null,
    "metadata": {},
    "name": "insertEmployeeMutation",
    "operationKind": "mutation",
    "text": "mutation insertEmployeeMutation(\n  $object: hr_employees_insert_input!\n) {\n  insert_hr_employees_one(object: $object) {\n    id\n    created_at\n    fname\n    lname\n    full_name\n    email\n    phone\n    dob\n    sex\n    id_num\n    passport_num\n    profile_pic\n    employment_num\n    employment_date\n    document_list_aggregate {\n      aggregate {\n        count\n      }\n    }\n    medical_list_aggregate(where: {removed: {_eq: false}}) {\n      aggregate {\n        count\n      }\n    }\n    leave_list_aggregate(where: {removed: {_eq: false}}) {\n      aggregate {\n        count\n      }\n    }\n    ppe_list_aggregate {\n      aggregate {\n        count\n      }\n    }\n    trainer_training_matrix_list_aggregate {\n      aggregate {\n        count\n      }\n    }\n    warning_list_aggregate(where: {removed: {_eq: false}}) {\n      aggregate {\n        count\n      }\n    }\n    supervisor_employee_list_aggregate(where: {removed: {_eq: false}}) {\n      aggregate {\n        count\n      }\n    }\n    supervisor {\n      id\n      fname\n      lname\n      email\n      phone\n    }\n    linked_user {\n      id\n      fname\n      lname\n      username\n      phone\n    }\n    department {\n      id\n      name\n    }\n    job_position {\n      id\n      name\n    }\n    company {\n      id\n      name\n    }\n    client {\n      id\n      name\n    }\n    project {\n      id\n      name\n    }\n    site {\n      id\n      name\n    }\n    contractor {\n      id\n      name\n    }\n    contractor_client {\n      id\n      name\n    }\n    contractor_site {\n      id\n      name\n    }\n  }\n}\n"
  }
};
})();

node.hash = "05da9eff2c90807a9490ee44fe2a05be";

module.exports = node;
