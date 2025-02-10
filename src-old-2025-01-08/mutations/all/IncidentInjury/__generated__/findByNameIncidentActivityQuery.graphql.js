/**
 * @generated SignedSource<<74ed9fbd2698ed530d27b9ae3f925bf9>>
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
    "name": "name"
  }
],
v1 = [
  {
    "alias": null,
    "args": [
      {
        "fields": [
          {
            "fields": [
              {
                "kind": "Variable",
                "name": "_eq",
                "variableName": "name"
              }
            ],
            "kind": "ObjectValue",
            "name": "name"
          }
        ],
        "kind": "ObjectValue",
        "name": "where"
      }
    ],
    "concreteType": "sheq_incident_investigation_activitiesConnection",
    "kind": "LinkedField",
    "name": "sheq_incident_investigation_activities_connection",
    "plural": false,
    "selections": [
      {
        "alias": null,
        "args": null,
        "concreteType": "sheq_incident_investigation_activitiesEdge",
        "kind": "LinkedField",
        "name": "edges",
        "plural": true,
        "selections": [
          {
            "alias": null,
            "args": null,
            "concreteType": "sheq_incident_investigation_activities",
            "kind": "LinkedField",
            "name": "node",
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
    "name": "findByNameIncidentActivityQuery",
    "selections": (v1/*: any*/),
    "type": "query_root",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "findByNameIncidentActivityQuery",
    "selections": (v1/*: any*/)
  },
  "params": {
    "cacheID": "8e6012acaee8f4739ab6235ffd00598b",
    "id": null,
    "metadata": {},
    "name": "findByNameIncidentActivityQuery",
    "operationKind": "query",
    "text": "query findByNameIncidentActivityQuery(\n  $name: String\n) {\n  sheq_incident_investigation_activities_connection(where: {name: {_eq: $name}}) {\n    edges {\n      node {\n        id\n      }\n    }\n  }\n}\n"
  }
};
})();

node.hash = "cfc6c8228492bebbb78bc9ab4c45af2a";

module.exports = node;
