/**
 * @generated SignedSource<<9037e23d61359ae577d561c7e6988f7b>>
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
    "concreteType": "sheq_incident_investigation_injury_list",
    "kind": "LinkedField",
    "name": "insert_sheq_incident_investigation_injury_list_one",
    "plural": false,
    "selections": [
      {
        "alias": null,
        "args": null,
        "kind": "ScalarField",
        "name": "id",
        "storageKey": null
      },
      {
        "alias": null,
        "args": null,
        "kind": "ScalarField",
        "name": "name",
        "storageKey": null
      },
      {
        "alias": null,
        "args": null,
        "kind": "ScalarField",
        "name": "type",
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
    "name": "insertIncidentInjuryMutation",
    "selections": (v1/*: any*/),
    "type": "mutation_root",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "insertIncidentInjuryMutation",
    "selections": (v1/*: any*/)
  },
  "params": {
    "cacheID": "5cee208146d76b5a871de1018c935f30",
    "id": null,
    "metadata": {},
    "name": "insertIncidentInjuryMutation",
    "operationKind": "mutation",
    "text": "mutation insertIncidentInjuryMutation(\n  $object: sheq_incident_investigation_injury_list_insert_input!\n) {\n  insert_sheq_incident_investigation_injury_list_one(object: $object) {\n    id\n    name\n    type\n  }\n}\n"
  }
};
})();

node.hash = "4fcff434915069047aa51d36f42345c5";

module.exports = node;
