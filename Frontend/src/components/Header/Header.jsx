import React from "react";
import "./Header.css";

const Header = () => {
  return (
    <div className="header">
      <div className="header-contents">
        <h2 className="">Order your favourite food here</h2>
        <p>
          Choose from a diverse menu featuring a delectable array of dishes
          crafted with the finest ingredients, expertly prepared to delight your
          senses.
        </p>
        <button>View Menu</button>
      </div>
    </div>
  );
};

export default Header;
