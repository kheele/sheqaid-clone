/**
 * @generated SignedSource<<145a75953c7d5e2d050eae58f59760db>>
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
    "concreteType": "sheq_incident_investigation_cause_analysis_root",
    "kind": "LinkedField",
    "name": "update_sheq_incident_investigation_cause_analysis_root_by_pk",
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
    "name": "updateIncidentCauseAnalysisRootMutation",
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
    "name": "updateIncidentCauseAnalysisRootMutation",
    "selections": (v2/*: any*/)
  },
  "params": {
    "cacheID": "60a31d230435e952226757f62edb4b86",
    "id": null,
    "metadata": {},
    "name": "updateIncidentCauseAnalysisRootMutation",
    "operationKind": "mutation",
    "text": "mutation updateIncidentCauseAnalysisRootMutation(\n  $id: sheq_incident_investigation_cause_analysis_root_pk_columns_input!\n  $_set: sheq_incident_investigation_cause_analysis_root_set_input!\n) {\n  update_sheq_incident_investigation_cause_analysis_root_by_pk(pk_columns: $id, _set: $_set) {\n    id\n  }\n}\n"
  }
};
})();

node.hash = "9fff46728a5c38482f92206e6d0d6993";

module.exports = node;
