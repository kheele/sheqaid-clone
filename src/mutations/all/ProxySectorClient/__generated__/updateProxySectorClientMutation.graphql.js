/**
 * @generated SignedSource<<ff5fb643824016df1711472e9553c679>>
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
    "concreteType": "proxy_sector__client",
    "kind": "LinkedField",
    "name": "update_proxy_sector__client_by_pk",
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
    "name": "updateProxySectorClientMutation",
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
    "name": "updateProxySectorClientMutation",
    "selections": (v2/*: any*/)
  },
  "params": {
    "cacheID": "bd7e06416272a8c0fd29f422842a9da9",
    "id": null,
    "metadata": {},
    "name": "updateProxySectorClientMutation",
    "operationKind": "mutation",
    "text": "mutation updateProxySectorClientMutation(\n  $id: proxy_sector__client_pk_columns_input!\n  $_set: proxy_sector__client_set_input!\n) {\n  update_proxy_sector__client_by_pk(pk_columns: $id, _set: $_set) {\n    id\n  }\n}\n"
  }
};
})();

node.hash = "298f154ce6f3a6a9ca0abfaac1cae6f0";

module.exports = node;
