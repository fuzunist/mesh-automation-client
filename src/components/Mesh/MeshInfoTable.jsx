import React from "react";

const MeshInfoTable = ({
  firm,
  type,
  diameter,
  unitMeshWeight,
  quality,
  piece,
  containerSize,
}) => {
  const diameterText =
    diameter[0] === diameter[1]
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
        <table className="min-w-full  ">
          <tbody>
            <tr>
              <td className="border p-3">
                <table className="w-full h-full border-collapse">
                  <tbody>
                    <tr>
                      <td className="w-3/5">
                        <table className="w-full h-full border-collapse">
                          <tbody>
                            <tr >
                              <td className="p-1 font-bold">FIRMA:</td>
                              <td className="p-1">{firm}</td>
                            </tr>
                            <tr >
                              <td className="p-1 font-bold">HASIR TİPİ:</td>
                              <td className="p-1">{type}</td>
                            </tr>
                            <tr >
                              <td className="p-1 font-bold">ÇAP:</td>
                              <td className="p-1">{diameterText}</td>
                            </tr>
                          </tbody>
                        </table>
                      </td>
                      <td className="w-1/2">
                        <table className="w-full h-full border-collapse">
                          <tbody>
                            <tr >
                              <td className="p-1 font-bold">1 ADET AĞIRLIK:</td>
                              <td className="p-1">
                                {unitMeshWeight.toFixed(2)}
                              </td>
                            </tr>
                            <tr >
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
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default MeshInfoTable;
