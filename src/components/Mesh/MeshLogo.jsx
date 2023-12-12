import React from "react";

const MeshLogo = ({ containerSize }) => {
  return (
    <div
      style={{ width: `${containerSize.width}px` }}
      className="bg-white flex justify-center items-center" // Center content horizontally and vertically
    >
      <div className=" flex justify-center items-center text-xs mt-4 mb-4"> {/* Added margin top and bottom */}
        <img
          src="/mongerylogo.png"
          alt="Logo"
          className=""
          style={{ maxWidth: "25%", height: "auto" }} // Maintain aspect ratio and reduce size
        />
      </div>
    </div>
  );
};

export default MeshLogo;
