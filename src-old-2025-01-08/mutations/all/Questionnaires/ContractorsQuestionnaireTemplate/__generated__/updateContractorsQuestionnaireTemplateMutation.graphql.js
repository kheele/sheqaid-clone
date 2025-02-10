/**
 * @generated SignedSource<<50ba351653d8d03162d6e61b0b17e9e5>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* eslint-disable */

'use strict';

var node = (function(){
var v0 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "_set"
},
v1 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "id"
},
v2 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "id",
  "storageKey": null
},
v3 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "name",
  "storageKey": null
},
v4 = [
  (v2/*: any*/),
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
v5 = [
  (v2/*: any*/),
  (v3/*: any*/)
],
v6 = [
  {
    "alias": null,
    "args": [
      {
        "kind": "Variable",
        "name": "_set",
        "variableName": "_set"
      },
      {
        "kind": "Variable",
        "name": "pk_columns",
        "variableName": "id"
      }
    ],
    "concreteType": "default_contractor_questionnaire_templates",
    "kind": "LinkedField",
    "name": "update_default_contractor_questionnaire_templates_by_pk",
    "plural": false,
    "selections": [
      (v2/*: any*/),
      {
        "alias": null,
        "args": null,
        "kind": "ScalarField",
        "name": "created_at",
        "storageKey": null
      },
      (v3/*: any*/),
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
        "selections": (v4/*: any*/),
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
        "selections": (v4/*: any*/),
        "storageKey": "doc_version_list(order_by:{\"expiry\":\"desc_nulls_last\"})"
      },
      {
        "alias": null,
        "args": null,
        "concreteType": "default_sites",
        "kind": "LinkedField",
        "name": "contractor_site",
        "plural": false,
        "selections": (v5/*: any*/),
        "storageKey": null
      },
      {
        "alias": null,
        "args": null,
        "concreteType": "default_contractors",
        "kind": "LinkedField",
        "name": "contractor",
        "plural": false,
        "selections": (v5/*: any*/),
        "storageKey": null
      }
    ],
    "storageKey": null
  }
];
return {
  "fragment": {
    "argumentDefinitions": [
      (v0/*: any*/),
      (v1/*: any*/)
    ],
    "kind": "Fragment",
    "metadata": null,
    "name": "updateContractorsQuestionnaireTemplateMutation",
    "selections": (v6/*: any*/),
    "type": "mutation_root",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": [
      (v1/*: any*/),
      (v0/*: any*/)
    ],
    "kind": "Operation",
    "name": "updateContractorsQuestionnaireTemplateMutation",
    "selections": (v6/*: any*/)
  },
  "params": {
    "cacheID": "0f53de42355799fe39f45e0c7a0c07cb",
    "id": null,
    "metadata": {},
    "name": "updateContractorsQuestionnaireTemplateMutation",
    "operationKind": "mutation",
    "text": "mutation updateContractorsQuestionnaireTemplateMutation(\n  $id: default_contractor_questionnaire_templates_pk_columns_input!\n  $_set: default_contractor_questionnaire_templates_set_input!\n) {\n  update_default_contractor_questionnaire_templates_by_pk(pk_columns: $id, _set: $_set) {\n    id\n    created_at\n    name\n    category\n    desc\n    doc_version_list {\n      id\n      type\n      doc_num\n      doc\n      expiry\n    }\n    latest_version: doc_version_list(order_by: {expiry: desc_nulls_last}) {\n      id\n      type\n      doc_num\n      doc\n      expiry\n    }\n    contractor_site {\n      id\n      name\n    }\n    contractor {\n      id\n      name\n    }\n  }\n}\n"
  }
};
})();

node.hash = "86e91edaec0deba55d8189c91d0ccaa6";

module.exports = node;
