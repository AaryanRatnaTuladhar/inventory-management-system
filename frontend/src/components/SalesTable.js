import '../styles/Table.css';
const SalesTable = ({ sales, onDelete }) => {
  return (
    <div className="table-responsive">
      <table className="table table-striped table-hover">
        <thead className="thead-dark">
          <tr>
            <th>Sale ID</th>
            <th>Product</th>
            <th>Quantity</th>
            <th>Price</th>
            <th>Date</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {sales.map(sale => (
            <tr key={sale._id}>
              <td>#{sale.saleNumber}</td>
              <td>{sale.product.name}</td>
              <td>{sale.quantity}</td>
              <td>${sale.totalPrice.toFixed(2)}</td>
              <td>{new Date(sale.date).toLocaleDateString()}</td>
              <td>
                <button 
                  onClick={() => onDelete(sale._id)}
                  className="btn btn-danger btn-sm"
                >
                  <FaTrash />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};