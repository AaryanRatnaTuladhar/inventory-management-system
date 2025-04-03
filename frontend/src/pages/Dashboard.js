import React from "react";
import "../styles/Dashboard.css"; // Optional: Add styles for the dashboard
import Card from "../components/Card";
import { FaUser, FaShoppingCart, FaDollarSign } from "react-icons/fa";

const Dashboard = () => {
    return (
        <div className="dashboard">
            <Card title="Today's Sales" value="30,000" icon={<FaUser />} color="purple" />
            <Card title="Today's Total Orders" value="270" icon={<FaShoppingCart />} color="blue" />
            <Card title="Today's Revenue" value="1,000" icon={<FaDollarSign />} color="red" />
            <Card title="Today's Customers" value="100" icon={<FaUser />} color="orange" />
        </div>
    );
};

export default Dashboard;
