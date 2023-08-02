/**
 * @generated SignedSource<<bec557d6bab8d71f45ef5a77c03af70d>>
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
    "concreteType": "default_sites",
    "kind": "LinkedField",
    "name": "update_default_sites_by_pk",
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
    "name": "updateSiteMutation",
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
    "name": "updateSiteMutation",
    "selections": (v2/*: any*/)
  },
  "params": {
    "cacheID": "c13414cc3c8b74e926e2a0c693e0b188",
    "id": null,
    "metadata": {},
    "name": "updateSiteMutation",
    "operationKind": "mutation",
    "text": "mutation updateSiteMutation(\n  $id: default_sites_pk_columns_input!\n  $_set: default_sites_set_input!\n) {\n  update_default_sites_by_pk(pk_columns: $id, _set: $_set) {\n    id\n  }\n}\n"
  }
};
})();

node.hash = "4c8e0d102a50d4246c1c8b1e2766946b";

module.exports = node;
