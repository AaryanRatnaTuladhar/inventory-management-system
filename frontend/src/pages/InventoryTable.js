import React, { useEffect, useState } from 'react';

const InventoryTable = () => {
    const [inventory, setInventory] = useState([]);

    useEffect(() => {
        fetch('http://localhost:5000/api/inventory')
            .then(response => response.json())
            .then(data => setInventory(data));
    }, []);

    return (
        <table>
            <thead>
                <tr>
                    <th>Product Name</th>
                    <th>Quantity</th>
                    <th>Reorder Level</th>
                </tr>
            </thead>
            <tbody>
                {inventory.map(item => (
                    <tr key={item.product_id}>
                        <td>{item.name}</td>
                        <td>{item.quantity}</td>
                        <td>{item.reorder_level}</td>
                    </tr>
                ))}
            </tbody>
        </table>
    );
};

export default InventoryTable;
