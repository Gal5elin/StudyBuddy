import React, { useState } from "react";
import "./InfoCard.css";
import QRCode from "react-qr-code";

interface InfocardProps {
  type: "ok" | "error" | "warning";
  title: string;
  description: string;
  link?: string;
  choice?: boolean;
  onClose?: (choice: boolean) => void;
}

const InfoCard: React.FC<InfocardProps> = ({
  type,
  title,
  description,
  link,
  choice,
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

  const handleClose = (choice?: boolean) => {
    setIsVisible(false);
    if (onClose) {
      onClose(choice ?? false);
    }
  };

  if (!isVisible) return null;

  return (
    <div className="infocard-overlay">
      <div className={`infocard ${getCardClass()}`}>
        <div className="infocard-header">
          <h3>{title}</h3>
        </div>
        <p>{description}</p>
        {link && (
          <>
            <p>
              Link: <code>{link}</code>
            </p>
            <div className="m-2">
              <QRCode value={link} />
            </div>
          </>
        )}
        {choice ? (
          <div className="d-flex justify-content-between">
            <button
              className="btn btn-outline-primary w-50"
              onClick={() => handleClose(true)}
            >
              Yes
            </button>
            <button
              className="btn btn-outline-danger w-50"
              onClick={() => handleClose(false)}
            >
              No
            </button>
          </div>
        ) : (
          <button
            className="btn btn-outline-primary w-100"
            onClick={() => handleClose(true)}
          >
            Ok
          </button>
        )}
      </div>
    </div>
  );
};

export default InfoCard;
