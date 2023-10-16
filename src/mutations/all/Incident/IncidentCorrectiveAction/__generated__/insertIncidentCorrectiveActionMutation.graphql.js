/**
 * @generated SignedSource<<341ffba5fa2eac2ffdfc65be5a07dd77>>
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
    "concreteType": "sheq_incident_investigation_corrective_actions_factors",
    "kind": "LinkedField",
    "name": "insert_sheq_incident_investigation_corrective_actions_factors_one",
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
    "cacheID": "6ef7ed2dc5a850a7ff3e02c6a847cfa8",
    "id": null,
    "metadata": {},
    "name": "insertIncidentCorrectiveActionMutation",
    "operationKind": "mutation",
    "text": "mutation insertIncidentCorrectiveActionMutation(\n  $object: sheq_incident_investigation_corrective_actions_factors_insert_input!\n) {\n  insert_sheq_incident_investigation_corrective_actions_factors_one(object: $object) {\n    id\n  }\n}\n"
  }
};
})();

node.hash = "23283a8a02d584f177bbb1eab4d9532c";

module.exports = node;
