/**
 * @generated SignedSource<<056275b57d97ee8000a540c5502dd5fe>>
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
    "name": "firestore_id"
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
                "variableName": "firestore_id"
              }
            ],
            "kind": "ObjectValue",
            "name": "firestore_id"
          }
        ],
        "kind": "ObjectValue",
        "name": "where"
      }
    ],
    "concreteType": "default_contractor_questionnaire_templatesConnection",
    "kind": "LinkedField",
    "name": "default_contractor_questionnaire_templates_connection",
    "plural": false,
    "selections": [
      {
        "alias": null,
        "args": null,
        "concreteType": "default_contractor_questionnaire_templatesEdge",
        "kind": "LinkedField",
        "name": "edges",
        "plural": true,
        "selections": [
          {
            "alias": null,
            "args": null,
            "concreteType": "default_contractor_questionnaire_templates",
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
    "name": "findByFirestoreIdContractorsQuestionnaireTemplateQuery",
    "selections": (v1/*: any*/),
    "type": "query_root",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "findByFirestoreIdContractorsQuestionnaireTemplateQuery",
    "selections": (v1/*: any*/)
  },
  "params": {
    "cacheID": "ea12c06552f56b9bcecc9ca7ce0a7ca5",
    "id": null,
    "metadata": {},
    "name": "findByFirestoreIdContractorsQuestionnaireTemplateQuery",
    "operationKind": "query",
    "text": "query findByFirestoreIdContractorsQuestionnaireTemplateQuery(\n  $firestore_id: String\n) {\n  default_contractor_questionnaire_templates_connection(where: {firestore_id: {_eq: $firestore_id}}) {\n    edges {\n      node {\n        id\n      }\n    }\n  }\n}\n"
  }
};
})();

node.hash = "ab13ce9ab8e6277e779ce54049b232c1";

module.exports = node;
