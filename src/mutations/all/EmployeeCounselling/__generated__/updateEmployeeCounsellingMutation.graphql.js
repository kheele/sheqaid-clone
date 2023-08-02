/**
 * @generated SignedSource<<7aa3e97559bba8da491b075fbe3155e4>>
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
v2 = [
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
v3 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "id",
  "storageKey": null
},
v4 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "created_at",
  "storageKey": null
},
v5 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "doc",
  "storageKey": null
},
v6 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "corrective_actions",
  "storageKey": null
},
v7 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "counselling_hrs_to_complete",
  "storageKey": null
},
v8 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "expiry_date",
  "storageKey": null
},
v9 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "expiry_updated",
  "storageKey": null
},
v10 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "removed",
  "storageKey": null
},
v11 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "incident_desc",
  "storageKey": null
},
v12 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "reasons",
  "storageKey": null
},
v13 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "types",
  "storageKey": null
},
v14 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "fname",
  "storageKey": null
},
v15 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "lname",
  "storageKey": null
},
v16 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "phone",
  "storageKey": null
},
v17 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "email",
  "storageKey": null
},
v18 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "id_num",
  "storageKey": null
},
v19 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "passport_num",
  "storageKey": null
},
v20 = [
  (v3/*: any*/),
  (v14/*: any*/),
  (v15/*: any*/),
  (v16/*: any*/),
  (v17/*: any*/),
  (v18/*: any*/),
  (v19/*: any*/)
],
v21 = {
  "alias": null,
  "args": null,
  "concreteType": "hr_employees",
  "kind": "LinkedField",
  "name": "responsible_person",
  "plural": false,
  "selections": (v20/*: any*/),
  "storageKey": null
},
v22 = {
  "alias": null,
  "args": null,
  "concreteType": "hr_employees",
  "kind": "LinkedField",
  "name": "employee",
  "plural": false,
  "selections": (v20/*: any*/),
  "storageKey": null
},
v23 = [
  (v3/*: any*/),
  {
    "alias": null,
    "args": null,
    "kind": "ScalarField",
    "name": "name",
    "storageKey": null
  }
],
v24 = {
  "alias": null,
  "args": null,
  "concreteType": "default_companies",
  "kind": "LinkedField",
  "name": "company",
  "plural": false,
  "selections": (v23/*: any*/),
  "storageKey": null
},
v25 = {
  "alias": null,
  "args": null,
  "concreteType": "default_clients",
  "kind": "LinkedField",
  "name": "client",
  "plural": false,
  "selections": (v23/*: any*/),
  "storageKey": null
},
v26 = {
  "alias": null,
  "args": null,
  "concreteType": "default_projects",
  "kind": "LinkedField",
  "name": "project",
  "plural": false,
  "selections": (v23/*: any*/),
  "storageKey": null
},
v27 = {
  "alias": null,
  "args": null,
  "concreteType": "default_sites",
  "kind": "LinkedField",
  "name": "site",
  "plural": false,
  "selections": (v23/*: any*/),
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
    "name": "updateEmployeeCounsellingMutation",
    "selections": [
      {
        "alias": null,
        "args": (v2/*: any*/),
        "concreteType": "hr_employees_docs_counsellings",
        "kind": "LinkedField",
        "name": "update_hr_employees_docs_counsellings_by_pk",
        "plural": false,
        "selections": [
          (v3/*: any*/),
          (v4/*: any*/),
          (v5/*: any*/),
          (v6/*: any*/),
          (v7/*: any*/),
          (v8/*: any*/),
          (v9/*: any*/),
          (v10/*: any*/),
          (v11/*: any*/),
          (v12/*: any*/),
          (v13/*: any*/),
          (v21/*: any*/),
          (v22/*: any*/),
          {
            "alias": null,
            "args": null,
            "concreteType": "proxy_employees_docs_counselling__witness",
            "kind": "LinkedField",
            "name": "witness_list",
            "plural": true,
            "selections": [
              (v3/*: any*/),
              {
                "alias": null,
                "args": null,
                "concreteType": "hr_employees",
                "kind": "LinkedField",
                "name": "witness",
                "plural": false,
                "selections": [
                  (v14/*: any*/),
                  (v15/*: any*/),
                  (v16/*: any*/),
                  (v17/*: any*/),
                  (v18/*: any*/),
                  (v19/*: any*/)
                ],
                "storageKey": null
              }
            ],
            "storageKey": null
          },
          (v24/*: any*/),
          (v25/*: any*/),
          (v26/*: any*/),
          (v27/*: any*/)
        ],
        "storageKey": null
      }
    ],
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
    "name": "updateEmployeeCounsellingMutation",
    "selections": [
      {
        "alias": null,
        "args": (v2/*: any*/),
        "concreteType": "hr_employees_docs_counsellings",
        "kind": "LinkedField",
        "name": "update_hr_employees_docs_counsellings_by_pk",
        "plural": false,
        "selections": [
          (v3/*: any*/),
          (v4/*: any*/),
          (v5/*: any*/),
          (v6/*: any*/),
          (v7/*: any*/),
          (v8/*: any*/),
          (v9/*: any*/),
          (v10/*: any*/),
          (v11/*: any*/),
          (v12/*: any*/),
          (v13/*: any*/),
          (v21/*: any*/),
          (v22/*: any*/),
          {
            "alias": null,
            "args": null,
            "concreteType": "proxy_employees_docs_counselling__witness",
            "kind": "LinkedField",
            "name": "witness_list",
            "plural": true,
            "selections": [
              (v3/*: any*/),
              {
                "alias": null,
                "args": null,
                "concreteType": "hr_employees",
                "kind": "LinkedField",
                "name": "witness",
                "plural": false,
                "selections": [
                  (v14/*: any*/),
                  (v15/*: any*/),
                  (v16/*: any*/),
                  (v17/*: any*/),
                  (v18/*: any*/),
                  (v19/*: any*/),
                  (v3/*: any*/)
                ],
                "storageKey": null
              }
            ],
            "storageKey": null
          },
          (v24/*: any*/),
          (v25/*: any*/),
          (v26/*: any*/),
          (v27/*: any*/)
        ],
        "storageKey": null
      }
    ]
  },
  "params": {
    "cacheID": "4990ee80e3314519ea634204636a6747",
    "id": null,
    "metadata": {},
    "name": "updateEmployeeCounsellingMutation",
    "operationKind": "mutation",
    "text": "mutation updateEmployeeCounsellingMutation(\n  $id: hr_employees_docs_counsellings_pk_columns_input!\n  $_set: hr_employees_docs_counsellings_set_input!\n) {\n  update_hr_employees_docs_counsellings_by_pk(pk_columns: $id, _set: $_set) {\n    id\n    created_at\n    doc\n    corrective_actions\n    counselling_hrs_to_complete\n    expiry_date\n    expiry_updated\n    removed\n    incident_desc\n    reasons\n    types\n    responsible_person {\n      id\n      fname\n      lname\n      phone\n      email\n      id_num\n      passport_num\n    }\n    employee {\n      id\n      fname\n      lname\n      phone\n      email\n      id_num\n      passport_num\n    }\n    witness_list {\n      id\n      witness {\n        fname\n        lname\n        phone\n        email\n        id_num\n        passport_num\n        id\n      }\n    }\n    company {\n      id\n      name\n    }\n    client {\n      id\n      name\n    }\n    project {\n      id\n      name\n    }\n    site {\n      id\n      name\n    }\n  }\n}\n"
  }
};
})();

node.hash = "3003cd7b22e6730803306b905e951a95";

module.exports = node;
