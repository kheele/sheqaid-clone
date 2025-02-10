/**
 * @generated SignedSource<<dad760f211df67cd065d4e95ba3ac31b>>
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
  }
],
v3 = [
  (v1/*: any*/),
  {
    "alias": null,
    "args": null,
    "kind": "ScalarField",
    "name": "name",
    "storageKey": null
  }
],
v4 = [
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
    "concreteType": "sheq_training_registersConnection",
    "kind": "LinkedField",
    "name": "sheq_training_registers_connection",
    "plural": false,
    "selections": [
      {
        "alias": null,
        "args": null,
        "concreteType": "sheq_training_registersEdge",
        "kind": "LinkedField",
        "name": "edges",
        "plural": true,
        "selections": [
          {
            "alias": null,
            "args": null,
            "concreteType": "sheq_training_registers",
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
                "name": "date",
                "storageKey": null
              },
              {
                "alias": null,
                "args": null,
                "kind": "ScalarField",
                "name": "institution_conducting_training",
                "storageKey": null
              },
              {
                "alias": null,
                "args": null,
                "kind": "ScalarField",
                "name": "time_or_duration",
                "storageKey": null
              },
              {
                "alias": null,
                "args": null,
                "kind": "ScalarField",
                "name": "list_proof",
                "storageKey": null
              },
              {
                "alias": null,
                "args": null,
                "concreteType": "hr_employees",
                "kind": "LinkedField",
                "name": "trainer",
                "plural": false,
                "selections": (v2/*: any*/),
                "storageKey": null
              },
              {
                "alias": null,
                "args": null,
                "concreteType": "hr_employees_external",
                "kind": "LinkedField",
                "name": "trainer_external",
                "plural": false,
                "selections": (v2/*: any*/),
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
                  (v1/*: any*/),
                  {
                    "alias": null,
                    "args": null,
                    "concreteType": "sheq_training_courses",
                    "kind": "LinkedField",
                    "name": "course",
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
                "concreteType": "proxy_employee__training_register",
                "kind": "LinkedField",
                "name": "employee_list",
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
                    "selections": (v2/*: any*/),
                    "storageKey": null
                  }
                ],
                "storageKey": null
              },
              {
                "alias": null,
                "args": null,
                "concreteType": "default_clients",
                "kind": "LinkedField",
                "name": "client",
                "plural": false,
                "selections": (v3/*: any*/),
                "storageKey": null
              },
              {
                "alias": null,
                "args": null,
                "concreteType": "default_projects",
                "kind": "LinkedField",
                "name": "project",
                "plural": false,
                "selections": (v3/*: any*/),
                "storageKey": null
              },
              {
                "alias": null,
                "args": null,
                "concreteType": "default_sites",
                "kind": "LinkedField",
                "name": "site",
                "plural": false,
                "selections": (v3/*: any*/),
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
    "name": "listAllTrainingRegisterByLoggedClientQuery",
    "selections": (v4/*: any*/),
    "type": "query_root",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "listAllTrainingRegisterByLoggedClientQuery",
    "selections": (v4/*: any*/)
  },
  "params": {
    "cacheID": "ca4d0cd322849f947ebb9fa8f35495a9",
    "id": null,
    "metadata": {},
    "name": "listAllTrainingRegisterByLoggedClientQuery",
    "operationKind": "query",
    "text": "query listAllTrainingRegisterByLoggedClientQuery(\n  $client_id: bigint\n) {\n  sheq_training_registers_connection(where: {client_id: {_eq: $client_id}}) {\n    edges {\n      node {\n        id\n        created_at\n        date\n        institution_conducting_training\n        time_or_duration\n        list_proof\n        trainer {\n          id\n          fname\n          lname\n          email\n          phone\n        }\n        trainer_external {\n          id\n          fname\n          lname\n          email\n          phone\n        }\n        training {\n          id\n          course {\n            id\n            name\n          }\n        }\n        employee_list {\n          id\n          employee {\n            id\n            fname\n            lname\n            email\n            phone\n          }\n        }\n        client {\n          id\n          name\n        }\n        project {\n          id\n          name\n        }\n        site {\n          id\n          name\n        }\n      }\n    }\n  }\n}\n"
  }
};
})();

node.hash = "26898d9658fe66e19aedbf0ef65924ba";

module.exports = node;
