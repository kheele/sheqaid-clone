/**
 * @generated SignedSource<<82708ea6ac52cb7bc270496c2e031339>>
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
    "cacheID": "c189102847e5348c7b559b28b4ef08e4",
    "id": null,
    "metadata": {},
    "name": "updateIncidentCauseAnalysisImmediateMutation",
    "operationKind": "mutation",
    "text": "mutation updateIncidentCauseAnalysisImmediateMutation(\n  $id: sheq_incident_investigation_cause_analysis_immediate_pk_columns_input!\n  $_set: sheq_incident_investigation_cause_analysis_immediate_set_input!\n) {\n  update_sheq_incident_investigation_cause_analysis_immediate_by_pk(pk_columns: $id, _set: $_set) {\n    id\n  }\n}\n"
  }
};
})();

node.hash = "9d5ff5f1b9835353a0d75fba2e64c06c";

module.exports = node;
