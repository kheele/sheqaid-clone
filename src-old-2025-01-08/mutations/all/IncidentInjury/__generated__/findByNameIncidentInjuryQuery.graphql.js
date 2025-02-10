/**
 * @generated SignedSource<<f1c72a3de025f33252dd2d0a43eb3449>>
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
    "concreteType": "sheq_incident_investigation_injury_listConnection",
    "kind": "LinkedField",
    "name": "sheq_incident_investigation_injury_list_connection",
    "plural": false,
    "selections": [
      {
        "alias": null,
        "args": null,
        "concreteType": "sheq_incident_investigation_injury_listEdge",
        "kind": "LinkedField",
        "name": "edges",
        "plural": true,
        "selections": [
          {
            "alias": null,
            "args": null,
            "concreteType": "sheq_incident_investigation_injury_list",
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
    "name": "findByNameIncidentInjuryQuery",
    "selections": (v1/*: any*/),
    "type": "query_root",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "findByNameIncidentInjuryQuery",
    "selections": (v1/*: any*/)
  },
  "params": {
    "cacheID": "2dee58001d5ab80dc12d32c22d9b8ad5",
    "id": null,
    "metadata": {},
    "name": "findByNameIncidentInjuryQuery",
    "operationKind": "query",
    "text": "query findByNameIncidentInjuryQuery(\n  $name: String\n) {\n  sheq_incident_investigation_injury_list_connection(where: {name: {_eq: $name}}) {\n    edges {\n      node {\n        id\n      }\n    }\n  }\n}\n"
  }
};
})();

node.hash = "9d0f813e6b31984fe505646a3b586f66";

module.exports = node;
