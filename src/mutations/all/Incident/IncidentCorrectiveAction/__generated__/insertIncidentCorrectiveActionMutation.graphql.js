/**
 * @generated SignedSource<<46036376c3055cc53ad474dab9050add>>
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
    "concreteType": "sheq_incident_investigation_corrective_actions",
    "kind": "LinkedField",
    "name": "insert_sheq_incident_investigation_corrective_actions_one",
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
    "name": "insertIncidentCorrectiveActionMutation",
    "selections": (v1/*: any*/),
    "type": "mutation_root",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "insertIncidentCorrectiveActionMutation",
    "selections": (v1/*: any*/)
  },
  "params": {
    "cacheID": "d739c8cae7e375710000e84a3990449c",
    "id": null,
    "metadata": {},
    "name": "insertIncidentCorrectiveActionMutation",
    "operationKind": "mutation",
    "text": "mutation insertIncidentCorrectiveActionMutation(\n  $object: sheq_incident_investigation_corrective_actions_insert_input!\n) {\n  insert_sheq_incident_investigation_corrective_actions_one(object: $object) {\n    id\n  }\n}\n"
  }
};
})();

node.hash = "ac76a4b680ef6caae56772c896d6244b";

module.exports = node;
