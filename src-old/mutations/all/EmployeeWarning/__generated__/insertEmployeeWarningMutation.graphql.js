/**
 * @generated SignedSource<<428021a5ee6d256e9dd6cab8f22e71f9>>
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
    "concreteType": "hr_employees_docs_warnings",
    "kind": "LinkedField",
    "name": "insert_hr_employees_docs_warnings_one",
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
    "name": "insertEmployeeWarningMutation",
    "selections": (v1/*: any*/),
    "type": "mutation_root",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "insertEmployeeWarningMutation",
    "selections": (v1/*: any*/)
  },
  "params": {
    "cacheID": "1252eaf891de3e71ca9eae33d697e752",
    "id": null,
    "metadata": {},
    "name": "insertEmployeeWarningMutation",
    "operationKind": "mutation",
    "text": "mutation insertEmployeeWarningMutation(\n  $object: hr_employees_docs_warnings_insert_input!\n) {\n  insert_hr_employees_docs_warnings_one(object: $object) {\n    id\n  }\n}\n"
  }
};
})();

node.hash = "5c8cdb6e126ef1e2308c8be76608d16b";

module.exports = node;
