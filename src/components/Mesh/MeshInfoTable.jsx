import React from "react";

const MeshInfoTable = ({
  firm,
  type,
  diameter,
  unitMeshWeight,
  quality,
  piece,
  containerSize
}) => {
  const diameterText = diameter[0] === diameter[1]
    ? `Tamamı ${diameter[0]} cm nervürlüdür.`
    : `Boy ${diameter[0]} cm nervürlüdür. En ${diameter[1]} cm nervürlüdür.`;

  return (
    <div
      style={{
        width: `${containerSize.width}px`,
        backgroundColor: "white",
        marginTop: "-20px",
      }}
    >
      <div className="overflow-x-auto w-full mt-4 p-4 text-xs">
        <table className="min-w-full border-collapse border border-gray-800 ">
          <tbody>
            <tr>
              <td className="border p-3 text-center w-36 h-36">
                <img src="/mongerylogo.png" alt="Logo" className="mx-auto" />
              </td>
              <td className="border p-3">
                <table className="w-full h-full border-collapse">
                  <tbody>
                    <tr className="border-b border-gray-800">
                      <td className="p-1 font-bold">FIRMA:</td>
                      <td className="p-1">{firm}</td>
                    </tr>
                    <tr className="border-b border-gray-800">
                      <td className="p-1 font-bold">HASIR TİPİ:</td>
                      <td className="p-1">{type}</td>
                    </tr>
                    <tr className="border-b border-gray-800">
                      <td className="p-1 font-bold">ÇAP:</td>
                      <td className="p-1">{diameterText}</td>
                    </tr>
                    <tr className="border-b border-gray-800">
                      <td className="p-1 font-bold">1 ADET AĞIRLIK:</td>
                      <td className="p-1">{unitMeshWeight.toFixed(2)}</td>
                    </tr>
                    <tr className="border-b border-gray-800">
                      <td className="p-1 font-bold">KALİTE:</td>
                      <td className="p-1">{quality}</td>
                    </tr>
                    <tr>
                      <td className="p-1 font-bold">ÜRETİM ADETİ:</td>
                      <td className="p-1">{piece}</td>
                    </tr>
                  </tbody>
                </table>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default MeshInfoTable;
