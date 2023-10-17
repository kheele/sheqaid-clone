/**
 * @generated SignedSource<<10f37f1caf690c0d868b552fb3e2c575>>
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
    "concreteType": "sheq_incident_investigation_investigations_docs",
    "kind": "LinkedField",
    "name": "insert_sheq_incident_investigation_investigations_docs_one",
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
    "name": "insertInvestigationDocumentMutation",
    "selections": (v1/*: any*/),
    "type": "mutation_root",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "insertInvestigationDocumentMutation",
    "selections": (v1/*: any*/)
  },
  "params": {
    "cacheID": "4b9b7465d3939e234e017afc084f481f",
    "id": null,
    "metadata": {},
    "name": "insertInvestigationDocumentMutation",
    "operationKind": "mutation",
    "text": "mutation insertInvestigationDocumentMutation(\n  $object: sheq_incident_investigation_investigations_docs_insert_input!\n) {\n  insert_sheq_incident_investigation_investigations_docs_one(object: $object) {\n    id\n  }\n}\n"
  }
};
})();

node.hash = "ae2f1fb531961218d682751cbfe35f6e";

module.exports = node;
