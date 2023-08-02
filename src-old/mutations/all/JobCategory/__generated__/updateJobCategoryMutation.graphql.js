/**
 * @generated SignedSource<<2b2dbb59587ecb13f78ce3072e132fd8>>
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
    "concreteType": "default_job_categories",
    "kind": "LinkedField",
    "name": "update_default_job_categories_by_pk",
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
    "name": "updateJobCategoryMutation",
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
    "name": "updateJobCategoryMutation",
    "selections": (v2/*: any*/)
  },
  "params": {
    "cacheID": "2e2a60a56241a1459366cebb2f46cd79",
    "id": null,
    "metadata": {},
    "name": "updateJobCategoryMutation",
    "operationKind": "mutation",
    "text": "mutation updateJobCategoryMutation(\n  $id: default_job_categories_pk_columns_input!\n  $_set: default_job_categories_set_input!\n) {\n  update_default_job_categories_by_pk(pk_columns: $id, _set: $_set) {\n    id\n  }\n}\n"
  }
};
})();

node.hash = "cbfdf389f6e9dc261e832d718e2e109d";

module.exports = node;
