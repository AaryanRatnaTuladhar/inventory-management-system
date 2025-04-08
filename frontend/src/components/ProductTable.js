// import React, { useState } from 'react';
// import { FaEdit, FaTrash, FaCheck, FaTimes } from 'react-icons/fa';
// import '../styles/Table.css';
// const ProductTable = ({ products, onUpdate, onDelete }) => {
//   const [editingId, setEditingId] = useState(null);
//   const [editForm, setEditForm] = useState({});

//   const handleEdit = (product) => {
//     setEditingId(product._id);
//     setEditForm({ ...product });
//   };

//   const handleCancel = () => {
//     setEditingId(null);
//   };

//   const handleSave = (id) => {
//     onUpdate(id, editForm);
//     setEditingId(null);
//   };

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setEditForm(prev => ({ ...prev, [name]: value }));
//   };

//   return (
//     <div className="table-responsive">
//       <table className="table table-striped table-hover">
//         <thead className="thead-dark">
//           <tr>
//             <th>Name</th>
//             <th>Category</th>
//             <th>Price</th>
//             <th>Stock</th>
//             <th>Actions</th>
//           </tr>
//         </thead>
//         <tbody>
//           {products.map(product => (
//             <tr key={product._id}>
//               {editingId === product._id ? (
//                 <>
//                   <td>
//                     <input
//                       type="text"
//                       name="name"
//                       value={editForm.name}
//                       onChange={handleChange}
//                       className="form-control"
//                     />
//                   </td>
//                   <td>
//                     <input
//                       type="text"
//                       name="category"
//                       value={editForm.category}
//                       onChange={handleChange}
//                       className="form-control"
//                     />
//                   </td>
//                   <td>
//                     <input
//                       type="number"
//                       name="price"
//                       value={editForm.price}
//                       onChange={handleChange}
//                       className="form-control"
//                     />
//                   </td>
//                   <td>
//                     <input
//                       type="number"
//                       name="stock"
//                       value={editForm.stock}
//                       onChange={handleChange}
//                       className="form-control"
//                     />
//                   </td>
//                   <td>
//                     <button 
//                       onClick={() => handleSave(product._id)}
//                       className="btn btn-success btn-sm mr-2"
//                     >
//                       <FaCheck />
//                     </button>
//                     <button 
//                       onClick={handleCancel}
//                       className="btn btn-danger btn-sm"
//                     >
//                       <FaTimes />
//                     </button>
//                   </td>
//                 </>
//               ) : (
//                 <>
//                   <td>{product.name}</td>
//                   <td>{product.category}</td>
//                   <td>${product.price.toFixed(2)}</td>
//                   <td>{product.stock}</td>
//                   <td>
//                     <button 
//                       onClick={() => handleEdit(product)}
//                       className="btn btn-primary btn-sm mr-2"
//                     >
//                       <FaEdit />
//                     </button>
//                     <button 
//                       onClick={() => onDelete(product._id)}
//                       className="btn btn-danger btn-sm"
//                     >
//                       <FaTrash />
//                     </button>
//                   </td>
//                 </>
//               )}
//             </tr>
//           ))}
//         </tbody>
//       </table>
//     </div>
//   );
// };

// export default ProductTable;