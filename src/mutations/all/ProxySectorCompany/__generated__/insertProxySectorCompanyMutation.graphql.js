/**
 * @generated SignedSource<<06118d984ee2e4b9e46b662b7f0f281e>>
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
v1 = [
  {
    "alias": null,
    "args": [
      {
        "kind": "Variable",
        "name": "object",
        "variableName": "object"
      }
    ],
    "concreteType": "proxy_sector__company",
    "kind": "LinkedField",
    "name": "insert_proxy_sector__company_one",
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
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Fragment",
    "metadata": null,
    "name": "insertProxySectorCompanyMutation",
    "selections": (v1/*: any*/),
    "type": "mutation_root",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "insertProxySectorCompanyMutation",
    "selections": (v1/*: any*/)
  },
  "params": {
    "cacheID": "0a8e716fb513b76f954325550c551f52",
    "id": null,
    "metadata": {},
    "name": "insertProxySectorCompanyMutation",
    "operationKind": "mutation",
    "text": "mutation insertProxySectorCompanyMutation(\n  $object: proxy_sector__company_insert_input!\n) {\n  insert_proxy_sector__company_one(object: $object) {\n    id\n  }\n}\n"
  }
};
})();

node.hash = "43a2fbaf25ccee6d300afd43cd2c4dfc";

module.exports = node;
