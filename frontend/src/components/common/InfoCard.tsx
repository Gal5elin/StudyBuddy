import React, { useState } from "react";
import "./InfoCard.css";

interface InfocardProps {
  type: "ok" | "error" | "warning";
  title: string;
  description: string;
  onClose?: () => void;
}

const InfoCard: React.FC<InfocardProps> = ({
  type,
  title,
  description,
  onClose,
}) => {
  const [isVisible, setIsVisible] = useState(true);

  const getCardClass = () => {
    switch (type) {
      case "ok":
        return "infocard-ok";
      case "error":
        return "infocard-error";
      case "warning":
        return "infocard-warning";
      default:
        return "";
    }
  };

  const handleClose = () => {
    setIsVisible(false);
    if (onClose) onClose();
  };

  if (!isVisible) return null;

  return (
    <div className="infocard-overlay">
      <div className={`infocard ${getCardClass()}`}>
        <div className="infocard-header">
          <h3>{title}</h3>
        </div>
        <p>{description}</p>
        <button className="btn btn-primary w-50" onClick={handleClose}>Ok</button>
      </div>
    </div>
  );
};

export default InfoCard;
