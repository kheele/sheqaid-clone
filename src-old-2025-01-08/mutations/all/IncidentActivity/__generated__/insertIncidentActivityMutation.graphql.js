/**
 * @generated SignedSource<<f59b91c3b613e3af5b1c22126a8406cf>>
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
v1 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "id",
  "storageKey": null
},
v2 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "name",
  "storageKey": null
},
v3 = [
  {
    "alias": null,
    "args": [
      {
        "kind": "Variable",
        "name": "object",
        "variableName": "object"
      }
    ],
    "concreteType": "sheq_incident_investigation_activities",
    "kind": "LinkedField",
    "name": "insert_sheq_incident_investigation_activities_one",
    "plural": false,
    "selections": [
      (v1/*: any*/),
      (v2/*: any*/),
      {
        "alias": null,
        "args": null,
        "concreteType": "default_sectors",
        "kind": "LinkedField",
        "name": "sector",
        "plural": false,
        "selections": [
          (v1/*: any*/),
          (v2/*: any*/)
        ],
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
    "name": "insertIncidentActivityMutation",
    "selections": (v3/*: any*/),
    "type": "mutation_root",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "insertIncidentActivityMutation",
    "selections": (v3/*: any*/)
  },
  "params": {
    "cacheID": "6a19272815148c83b39b78d90f19e422",
    "id": null,
    "metadata": {},
    "name": "insertIncidentActivityMutation",
    "operationKind": "mutation",
    "text": "mutation insertIncidentActivityMutation(\n  $object: sheq_incident_investigation_activities_insert_input!\n) {\n  insert_sheq_incident_investigation_activities_one(object: $object) {\n    id\n    name\n    sector {\n      id\n      name\n    }\n  }\n}\n"
  }
};
})();

node.hash = "4ce2b5cee2a5b6421c3a58c17782fab7";

module.exports = node;
