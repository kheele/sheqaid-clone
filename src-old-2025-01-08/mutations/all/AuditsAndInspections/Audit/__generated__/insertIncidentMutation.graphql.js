/**
 * @generated SignedSource<<a700c8974af359f94b8b4c955d63ec95>>
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
    "concreteType": "sheq_compliance_audits",
    "kind": "LinkedField",
    "name": "insert_sheq_compliance_audits_one",
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
    "name": "insertAuditMutation",
    "selections": (v5/*: any*/),
    "type": "mutation_root",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "insertAuditMutation",
    "selections": (v5/*: any*/)
  },
  "params": {
    "cacheID": "d619dd1f12f74b0910d77acb6d95520f",
    "id": null,
    "metadata": {},
    "name": "insertAuditMutation",
    "operationKind": "mutation",
    "text": "mutation insertAuditMutation(\n  $object: sheq_compliance_audits_insert_input!\n) {\n  insert_sheq_compliance_audits_one(object: $object) {\n    id\n    created_at\n    name\n    category\n    desc\n    doc_version_list {\n      id\n      type\n      doc_num\n      doc\n      expiry\n    }\n    latest_version: doc_version_list(order_by: {expiry: desc_nulls_last}) {\n      id\n      type\n      doc_num\n      doc\n      expiry\n    }\n    contractor_site {\n      id\n      name\n    }\n    contractor {\n      id\n      name\n    }\n  }\n}\n"
  }
};
})();

node.hash = "9cf37017f3532158f48c2900927be76e";

module.exports = node;
