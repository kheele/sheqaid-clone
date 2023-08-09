/**
 * @generated SignedSource<<439df943389b7567019e46b3531aa62c>>
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
    "concreteType": "proxy_employee__organogram__employees",
    "kind": "LinkedField",
    "name": "insert_proxy_employee__organogram__employees_one",
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
    "name": "insertProxyEmployeeOrganogramEmployeeMutation",
    "selections": (v1/*: any*/),
    "type": "mutation_root",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "insertProxyEmployeeOrganogramEmployeeMutation",
    "selections": (v1/*: any*/)
  },
  "params": {
    "cacheID": "f99576bef31851c05b8b1312e240a97c",
    "id": null,
    "metadata": {},
    "name": "insertProxyEmployeeOrganogramEmployeeMutation",
    "operationKind": "mutation",
    "text": "mutation insertProxyEmployeeOrganogramEmployeeMutation(\n  $object: proxy_employee__organogram__employees_insert_input!\n) {\n  insert_proxy_employee__organogram__employees_one(object: $object) {\n    id\n  }\n}\n"
  }
};
})();

node.hash = "45ab86a30eed046edf84beba20687cc4";

module.exports = node;
