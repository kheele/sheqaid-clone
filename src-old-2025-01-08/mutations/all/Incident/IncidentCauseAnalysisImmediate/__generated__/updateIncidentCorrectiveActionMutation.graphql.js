/**
 * @generated SignedSource<<e5a766583311cb07cab95ff9da3b0505>>
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
    "cacheID": "45dc6932e7281033bc0ce64ec2de0a0f",
    "id": null,
    "metadata": {},
    "name": "updateIncidentCauseAnalysisImmediateMutation",
    "operationKind": "mutation",
    "text": "mutation updateIncidentCauseAnalysisImmediateMutation(\n  $id: sheq_incident_investigation_cause_analysis_immediate_pk_columns_input!\n  $_set: sheq_incident_investigation_cause_analysis_immediate_set_input!\n) {\n  update_sheq_incident_investigation_cause_analysis_immediate_by_pk(pk_columns: $id, _set: $_set) {\n    id\n  }\n}\n"
  }
};
})();

node.hash = "a1c9c5f30ce198ce59148aa48b8f2d03";

module.exports = node;
