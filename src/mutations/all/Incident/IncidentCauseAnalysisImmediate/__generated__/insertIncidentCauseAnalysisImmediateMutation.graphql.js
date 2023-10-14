/**
 * @generated SignedSource<<11d12403687fb1c825ed453f22c61706>>
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
    "cacheID": "f3af36b3db62c8ced2de6caa49c5f70b",
    "id": null,
    "metadata": {},
    "name": "insertIncidentCauseAnalysisImmediateMutation",
    "operationKind": "mutation",
    "text": "mutation insertIncidentCauseAnalysisImmediateMutation(\n  $object: sheq_incident_investigation_cause_analysis_immediate_insert_input!\n) {\n  insert_sheq_incident_investigation_cause_analysis_immediate_one(object: $object) {\n    id\n  }\n}\n"
  }
};
})();

node.hash = "6a7f644f29e7e5b50ace706cbc0cc010";

module.exports = node;
