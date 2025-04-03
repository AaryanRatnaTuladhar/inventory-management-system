import React from "react";
import '../styles/Card.css';

const Card = ({ title, value, icon, color }) => {
  return (
    <div className="card">
      <div className="card-header">
        {icon && <span className="card-icon">{icon}</span>}
        <span className="card-value" style={{ color }}>{value}</span>
      </div>
      <p className="card-title">{title}</p>
    </div>
  );
};

export default Card;
