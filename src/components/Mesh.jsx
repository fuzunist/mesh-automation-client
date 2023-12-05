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

  const offsetX = (containerSize.width - width) / 2;
  const offsetY = (containerSize.height - height) / 2;

  const downloadAsPng = () => {
    const element = divRef.current;
    if (!element) {
      console.error("Div element is not found!");
      return;
    }
    const scale = 2;
    html2canvas(element, {
      scale: scale,
      backgroundColor: null,
      logging: true,
      useCORS: true,
      width: element.offsetWidth,
      height: element.offsetHeight,
      scrollX: -window.scrollX,
      scrollY: -window.scrollY,
      windowWidth: document.documentElement.offsetWidth,
      windowHeight: document.documentElement.offsetHeight,
    })
      .then((canvas) => {
        const logoImg = new Image();
        logoImg.src = "mongerylogo.png";
        logoImg.onload = () => {
          const tempCanvas = document.createElement("canvas");
          const tempCtx = tempCanvas.getContext("2d");

          // Desired height of the logo, maintaining 1:3 ratio
          const logoHeight = 100; // You can adjust this value
          const logoWidth = logoHeight * 3; // Maintaining the 1:3 ratio

          tempCanvas.width = logoWidth;
          tempCanvas.height = logoHeight;

          // Draw the smaller logo on the temporary canvas
          tempCtx.drawImage(logoImg, 0, 0, logoWidth, logoHeight);

          // Create the pattern from the temporary canvas
          const ctx = canvas.getContext("2d");
          const pattern = ctx.createPattern(tempCanvas, "repeat");

          if (pattern) {
            ctx.setTransform(1, 0, 0, 1, 0, 0); // Reset any previous transformation
            pattern.setTransform(ctx.getTransform()); // Align pattern with canvas
          }

          
          ctx.globalAlpha = 0.05; // Set transparency for the watermark
          ctx.fillStyle = pattern;
          ctx.fillRect(0, 0, canvas.width, canvas.height); // Fill with the watermark pattern

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

  const margin = 10;
  const viewBox = `0 0 ${width} ${height}`;

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

  
  const svgRef = useRef();

  useEffect(() => {
    const extraPadding = 180; // Adjust this value as needed
    const maxWidth = Math.max(...widthSticks, width) + extraPadding;
    const maxHeight = Math.max(...heightSticks, height) + extraPadding;

    setContainerSize({
      width: maxWidth,
      height: maxHeight,
    });
  }, [widthSticks, heightSticks, width, height]);

  const reductionAmountWidth = width * 0.1;
  const reductionAmountHeight = height * 0.1;

  const lineMargin = 0;

  const renderInfoTable = () => (
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
                    <td className="p-1">{diameter[0]}</td>
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
  );

  return (
    <div className="flex flex-col items-center place-content-center ">
      <div ref={divRef} >
      <div
        
        className="flex flex-col items-center justify-center p-auto bg-white"
        style={{
          width: `${containerSize.width}px`,
          height: `${containerSize.height}px`,
        }}
      >
        <div
          className="flex-col svg-container overflow-hidden p-3 bg-light-gray "
          style={{
            width: `${containerSize.width}px`,
            height: `${containerSize.height}px`,
          }}
        >
          <svg
            ref={svgRef}
            width="100%"
            height="100%"
            viewBox={`0 0 ${containerSize.width} ${containerSize.height}`}
            preserveAspectRatio="xMidYMid meet"
          >
            <g transform={`translate(${offsetX + margin},${offsetY + margin})`}>
              {heightSticks.map((stick, index) => (
                <line
                  key={`h-${index}`}
                  x1={0}
                  y1={stick}
                  x2={width}
                  y2={stick}
                  stroke={stroke}
                  strokeWidth={1.5}
                />
              ))}
              {widthSticks.map((stick, index) => (
                <line
                  key={`w-${index}`}
                  x1={stick}
                  y1={0}
                  x2={stick}
                  y2={height}
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
                y1={height - lineMargin + 20}
                x2={width - lineMargin}
                y2={height - lineMargin + 20}
                stroke="black"
                strokeWidth={1.5}
              />

              <text
                x={(width - lineMargin) / 2} // Center the text
                y={height - lineMargin + 40} // Adjust the y position for spacing
                fill="black"
                textAnchor="middle"
                fontSize="11"
              >
                {width} cm
              </text>

              <text
                x={(width - lineMargin) / 2} // Center the text
                y={height - lineMargin + 70} // Adjust the y position for spacing
                fill="black"
                textAnchor="middle"
                fontSize="8"
              >
                ÇİZİM ÜZERİNDEKİ TÜM ÖLÇÜLER CM OLARAK VERİLMİŞTİR.
              </text>

              <line
                x1={width + lineMargin + 20}
                y1={lineMargin}
                x2={width + lineMargin + 20}
                y2={height - lineMargin}
                stroke="black"
                strokeWidth={1.5}
              />

              {/* Text beside the line */}
              <text
                x={width + lineMargin + 30} // Adjust the x position for spacing
                y={(height - 14 - lineMargin) / 2} // Center the text vertically
                fill="black"
                textAnchor="middle"
                fontSize="11"
                transform={`rotate(-90, ${width + lineMargin + 40}, ${
                  (height - 14 - lineMargin) / 2
                })`}
              >
                {height} cm
              </text>
            </g>
          </svg>
          
        </div>
        
      </div>
      <div
        style={{
          width: `${containerSize.width}px`,
          backgroundColor: "white",
          marginTop: "-20px",

        }}
      >
        {renderInfoTable()}
      </div>
      </div>
      <button
        onClick={downloadAsPng}
        style={{
          marginTop: "10px",
          padding: "12px 18px",
          border: "none",
          backgroundColor: "black",
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
        Download as PNG
      </button>
    </div>
  );
};

export default Mesh;
