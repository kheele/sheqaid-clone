/**
 * @generated SignedSource<<7b7e081b90e16e88142dc790aa3153ee>>
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
        "name": "_set",
        "variableName": "_set"
      },
      {
        "kind": "Variable",
        "name": "pk_columns",
        "variableName": "id"
      }
    ],
    "concreteType": "sheq_training_plans__job_position_course",
    "kind": "LinkedField",
    "name": "update_sheq_training_plans__job_position_course_by_pk",
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
        "name": "year",
        "storageKey": null
      },
      {
        "alias": null,
        "args": null,
        "concreteType": "sheq_training_courses",
        "kind": "LinkedField",
        "name": "course",
        "plural": false,
        "selections": (v3/*: any*/),
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
];
return {
  "fragment": {
    "argumentDefinitions": [
      (v0/*: any*/),
      (v1/*: any*/)
    ],
    "kind": "Fragment",
    "metadata": null,
    "name": "updateTrainingPlanMutation",
    "selections": (v4/*: any*/),
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
    "name": "updateTrainingPlanMutation",
    "selections": (v4/*: any*/)
  },
  "params": {
    "cacheID": "9921582602e87367343ce4d6dfe92f66",
    "id": null,
    "metadata": {},
    "name": "updateTrainingPlanMutation",
    "operationKind": "mutation",
    "text": "mutation updateTrainingPlanMutation(\n  $id: sheq_training_plans__job_position_course_pk_columns_input!\n  $_set: sheq_training_plans__job_position_course_set_input!\n) {\n  update_sheq_training_plans__job_position_course_by_pk(pk_columns: $id, _set: $_set) {\n    id\n    created_at\n    year\n    course {\n      id\n      name\n    }\n    job_position {\n      id\n      name\n    }\n    company {\n      id\n      name\n    }\n    client {\n      id\n      name\n    }\n    project {\n      id\n      name\n    }\n    site {\n      id\n      name\n    }\n  }\n}\n"
  }
};
})();

node.hash = "e2d468afb930f9acb289af6749df80d7";

module.exports = node;
