/**
 * @generated SignedSource<<1d9ddfc60f8dbee4d91455045d417037>>
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
    "concreteType": "sheq_incident_investigation_cause_analysis_immediate",
    "kind": "LinkedField",
    "name": "insert_sheq_incident_investigation_cause_analysis_immediate_one",
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
    "name": "insertIncidentCauseAnalysisImmediateMutation",
    "selections": (v1/*: any*/),
    "type": "mutation_root",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "insertIncidentCauseAnalysisImmediateMutation",
    "selections": (v1/*: any*/)
  },
  "params": {
    "cacheID": "90a93f68ab6c19197bec87846b906654",
    "id": null,
    "metadata": {},
    "name": "insertIncidentCauseAnalysisImmediateMutation",
    "operationKind": "mutation",
    "text": "mutation insertIncidentCauseAnalysisImmediateMutation(\n  $object: sheq_incident_investigation_cause_analysis_immediate_insert_input!\n) {\n  insert_sheq_incident_investigation_cause_analysis_immediate_one(object: $object) {\n    id\n  }\n}\n"
  }
};
})();

node.hash = "3f6083d9f6710e581b9512bd29be3824";

module.exports = node;
