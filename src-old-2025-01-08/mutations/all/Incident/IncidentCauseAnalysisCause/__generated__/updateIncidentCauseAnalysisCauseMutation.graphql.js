/**
 * @generated SignedSource<<bde081bdb4beb5ff056da9a7e971d139>>
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
    "concreteType": "sheq_incident_investigation_cause_analysis_causes",
    "kind": "LinkedField",
    "name": "update_sheq_incident_investigation_cause_analysis_causes_by_pk",
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
    "name": "updateIncidentCauseAnalysisCauseMutation",
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
    "name": "updateIncidentCauseAnalysisCauseMutation",
    "selections": (v2/*: any*/)
  },
  "params": {
    "cacheID": "774cdd3155c164037b674bbb9af2aacd",
    "id": null,
    "metadata": {},
    "name": "updateIncidentCauseAnalysisCauseMutation",
    "operationKind": "mutation",
    "text": "mutation updateIncidentCauseAnalysisCauseMutation(\n  $id: sheq_incident_investigation_cause_analysis_causes_pk_columns_input!\n  $_set: sheq_incident_investigation_cause_analysis_causes_set_input!\n) {\n  update_sheq_incident_investigation_cause_analysis_causes_by_pk(pk_columns: $id, _set: $_set) {\n    id\n  }\n}\n"
  }
};
})();

node.hash = "bceef2bde7b37261cd110eb8593c4d43";

module.exports = node;
