/**
 * @generated SignedSource<<6849169b0d38fe5373aca17c3cbb3ff3>>
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
v2 = [
  {
    "alias": null,
    "args": [
      {
        "kind": "Variable",
        "name": "object",
        "variableName": "object"
      }
    ],
    "concreteType": "hr_employees_dependents",
    "kind": "LinkedField",
    "name": "insert_hr_employees_dependents_one",
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
        "name": "dob",
        "storageKey": null
      },
      {
        "alias": null,
        "args": null,
        "kind": "ScalarField",
        "name": "gender",
        "storageKey": null
      },
      {
        "alias": null,
        "args": null,
        "kind": "ScalarField",
        "name": "employee_id",
        "storageKey": null
      },
      {
        "alias": null,
        "args": null,
        "concreteType": "hr_employees",
        "kind": "LinkedField",
        "name": "employee",
        "plural": false,
        "selections": [
          (v1/*: any*/)
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
    "name": "insertEmployeeDependantMutation",
    "selections": (v2/*: any*/),
    "type": "mutation_root",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "insertEmployeeDependantMutation",
    "selections": (v2/*: any*/)
  },
  "params": {
    "cacheID": "d261fe437a50e68331510d104f5ac583",
    "id": null,
    "metadata": {},
    "name": "insertEmployeeDependantMutation",
    "operationKind": "mutation",
    "text": "mutation insertEmployeeDependantMutation(\n  $object: hr_employees_dependents_insert_input!\n) {\n  insert_hr_employees_dependents_one(object: $object) {\n    id\n    created_at\n    fname\n    lname\n    dob\n    gender\n    employee_id\n    employee {\n      id\n    }\n  }\n}\n"
  }
};
})();

node.hash = "8303a3c79fbf8ff8428a118769d270c9";

module.exports = node;
