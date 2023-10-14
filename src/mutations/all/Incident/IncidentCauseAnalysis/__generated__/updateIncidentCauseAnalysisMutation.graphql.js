/**
 * @generated SignedSource<<f07fa598b538c3137efa95700a121b28>>
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
    "concreteType": "sheq_incident_investigation_cause_analysis",
    "kind": "LinkedField",
    "name": "update_sheq_incident_investigation_cause_analysis_by_pk",
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
    "name": "updateIncidentCauseAnalysisMutation",
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
    "name": "updateIncidentCauseAnalysisMutation",
    "selections": (v2/*: any*/)
  },
  "params": {
    "cacheID": "1b035b3b75cd81db11b5e0eac1969ea8",
    "id": null,
    "metadata": {},
    "name": "updateIncidentCauseAnalysisMutation",
    "operationKind": "mutation",
    "text": "mutation updateIncidentCauseAnalysisMutation(\n  $id: sheq_incident_investigation_cause_analysis_pk_columns_input!\n  $_set: sheq_incident_investigation_cause_analysis_set_input!\n) {\n  update_sheq_incident_investigation_cause_analysis_by_pk(pk_columns: $id, _set: $_set) {\n    id\n  }\n}\n"
  }
};
})();

node.hash = "4b3337bfdb3ad7a9ec744872149c53cd";

module.exports = node;
