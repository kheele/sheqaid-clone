/**
 * @generated SignedSource<<66ffb0ddf51e6ead10ae1047bda1376e>>
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
    "concreteType": "hr_employees_docs_medicals",
    "kind": "LinkedField",
    "name": "insert_hr_employees_docs_medicals_one",
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
    "name": "insertEmployeeMedicalMutation",
    "selections": (v1/*: any*/),
    "type": "mutation_root",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "insertEmployeeMedicalMutation",
    "selections": (v1/*: any*/)
  },
  "params": {
    "cacheID": "990495563d1fb2ccdc69f398ab49ca27",
    "id": null,
    "metadata": {},
    "name": "insertEmployeeMedicalMutation",
    "operationKind": "mutation",
    "text": "mutation insertEmployeeMedicalMutation(\n  $object: hr_employees_docs_medicals_insert_input!\n) {\n  insert_hr_employees_docs_medicals_one(object: $object) {\n    id\n  }\n}\n"
  }
};
})();

node.hash = "0ab9f45420bf6c254fc1c4719590565c";

module.exports = node;
