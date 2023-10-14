/**
 * @generated SignedSource<<c6c049a7109c9e41cbee9c244c95fc52>>
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
    "cacheID": "f83cd0f254d2d2cc207e9ca8cdf152b4",
    "id": null,
    "metadata": {},
    "name": "insertIncidentCauseAnalysisRootMutation",
    "operationKind": "mutation",
    "text": "mutation insertIncidentCauseAnalysisRootMutation(\n  $object: sheq_incident_investigation_cause_analysis_root_insert_input!\n) {\n  insert_sheq_incident_investigation_cause_analysis_root_one(object: $object) {\n    id\n  }\n}\n"
  }
};
})();

node.hash = "cbc27d8de4d1b0e93a34fdcfbc542294";

module.exports = node;
