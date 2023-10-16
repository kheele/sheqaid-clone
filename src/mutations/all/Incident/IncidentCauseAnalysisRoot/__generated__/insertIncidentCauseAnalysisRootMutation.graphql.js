/**
 * @generated SignedSource<<be494b2eb0f77df0c4e5d0746c5d7542>>
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
    "cacheID": "9ca7ea5fc980130f78f3482053144f2d",
    "id": null,
    "metadata": {},
    "name": "insertIncidentCauseAnalysisRootMutation",
    "operationKind": "mutation",
    "text": "mutation insertIncidentCauseAnalysisRootMutation(\n  $object: sheq_incident_investigation_cause_analysis_root_insert_input!\n) {\n  insert_sheq_incident_investigation_cause_analysis_root_one(object: $object) {\n    id\n  }\n}\n"
  }
};
})();

node.hash = "4792d499bacda8dfe28d47f01c2ec336";

module.exports = node;
