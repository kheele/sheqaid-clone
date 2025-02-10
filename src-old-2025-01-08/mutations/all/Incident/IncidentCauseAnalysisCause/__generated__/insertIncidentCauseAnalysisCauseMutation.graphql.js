/**
 * @generated SignedSource<<f8307212bcaabf462b0f00f90ec6371f>>
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
    "concreteType": "sheq_incident_investigation_cause_analysis_causes",
    "kind": "LinkedField",
    "name": "insert_sheq_incident_investigation_cause_analysis_causes_one",
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
    "name": "insertIncidentCauseAnalysisCauseMutation",
    "selections": (v1/*: any*/),
    "type": "mutation_root",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "insertIncidentCauseAnalysisCauseMutation",
    "selections": (v1/*: any*/)
  },
  "params": {
    "cacheID": "ff7b18929d001a5094e7eba4a7daaca6",
    "id": null,
    "metadata": {},
    "name": "insertIncidentCauseAnalysisCauseMutation",
    "operationKind": "mutation",
    "text": "mutation insertIncidentCauseAnalysisCauseMutation(\n  $object: sheq_incident_investigation_cause_analysis_causes_insert_input!\n) {\n  insert_sheq_incident_investigation_cause_analysis_causes_one(object: $object) {\n    id\n  }\n}\n"
  }
};
})();

node.hash = "d2b96f354031d110c8d606373cd8f612";

module.exports = node;
