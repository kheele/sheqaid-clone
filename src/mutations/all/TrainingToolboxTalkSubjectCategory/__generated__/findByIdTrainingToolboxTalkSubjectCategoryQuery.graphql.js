/**
 * @generated SignedSource<<3049c46b9a3f8814554c715ec1c37ff9>>
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
    "name": "id"
  }
],
v1 = [
  {
    "alias": null,
    "args": [
      {
        "fields": [
          {
            "fields": [
              {
                "kind": "Variable",
                "name": "_eq",
                "variableName": "id"
              }
            ],
            "kind": "ObjectValue",
            "name": "id"
          }
        ],
        "kind": "ObjectValue",
        "name": "where"
      }
    ],
    "concreteType": "sheq_training_toolbox_talk_subject_categoriesConnection",
    "kind": "LinkedField",
    "name": "sheq_training_toolbox_talk_subject_categories_connection",
    "plural": false,
    "selections": [
      {
        "alias": null,
        "args": null,
        "concreteType": "sheq_training_toolbox_talk_subject_categoriesEdge",
        "kind": "LinkedField",
        "name": "edges",
        "plural": true,
        "selections": [
          {
            "alias": null,
            "args": null,
            "concreteType": "sheq_training_toolbox_talk_subject_categories",
            "kind": "LinkedField",
            "name": "node",
            "plural": false,
            "selections": [
              {
                "alias": null,
                "args": null,
                "kind": "ScalarField",
                "name": "id",
                "storageKey": null
              },
              {
                "alias": null,
                "args": null,
                "kind": "ScalarField",
                "name": "created_at",
                "storageKey": null
              },
              {
                "alias": null,
                "args": null,
                "kind": "ScalarField",
                "name": "name",
                "storageKey": null
              }
            ],
            "storageKey": null
          }
        ],
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
    "name": "findByIdTrainingToolboxTalkSubjectCategoryQuery",
    "selections": (v1/*: any*/),
    "type": "query_root",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "findByIdTrainingToolboxTalkSubjectCategoryQuery",
    "selections": (v1/*: any*/)
  },
  "params": {
    "cacheID": "206ce7b326d5c9a0b81cf5bc06e9b72a",
    "id": null,
    "metadata": {},
    "name": "findByIdTrainingToolboxTalkSubjectCategoryQuery",
    "operationKind": "query",
    "text": "query findByIdTrainingToolboxTalkSubjectCategoryQuery(\n  $id: bigint\n) {\n  sheq_training_toolbox_talk_subject_categories_connection(where: {id: {_eq: $id}}) {\n    edges {\n      node {\n        id\n        created_at\n        name\n      }\n    }\n  }\n}\n"
  }
};
})();

node.hash = "6ba6aa888a5c00ef1187d7fdd2b5cf63";

module.exports = node;
