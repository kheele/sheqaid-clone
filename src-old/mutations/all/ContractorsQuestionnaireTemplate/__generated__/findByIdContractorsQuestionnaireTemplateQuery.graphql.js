/**
 * @generated SignedSource<<05f4ab65738ef27b9f1d116dfc460d9c>>
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
    "name": "findByIdContractorsQuestionnaireTemplateQuery",
    "selections": (v1/*: any*/),
    "type": "query_root",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "findByIdContractorsQuestionnaireTemplateQuery",
    "selections": (v1/*: any*/)
  },
  "params": {
    "cacheID": "bf5dc79e7dfaaa70405c4634ca69b644",
    "id": null,
    "metadata": {},
    "name": "findByIdContractorsQuestionnaireTemplateQuery",
    "operationKind": "query",
    "text": "query findByIdContractorsQuestionnaireTemplateQuery(\n  $id: bigint\n) {\n  default_contractor_questionnaire_templates_connection(where: {id: {_eq: $id}}) {\n    edges {\n      node {\n        id\n      }\n    }\n  }\n}\n"
  }
};
})();

node.hash = "56e603387c3947deb2d1c6f2a207e456";

module.exports = node;
