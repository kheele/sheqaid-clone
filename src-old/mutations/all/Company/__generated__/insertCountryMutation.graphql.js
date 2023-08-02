/**
 * @generated SignedSource<<25132b0d501242dce2cada52bfc33b18>>
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
    "concreteType": "default_countries",
    "kind": "LinkedField",
    "name": "insert_default_countries_one",
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
    "name": "insertCountryMutation",
    "selections": (v1/*: any*/),
    "type": "mutation_root",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "insertCountryMutation",
    "selections": (v1/*: any*/)
  },
  "params": {
    "cacheID": "8f09b742a3773a886bd328baecff2e13",
    "id": null,
    "metadata": {},
    "name": "insertCountryMutation",
    "operationKind": "mutation",
    "text": "mutation insertCountryMutation(\n  $object: default_countries_insert_input!\n) {\n  insert_default_countries_one(object: $object) {\n    id\n  }\n}\n"
  }
};
})();

node.hash = "619a859c94c440f263279974c2ab2f3c";

module.exports = node;
