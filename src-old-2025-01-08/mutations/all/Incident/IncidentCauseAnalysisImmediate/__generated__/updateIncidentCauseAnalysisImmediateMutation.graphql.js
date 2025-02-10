/**
 * @generated SignedSource<<a4fba9ca7e48b0c2191f6e4fb1d4e2da>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* eslint-disable */

'use strict';

var node = (function(){
var v0 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "_set"
},
v1 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "id"
},
v2 = [
  {
    "alias": null,
    "args": [
      {
        "kind": "Variable",
        "name": "_set",
        "variableName": "_set"
      },
      {
        "kind": "Variable",
        "name": "pk_columns",
        "variableName": "id"
      }
    ],
    "concreteType": "sheq_incident_investigation_cause_analysis_immediate",
    "kind": "LinkedField",
    "name": "update_sheq_incident_investigation_cause_analysis_immediate_by_pk",
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
    "argumentDefinitions": [
      (v0/*: any*/),
      (v1/*: any*/)
    ],
    "kind": "Fragment",
    "metadata": null,
    "name": "updateIncidentCauseAnalysisImmediateMutation",
    "selections": (v2/*: any*/),
    "type": "mutation_root",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": [
      (v1/*: any*/),
      (v0/*: any*/)
    ],
    "kind": "Operation",
    "name": "updateIncidentCauseAnalysisImmediateMutation",
    "selections": (v2/*: any*/)
  },
  "params": {
    "cacheID": "d794f546ae2de2e8188c1a53e27a7c4f",
    "id": null,
    "metadata": {},
    "name": "updateIncidentCauseAnalysisImmediateMutation",
    "operationKind": "mutation",
    "text": "mutation updateIncidentCauseAnalysisImmediateMutation(\n  $id: sheq_incident_investigation_cause_analysis_immediate_pk_columns_input!\n  $_set: sheq_incident_investigation_cause_analysis_immediate_set_input!\n) {\n  update_sheq_incident_investigation_cause_analysis_immediate_by_pk(pk_columns: $id, _set: $_set) {\n    id\n  }\n}\n"
  }
};
})();

node.hash = "c0c662c15b27437acd7a88a286bf5fc2";

module.exports = node;
