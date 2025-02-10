/**
 * @generated SignedSource<<190e6ddedd7ddc0be079207150c38981>>
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
    "concreteType": "sheq_incident_investigation_investigations",
    "kind": "LinkedField",
    "name": "insert_sheq_incident_investigation_investigations_one",
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
    "name": "insertIncidentInvestigationMutation",
    "selections": (v1/*: any*/),
    "type": "mutation_root",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "insertIncidentInvestigationMutation",
    "selections": (v1/*: any*/)
  },
  "params": {
    "cacheID": "025566b94c425c0a6cb6e927bf3550b2",
    "id": null,
    "metadata": {},
    "name": "insertIncidentInvestigationMutation",
    "operationKind": "mutation",
    "text": "mutation insertIncidentInvestigationMutation(\n  $object: sheq_incident_investigation_investigations_insert_input!\n) {\n  insert_sheq_incident_investigation_investigations_one(object: $object) {\n    id\n  }\n}\n"
  }
};
})();

node.hash = "fe16460b8d9534c522c307e2c579e13b";

module.exports = node;
