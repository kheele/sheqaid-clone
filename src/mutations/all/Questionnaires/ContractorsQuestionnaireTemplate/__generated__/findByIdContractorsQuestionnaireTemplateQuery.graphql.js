/**
 * @generated SignedSource<<25019bccee7af86f1ef2c2c508ebdb08>>
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
  (v1/*: any*/),
  {
    "alias": null,
    "args": null,
    "kind": "ScalarField",
    "name": "type",
    "storageKey": null
  },
  {
    "alias": null,
    "args": null,
    "kind": "ScalarField",
    "name": "doc_num",
    "storageKey": null
  },
  {
    "alias": null,
    "args": null,
    "kind": "ScalarField",
    "name": "doc",
    "storageKey": null
  },
  {
    "alias": null,
    "args": null,
    "kind": "ScalarField",
    "name": "expiry",
    "storageKey": null
  }
],
v4 = [
  (v1/*: any*/),
  (v2/*: any*/)
],
v5 = [
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
              (v1/*: any*/),
              {
                "alias": null,
                "args": null,
                "kind": "ScalarField",
                "name": "created_at",
                "storageKey": null
              },
              (v2/*: any*/),
              {
                "alias": null,
                "args": null,
                "kind": "ScalarField",
                "name": "category",
                "storageKey": null
              },
              {
                "alias": null,
                "args": null,
                "kind": "ScalarField",
                "name": "desc",
                "storageKey": null
              },
              {
                "alias": null,
                "args": null,
                "concreteType": "default_doc_versions",
                "kind": "LinkedField",
                "name": "doc_version_list",
                "plural": true,
                "selections": (v3/*: any*/),
                "storageKey": null
              },
              {
                "alias": "latest_version",
                "args": [
                  {
                    "kind": "Literal",
                    "name": "order_by",
                    "value": {
                      "expiry": "desc_nulls_last"
                    }
                  }
                ],
                "concreteType": "default_doc_versions",
                "kind": "LinkedField",
                "name": "doc_version_list",
                "plural": true,
                "selections": (v3/*: any*/),
                "storageKey": "doc_version_list(order_by:{\"expiry\":\"desc_nulls_last\"})"
              },
              {
                "alias": null,
                "args": null,
                "concreteType": "default_sites",
                "kind": "LinkedField",
                "name": "contractor_site",
                "plural": false,
                "selections": (v4/*: any*/),
                "storageKey": null
              },
              {
                "alias": null,
                "args": null,
                "concreteType": "default_contractors",
                "kind": "LinkedField",
                "name": "contractor",
                "plural": false,
                "selections": (v4/*: any*/),
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
    "selections": (v5/*: any*/),
    "type": "query_root",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "findByIdContractorsQuestionnaireTemplateQuery",
    "selections": (v5/*: any*/)
  },
  "params": {
    "cacheID": "845918f04d3b8b882db36b11a98020b8",
    "id": null,
    "metadata": {},
    "name": "findByIdContractorsQuestionnaireTemplateQuery",
    "operationKind": "query",
    "text": "query findByIdContractorsQuestionnaireTemplateQuery(\n  $id: bigint\n) {\n  default_contractor_questionnaire_templates_connection(where: {id: {_eq: $id}}) {\n    edges {\n      node {\n        id\n        created_at\n        name\n        category\n        desc\n        doc_version_list {\n          id\n          type\n          doc_num\n          doc\n          expiry\n        }\n        latest_version: doc_version_list(order_by: {expiry: desc_nulls_last}) {\n          id\n          type\n          doc_num\n          doc\n          expiry\n        }\n        contractor_site {\n          id\n          name\n        }\n        contractor {\n          id\n          name\n        }\n      }\n    }\n  }\n}\n"
  }
};
})();

node.hash = "1c4385165587eabee918f6e7b4abc4b6";

module.exports = node;
