/* eslint-disable camelcase */

// const query = graphql`
//   query findByIdChemicalProductQuery($id: bigint) {
//     sheq_chemical_products_connection(where: {id: {_eq: $id}}) {
//       edges {
//         node {
//             manufacturer
//             manufacturer_addr
//             manufacturer_phone_num
//             manufacturer_email
//             manufacturer_fax
//             manufacturer_website
//         }
//       }
//     }
//   }
// `;

export default async (input: number) => {
  const findById = sockets.of("chemicals/products").fn("findById");
  return findById(input);
};
