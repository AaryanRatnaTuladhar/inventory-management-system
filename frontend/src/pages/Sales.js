import React, { useState, useEffect } from 'react';
import SalesTable from '../components/SalesTable';

const SalesPage = () => {
  const [sales, setSales] = useState([]);
  
  // Add your data fetching and CRUD functions here

  return (
    <div className="container mt-4">
      <h2>Sales Records</h2>
      <SalesTable 
        sales={sales} 
        onDelete={handleDelete} 
      />
    </div>
  );
};

export default SalesPage;