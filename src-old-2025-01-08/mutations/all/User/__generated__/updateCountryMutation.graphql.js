/**
 * @generated SignedSource<<0bf5c4e7d9174adc6e19bd788d28a989>>
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
    "concreteType": "default_countries",
    "kind": "LinkedField",
    "name": "update_default_countries_by_pk",
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
    "name": "updateCountryMutation",
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
    "name": "updateCountryMutation",
    "selections": (v2/*: any*/)
  },
  "params": {
    "cacheID": "5843a8ab6079c271a8d112255ffd6371",
    "id": null,
    "metadata": {},
    "name": "updateCountryMutation",
    "operationKind": "mutation",
    "text": "mutation updateCountryMutation(\n  $id: default_countries_pk_columns_input!\n  $_set: default_countries_set_input!\n) {\n  update_default_countries_by_pk(pk_columns: $id, _set: $_set) {\n    id\n  }\n}\n"
  }
};
})();

node.hash = "aa33759e534d7331b8eff6b07e6a4986";

module.exports = node;
