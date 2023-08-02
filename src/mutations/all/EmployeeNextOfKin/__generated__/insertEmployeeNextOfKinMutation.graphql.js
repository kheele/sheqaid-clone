/**
 * @generated SignedSource<<674de3d8266a3e0abd5640616633b5d1>>
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
    "concreteType": "hr_employees_next_of_kin",
    "kind": "LinkedField",
    "name": "insert_hr_employees_next_of_kin_one",
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
        "name": "phone1",
        "storageKey": null
      },
      {
        "alias": null,
        "args": null,
        "kind": "ScalarField",
        "name": "phone2",
        "storageKey": null
      },
      {
        "alias": null,
        "args": null,
        "kind": "ScalarField",
        "name": "relationship",
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
    "name": "insertEmployeeNextOfKinMutation",
    "selections": (v2/*: any*/),
    "type": "mutation_root",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "insertEmployeeNextOfKinMutation",
    "selections": (v2/*: any*/)
  },
  "params": {
    "cacheID": "8cded73a1cc81aa5d4a2766f3389fa7b",
    "id": null,
    "metadata": {},
    "name": "insertEmployeeNextOfKinMutation",
    "operationKind": "mutation",
    "text": "mutation insertEmployeeNextOfKinMutation(\n  $object: hr_employees_next_of_kin_insert_input!\n) {\n  insert_hr_employees_next_of_kin_one(object: $object) {\n    id\n    created_at\n    fname\n    lname\n    phone1\n    phone2\n    relationship\n    employee_id\n    employee {\n      id\n    }\n  }\n}\n"
  }
};
})();

node.hash = "f2ada81224f05e4f00b46caee014605a";

module.exports = node;
