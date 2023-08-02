/**
 * @generated SignedSource<<3a9717b9c715b8ef95ba240191668eb1>>
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
        "kind": "Variable",
        "name": "object",
        "variableName": "object"
      }
    ],
    "concreteType": "default_contractor_questionnaire_templates",
    "kind": "LinkedField",
    "name": "insert_default_contractor_questionnaire_templates_one",
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
];
return {
  "fragment": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Fragment",
    "metadata": null,
    "name": "insertContractorsQuestionnaireTemplateMutation",
    "selections": (v5/*: any*/),
    "type": "mutation_root",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "insertContractorsQuestionnaireTemplateMutation",
    "selections": (v5/*: any*/)
  },
  "params": {
    "cacheID": "c763f754286d9f1c54f440d328c4e154",
    "id": null,
    "metadata": {},
    "name": "insertContractorsQuestionnaireTemplateMutation",
    "operationKind": "mutation",
    "text": "mutation insertContractorsQuestionnaireTemplateMutation(\n  $object: default_contractor_questionnaire_templates_insert_input!\n) {\n  insert_default_contractor_questionnaire_templates_one(object: $object) {\n    id\n    created_at\n    name\n    category\n    desc\n    doc_version_list {\n      id\n      type\n      doc_num\n      doc\n      expiry\n    }\n    latest_version: doc_version_list(order_by: {expiry: desc_nulls_last}) {\n      id\n      type\n      doc_num\n      doc\n      expiry\n    }\n    contractor_site {\n      id\n      name\n    }\n    contractor {\n      id\n      name\n    }\n  }\n}\n"
  }
};
})();

node.hash = "5ece14c5783da63ab04b8886ed3ef7ac";

module.exports = node;
