/**
 * @generated SignedSource<<e74fa0e62254476f0d216dc7259b5817>>
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
  "name": "date",
  "storageKey": null
},
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
        "kind": "Variable",
        "name": "object",
        "variableName": "object"
      }
    ],
    "concreteType": "sheq_training_toolbox_talk_registers",
    "kind": "LinkedField",
    "name": "insert_sheq_training_toolbox_talk_registers_one",
    "plural": false,
    "selections": [
      (v1/*: any*/),
      (v2/*: any*/),
      {
        "alias": null,
        "args": null,
        "concreteType": "sheq_training_toolbox_talk_subjects",
        "kind": "LinkedField",
        "name": "subject",
        "plural": false,
        "selections": (v3/*: any*/),
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
          (v1/*: any*/),
          {
            "alias": null,
            "args": null,
            "kind": "ScalarField",
            "name": "signature",
            "storageKey": null
          },
          (v2/*: any*/),
          {
            "alias": null,
            "args": null,
            "concreteType": "hr_employees",
            "kind": "LinkedField",
            "name": "employee",
            "plural": false,
            "selections": [
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
                "concreteType": "default_job_positions",
                "kind": "LinkedField",
                "name": "job_position",
                "plural": false,
                "selections": (v3/*: any*/),
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
        "concreteType": "default_companies",
        "kind": "LinkedField",
        "name": "company",
        "plural": false,
        "selections": (v3/*: any*/),
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
    "name": "insertTrainingToolboxTalkRegisterMutation",
    "selections": (v4/*: any*/),
    "type": "mutation_root",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "insertTrainingToolboxTalkRegisterMutation",
    "selections": (v4/*: any*/)
  },
  "params": {
    "cacheID": "e403578f1a405117b896af94d6e5ed33",
    "id": null,
    "metadata": {},
    "name": "insertTrainingToolboxTalkRegisterMutation",
    "operationKind": "mutation",
    "text": "mutation insertTrainingToolboxTalkRegisterMutation(\n  $object: sheq_training_toolbox_talk_registers_insert_input!\n) {\n  insert_sheq_training_toolbox_talk_registers_one(object: $object) {\n    id\n    date\n    subject {\n      id\n      name\n    }\n    employee_list {\n      id\n      signature\n      date\n      employee {\n        id\n        fname\n        lname\n        job_position {\n          id\n          name\n        }\n      }\n    }\n    site {\n      id\n      name\n    }\n    project {\n      id\n      name\n    }\n    client {\n      id\n      name\n    }\n    company {\n      id\n      name\n    }\n  }\n}\n"
  }
};
})();

node.hash = "92873092dc6d232aa4cdd47c2f0d766d";

module.exports = node;
