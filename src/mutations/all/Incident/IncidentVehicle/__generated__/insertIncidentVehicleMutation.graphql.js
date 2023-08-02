/**
 * @generated SignedSource<<e4839df6674e212b9245e1bfcc868d2c>>
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
    "concreteType": "sheq_incident_investigation_vehicles",
    "kind": "LinkedField",
    "name": "insert_sheq_incident_investigation_vehicles_one",
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
    "name": "insertIncidentVehicleMutation",
    "selections": (v1/*: any*/),
    "type": "mutation_root",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "insertIncidentVehicleMutation",
    "selections": (v1/*: any*/)
  },
  "params": {
    "cacheID": "7ca6e32220c6110dfd3adf21fd4b853c",
    "id": null,
    "metadata": {},
    "name": "insertIncidentVehicleMutation",
    "operationKind": "mutation",
    "text": "mutation insertIncidentVehicleMutation(\n  $object: sheq_incident_investigation_vehicles_insert_input!\n) {\n  insert_sheq_incident_investigation_vehicles_one(object: $object) {\n    id\n  }\n}\n"
  }
};
})();

node.hash = "e704396b6f604c5e5fa75c18bd819a32";

module.exports = node;
