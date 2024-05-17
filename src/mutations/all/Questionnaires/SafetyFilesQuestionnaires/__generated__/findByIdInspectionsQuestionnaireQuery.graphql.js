/**
 * @generated SignedSource<<e1f6e579ae667127c72a6b6cbce71cb4>>
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
    "name": "id"
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
                "variableName": "id"
              }
            ],
            "kind": "ObjectValue",
            "name": "id"
          }
        ],
        "kind": "ObjectValue",
        "name": "where"
      }
    ],
    "concreteType": "default_contractor_questionnairesConnection",
    "kind": "LinkedField",
    "name": "default_contractor_questionnaires_connection",
    "plural": false,
    "selections": [
      {
        "alias": null,
        "args": null,
        "concreteType": "default_contractor_questionnairesEdge",
        "kind": "LinkedField",
        "name": "edges",
        "plural": true,
        "selections": [
          {
            "alias": null,
            "args": null,
            "concreteType": "default_contractor_questionnaires",
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
    "name": "findByIdInspectionsQuestionnaireQuery",
    "selections": (v1/*: any*/),
    "type": "query_root",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "findByIdInspectionsQuestionnaireQuery",
    "selections": (v1/*: any*/)
  },
  "params": {
    "cacheID": "dbe2eaa42781d225f0489bd37fc81a99",
    "id": null,
    "metadata": {},
    "name": "findByIdInspectionsQuestionnaireQuery",
    "operationKind": "query",
    "text": "query findByIdInspectionsQuestionnaireQuery(\n  $id: bigint\n) {\n  default_contractor_questionnaires_connection(where: {id: {_eq: $id}}) {\n    edges {\n      node {\n        id\n      }\n    }\n  }\n}\n"
  }
};
})();

node.hash = "2df7a9e870d828f62500ab4af267e488";

module.exports = node;
