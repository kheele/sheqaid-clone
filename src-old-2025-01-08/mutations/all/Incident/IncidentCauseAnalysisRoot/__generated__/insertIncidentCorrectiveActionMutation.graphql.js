/**
 * @generated SignedSource<<ce61c977ea199adbe7e2ee4d1358ed7c>>
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
    "concreteType": "sheq_incident_investigation_cause_analysis_root",
    "kind": "LinkedField",
    "name": "insert_sheq_incident_investigation_cause_analysis_root_one",
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
    "name": "insertIncidentCauseAnalysisRootMutation",
    "selections": (v1/*: any*/),
    "type": "mutation_root",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "insertIncidentCauseAnalysisRootMutation",
    "selections": (v1/*: any*/)
  },
  "params": {
    "cacheID": "edcf11230caba15814a4efdd853557d3",
    "id": null,
    "metadata": {},
    "name": "insertIncidentCauseAnalysisRootMutation",
    "operationKind": "mutation",
    "text": "mutation insertIncidentCauseAnalysisRootMutation(\n  $object: sheq_incident_investigation_cause_analysis_root_insert_input!\n) {\n  insert_sheq_incident_investigation_cause_analysis_root_one(object: $object) {\n    id\n  }\n}\n"
  }
};
})();

node.hash = "e7fc78f39cdbdbb0398c07e2f1c89c4d";

module.exports = node;
