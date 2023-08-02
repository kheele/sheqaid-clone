/**
 * @generated SignedSource<<b486c961ad1f1dd48733cd1fdc9b9eca>>
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
    "concreteType": "hr_employees_docs_work_permits",
    "kind": "LinkedField",
    "name": "insert_hr_employees_docs_work_permits_one",
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
    "name": "insertEmployeeWorkPermitMutation",
    "selections": (v1/*: any*/),
    "type": "mutation_root",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "insertEmployeeWorkPermitMutation",
    "selections": (v1/*: any*/)
  },
  "params": {
    "cacheID": "509fdf36a6e90938c7337adcd0b2f62c",
    "id": null,
    "metadata": {},
    "name": "insertEmployeeWorkPermitMutation",
    "operationKind": "mutation",
    "text": "mutation insertEmployeeWorkPermitMutation(\n  $object: hr_employees_docs_work_permits_insert_input!\n) {\n  insert_hr_employees_docs_work_permits_one(object: $object) {\n    id\n  }\n}\n"
  }
};
})();

node.hash = "07c6952e3d998bd2a9f50b66ab44524c";

module.exports = node;
