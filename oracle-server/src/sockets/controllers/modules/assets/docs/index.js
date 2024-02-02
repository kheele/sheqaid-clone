const findByIdImpl = require('../../findByIdImpl');
const listImpl = require('./listImpl');
const {asset_basic_details_fragment} = require("../commons");
const {orgs_fragment} = require("../../../../../graphql/Fragments");

const details_fragment = `
  id
  created_at
  date
  expiry
  removed
  title
  desc
  type
  doc
  
  asset_id
  asset{
    ${asset_basic_details_fragment}
    doc_list(where: {removed: {_eq: false}}){
      id
      expiry
    }
    ${orgs_fragment}
  }
`;

eventManager.on("assets/docs/findById", findByIdImpl({
	name: "AssetDoc", tbl: "asset_docs", details_fragment,
}));

eventManager.on("assets/docs/listByLogged", listImpl);
