/**
 * @generated SignedSource<<0242d27f3930da6fb35ecc40bf497fa3>>
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
    "name": "client_id"
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
                "variableName": "client_id"
              }
            ],
            "kind": "ObjectValue",
            "name": "client_id"
          }
        ],
        "kind": "ObjectValue",
        "name": "where"
      }
    ],
    "concreteType": "sheq_training_plansConnection",
    "kind": "LinkedField",
    "name": "sheq_training_plans_connection",
    "plural": false,
    "selections": [
      {
        "alias": null,
        "args": null,
        "concreteType": "sheq_training_plansEdge",
        "kind": "LinkedField",
        "name": "edges",
        "plural": true,
        "selections": [
          {
            "alias": null,
            "args": null,
            "concreteType": "sheq_training_plans",
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
              },
              {
                "alias": null,
                "args": null,
                "kind": "ScalarField",
                "name": "status",
                "storageKey": null
              },
              {
                "alias": null,
                "args": null,
                "kind": "ScalarField",
                "name": "year",
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
    "name": "listForSelectionTrainingPlanByLoggedClientQuery",
    "selections": (v1/*: any*/),
    "type": "query_root",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "listForSelectionTrainingPlanByLoggedClientQuery",
    "selections": (v1/*: any*/)
  },
  "params": {
    "cacheID": "01d8b8aec039ebcec0054e63280af43a",
    "id": null,
    "metadata": {},
    "name": "listForSelectionTrainingPlanByLoggedClientQuery",
    "operationKind": "query",
    "text": "query listForSelectionTrainingPlanByLoggedClientQuery(\n  $client_id: bigint\n) {\n  sheq_training_plans_connection(where: {client_id: {_eq: $client_id}}) {\n    edges {\n      node {\n        id\n        status\n        year\n      }\n    }\n  }\n}\n"
  }
};
})();

node.hash = "75187318f0296b67512a2a725c007948";

module.exports = node;
