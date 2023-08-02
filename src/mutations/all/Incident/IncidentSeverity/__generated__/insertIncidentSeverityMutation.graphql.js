/**
 * @generated SignedSource<<f6cda2bdf1c7a79dc1df3c1bb8742132>>
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
    "concreteType": "sheq_incident_investigation_severity",
    "kind": "LinkedField",
    "name": "insert_sheq_incident_investigation_severity_one",
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
    "name": "insertIncidentSeverityMutation",
    "selections": (v1/*: any*/),
    "type": "mutation_root",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "insertIncidentSeverityMutation",
    "selections": (v1/*: any*/)
  },
  "params": {
    "cacheID": "4cf3fd80a34b920a7dafdff1a399b2cf",
    "id": null,
    "metadata": {},
    "name": "insertIncidentSeverityMutation",
    "operationKind": "mutation",
    "text": "mutation insertIncidentSeverityMutation(\n  $object: sheq_incident_investigation_severity_insert_input!\n) {\n  insert_sheq_incident_investigation_severity_one(object: $object) {\n    id\n  }\n}\n"
  }
};
})();

node.hash = "c5b67fa0e0df312fbc93ef26d24022ea";

module.exports = node;
