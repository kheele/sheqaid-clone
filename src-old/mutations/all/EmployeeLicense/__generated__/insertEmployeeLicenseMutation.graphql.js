/**
 * @generated SignedSource<<7c3ab07d0bafe165e087ce73f836940e>>
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
v1 = [
  {
    "alias": null,
    "args": [
      {
        "kind": "Variable",
        "name": "object",
        "variableName": "object"
      }
    ],
    "concreteType": "hr_employees_docs_licenses",
    "kind": "LinkedField",
    "name": "insert_hr_employees_docs_licenses_one",
    "plural": false,
    "selections": [
      {
        "alias": null,
        "args": null,
        "kind": "ScalarField",
        "name": "id",
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
    "name": "insertEmployeeLicenseMutation",
    "selections": (v1/*: any*/),
    "type": "mutation_root",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "insertEmployeeLicenseMutation",
    "selections": (v1/*: any*/)
  },
  "params": {
    "cacheID": "43b847cc928f70fff28b44828383d11a",
    "id": null,
    "metadata": {},
    "name": "insertEmployeeLicenseMutation",
    "operationKind": "mutation",
    "text": "mutation insertEmployeeLicenseMutation(\n  $object: hr_employees_docs_licenses_insert_input!\n) {\n  insert_hr_employees_docs_licenses_one(object: $object) {\n    id\n  }\n}\n"
  }
};
})();

node.hash = "17cacf4b1134e9d7fb63fa73928c017e";

module.exports = node;
