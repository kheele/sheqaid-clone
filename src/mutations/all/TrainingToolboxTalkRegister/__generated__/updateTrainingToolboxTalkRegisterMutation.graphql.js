/**
 * @generated SignedSource<<0bf1a7c8d301e4d9cd4b2b60a75a658b>>
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
  "name": "date",
  "storageKey": null
},
v4 = [
  (v2/*: any*/),
  {
    "alias": null,
    "args": null,
    "kind": "ScalarField",
    "name": "name",
    "storageKey": null
  }
],
v5 = [
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
    "concreteType": "sheq_training_toolbox_talk_registers",
    "kind": "LinkedField",
    "name": "update_sheq_training_toolbox_talk_registers_by_pk",
    "plural": false,
    "selections": [
      (v2/*: any*/),
      (v3/*: any*/),
      {
        "alias": null,
        "args": null,
        "concreteType": "sheq_training_toolbox_talk_subjects",
        "kind": "LinkedField",
        "name": "subject",
        "plural": false,
        "selections": (v4/*: any*/),
        "storageKey": null
      },
      {
        "alias": null,
        "args": null,
        "concreteType": "proxy_employee__training_toolbox_talk_register",
        "kind": "LinkedField",
        "name": "employee_list",
        "plural": true,
        "selections": [
          (v2/*: any*/),
          {
            "alias": null,
            "args": null,
            "kind": "ScalarField",
            "name": "signature",
            "storageKey": null
          },
          (v3/*: any*/),
          {
            "alias": null,
            "args": null,
            "concreteType": "hr_employees",
            "kind": "LinkedField",
            "name": "employee",
            "plural": false,
            "selections": [
              (v2/*: any*/),
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
                "concreteType": "default_job_positions",
                "kind": "LinkedField",
                "name": "job_position",
                "plural": false,
                "selections": (v4/*: any*/),
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
        "concreteType": "default_sites",
        "kind": "LinkedField",
        "name": "site",
        "plural": false,
        "selections": (v4/*: any*/),
        "storageKey": null
      },
      {
        "alias": null,
        "args": null,
        "concreteType": "default_projects",
        "kind": "LinkedField",
        "name": "project",
        "plural": false,
        "selections": (v4/*: any*/),
        "storageKey": null
      },
      {
        "alias": null,
        "args": null,
        "concreteType": "default_clients",
        "kind": "LinkedField",
        "name": "client",
        "plural": false,
        "selections": (v4/*: any*/),
        "storageKey": null
      },
      {
        "alias": null,
        "args": null,
        "concreteType": "default_companies",
        "kind": "LinkedField",
        "name": "company",
        "plural": false,
        "selections": (v4/*: any*/),
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
    "name": "updateTrainingToolboxTalkRegisterMutation",
    "selections": (v5/*: any*/),
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
    "name": "updateTrainingToolboxTalkRegisterMutation",
    "selections": (v5/*: any*/)
  },
  "params": {
    "cacheID": "6e5a246044d8e2ce94a2be99a499cba6",
    "id": null,
    "metadata": {},
    "name": "updateTrainingToolboxTalkRegisterMutation",
    "operationKind": "mutation",
    "text": "mutation updateTrainingToolboxTalkRegisterMutation(\n  $id: sheq_training_toolbox_talk_registers_pk_columns_input!\n  $_set: sheq_training_toolbox_talk_registers_set_input!\n) {\n  update_sheq_training_toolbox_talk_registers_by_pk(pk_columns: $id, _set: $_set) {\n    id\n    date\n    subject {\n      id\n      name\n    }\n    employee_list {\n      id\n      signature\n      date\n      employee {\n        id\n        fname\n        lname\n        job_position {\n          id\n          name\n        }\n      }\n    }\n    site {\n      id\n      name\n    }\n    project {\n      id\n      name\n    }\n    client {\n      id\n      name\n    }\n    company {\n      id\n      name\n    }\n  }\n}\n"
  }
};
})();

node.hash = "116349004eb345627064a3a0f30ed308";

module.exports = node;
