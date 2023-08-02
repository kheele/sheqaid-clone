/**
 * @generated SignedSource<<abf1c789ad30ee518b5fea6b2593068d>>
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
    "concreteType": "default_companies",
    "kind": "LinkedField",
    "name": "update_default_companies_by_pk",
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
    "name": "updateProjectMutation",
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
    "name": "updateProjectMutation",
    "selections": (v2/*: any*/)
  },
  "params": {
    "cacheID": "6b93e5c53bc5f0b19e86be2dbd0e8014",
    "id": null,
    "metadata": {},
    "name": "updateProjectMutation",
    "operationKind": "mutation",
    "text": "mutation updateProjectMutation(\n  $id: default_companies_pk_columns_input!\n  $_set: default_companies_set_input!\n) {\n  update_default_companies_by_pk(pk_columns: $id, _set: $_set) {\n    id\n  }\n}\n"
  }
};
})();

node.hash = "ee776cb3418766d4ef6172d29be255e2";

module.exports = node;
