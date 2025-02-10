/**
 * @generated SignedSource<<ca091d15d68558a3601db8be18c8b087>>
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
    "concreteType": "sheq_incident_investigation_docs",
    "kind": "LinkedField",
    "name": "insert_sheq_incident_investigation_docs_one",
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
    "name": "insertIncidentDocumentMutation",
    "selections": (v1/*: any*/),
    "type": "mutation_root",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "insertIncidentDocumentMutation",
    "selections": (v1/*: any*/)
  },
  "params": {
    "cacheID": "15abf1178c6bdec776e87e947d138a18",
    "id": null,
    "metadata": {},
    "name": "insertIncidentDocumentMutation",
    "operationKind": "mutation",
    "text": "mutation insertIncidentDocumentMutation(\n  $object: sheq_incident_investigation_docs_insert_input!\n) {\n  insert_sheq_incident_investigation_docs_one(object: $object) {\n    id\n  }\n}\n"
  }
};
})();

node.hash = "025636848ec9df26b8fcdeb95a4925ad";

module.exports = node;
