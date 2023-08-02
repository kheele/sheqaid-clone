/**
 * @generated SignedSource<<3d0e6d2e5a09502b47a896b99aba5d69>>
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
v2 = [
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
    "concreteType": "default_company_categories",
    "kind": "LinkedField",
    "name": "update_default_company_categories_by_pk",
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
];
return {
  "fragment": {
    "argumentDefinitions": [
      (v0/*: any*/),
      (v1/*: any*/)
    ],
    "kind": "Fragment",
    "metadata": null,
    "name": "updateCompanyCategoryMutation",
    "selections": (v2/*: any*/),
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
    "name": "updateCompanyCategoryMutation",
    "selections": (v2/*: any*/)
  },
  "params": {
    "cacheID": "30260099024ff662e8558370e8f12d60",
    "id": null,
    "metadata": {},
    "name": "updateCompanyCategoryMutation",
    "operationKind": "mutation",
    "text": "mutation updateCompanyCategoryMutation(\n  $id: default_company_categories_pk_columns_input!\n  $_set: default_company_categories_set_input!\n) {\n  update_default_company_categories_by_pk(pk_columns: $id, _set: $_set) {\n    id\n  }\n}\n"
  }
};
})();

node.hash = "683f27f783ae69920f45eb962152ef7c";

module.exports = node;
