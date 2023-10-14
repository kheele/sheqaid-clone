/**
 * @generated SignedSource<<a5c6c31dc285d4cf80227c184bbccc5e>>
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
    "cacheID": "5f1d608b96b1fc96f1c66e7a048a4122",
    "id": null,
    "metadata": {},
    "name": "insertIncidentCauseAnalysisRootMutation",
    "operationKind": "mutation",
    "text": "mutation insertIncidentCauseAnalysisRootMutation(\n  $object: sheq_incident_investigation_cause_analysis_root_insert_input!\n) {\n  insert_sheq_incident_investigation_cause_analysis_root_one(object: $object) {\n    id\n  }\n}\n"
  }
};
})();

node.hash = "9d1113f770b3dc8a80cc9fb7cb0b80c4";

module.exports = node;
