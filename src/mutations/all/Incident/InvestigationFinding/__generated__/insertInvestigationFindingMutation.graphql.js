/**
 * @generated SignedSource<<5c7f46a231b7294afeec72d5fbadc37a>>
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
    "concreteType": "sheq_incident_investigation_investigations_findings",
    "kind": "LinkedField",
    "name": "insert_sheq_incident_investigation_investigations_findings_one",
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
    "name": "insertInvestigationFindingMutation",
    "selections": (v1/*: any*/),
    "type": "mutation_root",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "insertInvestigationFindingMutation",
    "selections": (v1/*: any*/)
  },
  "params": {
    "cacheID": "c99475cebc8a6ecc472908ec027c6e41",
    "id": null,
    "metadata": {},
    "name": "insertInvestigationFindingMutation",
    "operationKind": "mutation",
    "text": "mutation insertInvestigationFindingMutation(\n  $object: sheq_incident_investigation_investigations_findings_insert_input!\n) {\n  insert_sheq_incident_investigation_investigations_findings_one(object: $object) {\n    id\n  }\n}\n"
  }
};
})();

node.hash = "cf2c08b44286b85d7a2b9f52c3d6064d";

module.exports = node;
