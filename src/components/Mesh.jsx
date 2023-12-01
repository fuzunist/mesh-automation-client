import React, { useMemo, useRef, useState, useEffect } from "react";
import { saveAs } from "file-saver";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

const Mesh = ({
  calculated,
  height,
  width,
  stroke = "red",
  backgroundColor = "white",
  firm,
  type,
  piece,
  quality,
}) => {
  const {
    backFilament,
    leftFilament,
    frontFilament,
    rightFilament,
    apertureSize,
    numberOfSticks,
    diameter,
    unitMeshWeight,
  } = calculated;

  const divRef = useRef(); // Reference to the div you want to capture
  const svgRef = useRef();

  const [containerSize, setContainerSize] = useState({ width: 0, height: 0 });

  useEffect(() => {
    if (svgRef.current) {
      const bbox = svgRef.current.getBBox();
      setContainerSize({
        width: bbox.width + 180, // Add padding to the width
        height: bbox.height + 120, // Add padding to the height
      });
    }
  }, [calculated, apertureSize, numberOfSticks]);

  const downloadAsPng = () => {
    const element = divRef.current;
    if (!element) {
      console.error("Div element is not found!");
      return;
    }

    html2canvas(element, {
      scale: 1,
      backgroundColor: null,
      logging: true,
      useCORS: true,
    })
      .then((canvas) => {

        const logoImg = new Image();
        logoImg.crossOrigin = "anonymous"; // Enable CORS if the image is from a different origin
        logoImg.src = "/mongerylogo.png";
        logoImg.onload = () => {
          const ctx = canvas.getContext("2d");
          ctx.globalAlpha = 1.0; // Ensure this is set to 1 before drawing the image
        
          // Draw the watermark last to ensure it's on top
          const pattern = ctx.createPattern(logoImg, "repeat");
          ctx.globalAlpha = 0.1; // Set transparency for the watermark
          ctx.fillStyle = pattern;
        
          // Adjust the position and size to cover the whole canvas
          // ctx.translate(0, 0); // Optionally adjust the starting position
          ctx.fillRect(20, 10, 150, 100);
        
          canvas.toBlob((blob) => {
            saveAs(blob, "mesh.png");
            console.log("Download triggered");
          });
        };
        
        logoImg.onerror = () => {
          console.error("Error loading watermark image");
        };
        

       
      })
      .catch((err) => {
        console.error("Error in capturing the div as PNG", err);
      });
  };

  const margin = 50;
  const viewBox = `10 20 ${width * 1.2} ${height * 1.2}`;

  const heightSticks = useMemo(() => {
    const sticks = [leftFilament];
    for (let i = 1; i < numberOfSticks[0]; i++) {
      sticks.push(leftFilament + apertureSize[0] * i);
    }
    return sticks;
  }, [calculated]);

  const widthSticks = useMemo(() => {
    const sticks = [backFilament];
    for (let i = 1; i < numberOfSticks[1]; i++) {
      sticks.push(backFilament + apertureSize[1] * i);
    }
    return sticks;
  }, [calculated]);

  const lineMargin = 0;

  const renderInfoTable = () => (
    <div className="overflow-x-auto w-full mt-4 p-4">
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
                    <td className="p-1">{diameter[0]}</td>
                  </tr>
                  <tr className="border-b border-gray-800">
                    <td className="p-1 font-bold">1 ADET AĞIRLIK:</td>
                    <td className="p-1">{unitMeshWeight}</td>
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
  );

  return (
    <div className="flex flex-col ">
      <div
        ref={divRef}
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: "auto",
          backgroundColor: "#ffffff",
          borderRadius: "15px",
          boxShadow: "0 5px 15px rgba(0,0,0,0.1)",
        }}
      >
        <div
          className="svg-container"
          style={{
            boxShadow: "0 3px 6px rgba(0,0,0,0.16)",
            borderRadius: "8px",
            overflow: "contain",
            padding: "12px",
            backgroundColor: "lightgray",
            paddingLeft: "36px",
            width: `${containerSize.width}px`,
            height: `${containerSize.height}px`,
          }}
        >
          <svg
            ref={svgRef}
            width="70vw"
            height="50vh"
            viewBox={viewBox}
            preserveAspectRatio="xMidYMid meet"
            style={{ width: "100%", height: "100%" }}
          >
            <g transform={`translate(${margin},${margin})`}>
              {heightSticks.map((stick, index) => (
                <line
                  key={`h-${index}`}
                  x1={lineMargin}
                  y1={stick}
                  x2={width - lineMargin}
                  y2={stick}
                  stroke={stroke}
                  strokeWidth={1.5}
                />
              ))}
              {widthSticks.map((stick, index) => (
                <line
                  key={`w-${index}`}
                  x1={stick}
                  y1={lineMargin}
                  x2={stick}
                  y2={height - lineMargin}
                  stroke={stroke}
                  strokeWidth={1.5}
                />
              ))}
              <g>
                {/* Position the numbers from heightSticks.map */}
                {heightSticks.map(
                  (stick, index) =>
                    index > 0 && (
                      <text
                        key={`h-num-${index}`}
                        x={-20} // Same x position for vertical alignment
                        y={(stick + heightSticks[index - 1]) / 2}
                        fill="black"
                        textAnchor="end"
                        fontSize="8"
                      >
                        {apertureSize[0]}
                      </text>
                    )
                )}

                {/* Position the rightFilament text at the top */}
                <text
                  x={-20} // Same x position for vertical alignment
                  y={heightSticks[0] - 10} // Use the first element's y position for the top
                  fill="black"
                  textAnchor="end"
                  fontSize="8"
                >
                  {rightFilament}
                </text>

                {/* Position the leftFilament text at the bottom */}
                <text
                  x={-20} // Same x position for vertical alignment
                  y={heightSticks[heightSticks.length - 1] + 10} // Use the last element's y position for the bottom
                  fill="black"
                  textAnchor="end"
                  fontSize="8"
                >
                  {leftFilament}
                </text>
              </g>

              <g>
                {/* Position the backFilament text at the left */}
                <text
                  x={widthSticks[0] - 15} // Use the first element's x position for the left
                  y={-15}
                  fill="black"
                  textAnchor="start"
                  fontSize="8"
                  alignmentBaseline="after-edge"
                >
                  {backFilament}
                </text>

                {/* Position the numbers from widthSticks.map */}
                {widthSticks.map(
                  (stick, index) =>
                    index > 0 && (
                      <text
                        key={`w-num-${index}`}
                        x={(stick + widthSticks[index - 1]) / 2}
                        y={-15} // Adjusted for better alignment
                        fill="black"
                        textAnchor="middle"
                        fontSize="8"
                        alignmentBaseline="after-edge"
                      >
                        {apertureSize[1]}
                      </text>
                    )
                )}

                {/* Position the frontFilament text at the right */}
                <text
                  x={widthSticks[widthSticks.length - 1] + 15} // Use the last element's x position for the right
                  y={-15}
                  fill="black"
                  textAnchor="end"
                  fontSize="8"
                  alignmentBaseline="after-edge"
                >
                  {frontFilament}
                </text>
              </g>

              <line
                x1={lineMargin}
                y1={height - lineMargin + 10}
                x2={width - lineMargin}
                y2={height - lineMargin + 10}
                stroke="black"
                strokeWidth={1.5}
              />

              <text
                x={(width - lineMargin) / 2} // Center the text
                y={height - lineMargin + 20} // Adjust the y position for spacing
                fill="black"
                textAnchor="middle"
                fontSize="8"
              >
                {width} {" "}cm
             
              </text>

              <text
                x={(width - lineMargin) / 2} // Center the text
                y={height - lineMargin + 40} // Adjust the y position for spacing
                fill="black"
                textAnchor="middle"
                fontSize="8"
              >
                ÇİZİM ÜZERİNDEKİ TÜM ÖLÇÜLER CM OLARAK VERİLMİŞTİR.
             
              </text>

              <line
        x1={lineMargin-30}
        y1={lineMargin}
        x2={lineMargin-30}
        y2={height - lineMargin}
        stroke="black"
        strokeWidth={1.5}
      />

      {/* Text beside the line */}
      <text
        x={lineMargin + 10} // Adjust the x position for spacing
        y={(height -75 - lineMargin) / 2} // Center the text vertically
        fill="black"
        textAnchor="middle"
        fontSize="8"
        transform={`rotate(-90, ${lineMargin + 5}, ${height / 2})`}

      >
           {height}{" "} cm
      </text>

    
            </g>
          </svg>
        </div>
        {renderInfoTable()}
      </div>
      <button
        onClick={downloadAsPng}
        style={{
          marginTop: "10px",
          padding: "12px 18px",
          border: "none",
          backgroundColor: "#0056b3",
          color: "white",
          borderRadius: "6px",
          cursor: "pointer",
          fontSize: "16px",
          fontWeight: "bold",
          boxShadow: "0 2px 4px rgba(0,0,0,0.2)",
          transition: "background-color 0.3s",
        }}
        onMouseOver={(e) => (e.target.style.backgroundColor = "#003875")}
        onMouseOut={(e) => (e.target.style.backgroundColor = "#0056b3")}
      >
        Download as PDF
      </button>
    </div>
  );
};

export default Mesh;
