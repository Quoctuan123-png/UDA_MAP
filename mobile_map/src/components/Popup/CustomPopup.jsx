import React, { useRef, useEffect } from "react";
import ReactDOM from "react-dom/client";
import HousePopupDetail from "./HousePopupDetail"; // Component popup

const CustomPopup = ({ house }) => {
  const popupRef = useRef(null);

  useEffect(() => {
    if (popupRef.current) {
      const root = ReactDOM.createRoot(popupRef.current);
      root.render(<HousePopupDetail house={house} />);
    }
  }, [house]);

  return <div ref={popupRef} />;
};

export default CustomPopup;
