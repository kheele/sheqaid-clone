/**
 * @generated SignedSource<<f779c07965757bc63c29dd0394ebbaf2>>
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
    "concreteType": "proxy_sector__company",
    "kind": "LinkedField",
    "name": "update_proxy_sector__company_by_pk",
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
    "name": "updateProxySectorCompanyMutation",
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
    "name": "updateProxySectorCompanyMutation",
    "selections": (v2/*: any*/)
  },
  "params": {
    "cacheID": "e82e54af4ccb2d9188e8457938dc73bc",
    "id": null,
    "metadata": {},
    "name": "updateProxySectorCompanyMutation",
    "operationKind": "mutation",
    "text": "mutation updateProxySectorCompanyMutation(\n  $id: proxy_sector__company_pk_columns_input!\n  $_set: proxy_sector__company_set_input!\n) {\n  update_proxy_sector__company_by_pk(pk_columns: $id, _set: $_set) {\n    id\n  }\n}\n"
  }
};
})();

node.hash = "155b95ea526451593455d03617726d1c";

module.exports = node;
