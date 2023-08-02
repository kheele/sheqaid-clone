/**
 * @generated SignedSource<<25db0856b086ee9977a1163328950b84>>
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
    "concreteType": "hr_employees_docs_competencies",
    "kind": "LinkedField",
    "name": "insert_hr_employees_docs_competencies_one",
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
    "name": "insertEmployeeCompetencyMutation",
    "selections": (v1/*: any*/),
    "type": "mutation_root",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "insertEmployeeCompetencyMutation",
    "selections": (v1/*: any*/)
  },
  "params": {
    "cacheID": "9ae09d38b8a53949a5818520ff7dfd23",
    "id": null,
    "metadata": {},
    "name": "insertEmployeeCompetencyMutation",
    "operationKind": "mutation",
    "text": "mutation insertEmployeeCompetencyMutation(\n  $object: hr_employees_docs_competencies_insert_input!\n) {\n  insert_hr_employees_docs_competencies_one(object: $object) {\n    id\n  }\n}\n"
  }
};
})();

node.hash = "61c86a49aecb334dd998d67cc2b57400";

module.exports = node;
