/**
 * @generated SignedSource<<4fc77552b6a13f82e41b2ed81a16af99>>
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
    "concreteType": "hr_employees_docs_counsellings",
    "kind": "LinkedField",
    "name": "insert_hr_employees_docs_counsellings_one",
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
    "name": "insertEmployeeCounsellingMutation",
    "selections": (v1/*: any*/),
    "type": "mutation_root",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "insertEmployeeCounsellingMutation",
    "selections": (v1/*: any*/)
  },
  "params": {
    "cacheID": "f89fcd76f825f263ed7fc02485f4749e",
    "id": null,
    "metadata": {},
    "name": "insertEmployeeCounsellingMutation",
    "operationKind": "mutation",
    "text": "mutation insertEmployeeCounsellingMutation(\n  $object: hr_employees_docs_counsellings_insert_input!\n) {\n  insert_hr_employees_docs_counsellings_one(object: $object) {\n    id\n  }\n}\n"
  }
};
})();

node.hash = "7bfe5eabe788faf5084832becabf7c8b";

module.exports = node;
