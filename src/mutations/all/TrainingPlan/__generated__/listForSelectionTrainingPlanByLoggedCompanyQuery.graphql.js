/**
 * @generated SignedSource<<5bb7f4c3b45fcebe463c7b8c77dbf2ce>>
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
    "name": "company_id"
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
                "variableName": "company_id"
              }
            ],
            "kind": "ObjectValue",
            "name": "company_id"
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
    "name": "listForSelectionTrainingPlanByLoggedCompanyQuery",
    "selections": (v1/*: any*/),
    "type": "query_root",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "listForSelectionTrainingPlanByLoggedCompanyQuery",
    "selections": (v1/*: any*/)
  },
  "params": {
    "cacheID": "0b1d1d82993ece93fe34bf0c1347b8e6",
    "id": null,
    "metadata": {},
    "name": "listForSelectionTrainingPlanByLoggedCompanyQuery",
    "operationKind": "query",
    "text": "query listForSelectionTrainingPlanByLoggedCompanyQuery(\n  $company_id: bigint\n) {\n  sheq_training_plans_connection(where: {company_id: {_eq: $company_id}}) {\n    edges {\n      node {\n        id\n        status\n        year\n      }\n    }\n  }\n}\n"
  }
};
})();

node.hash = "1f477181dbdaca24ebbfd0ead9f114b1";

module.exports = node;
