import React, { useMemo, useRef, useState, useEffect } from "react";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

const ManuelMesh = ({
  manuelCalculated,
  height,
  width,
  backFilament,
  leftFilament,
  frontFilament,
  rightFilament,
  apertureSize,
 
  backgroundColor = "yellow",
}) => {
  const { numberOfSticks } = manuelCalculated;
  const stroke = "black";
  const divRef = useRef();

  const [containerSize, setContainerSize] = useState({ width: 0, height: 0 });

  useEffect(() => {
    if (svgRef.current) {
      const bbox = svgRef.current.getBBox();
      setContainerSize({
        width: bbox.width + 180, // Add padding to the width
        height: bbox.height + 120, // Add padding to the height
      });
    }
  }, [
    manuelCalculated,
    backFilament,
    leftFilament,
    frontFilament,
    rightFilament,
    apertureSize,
    numberOfSticks,
  ]);


  const offsetX = (containerSize.width - width) / 2;
  const offsetY = (containerSize.height - height) / 2;



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
        logoImg.src = "mongerylogo.png";
        logoImg.onload = () => {
          const ctx = canvas.getContext("2d");
          ctx.globalAlpha = 1.0; // Ensure this is set to 1 before drawing the image

          // Draw the watermark last to ensure it's on top
          const pattern = ctx.createPattern(logoImg, "repeat");
          ctx.globalAlpha = 0.1; // Set transparency for the watermark
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
  }, [manuelCalculated]);

  const widthSticks = useMemo(() => {
    const sticks = [backFilament];
    for (let i = 1; i < numberOfSticks[1]; i++) {
      sticks.push(backFilament + apertureSize[1] * i);
    }
    return sticks;
  }, [manuelCalculated]);

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

  const downloadPdf = async () => {
    console.log("Starting PDF download process...");

    const svgElement = svgRef.current;
    if (!svgElement) {
      console.error("SVG Element is not found!");
      return;
    }
    console.log("SVG Element found:", svgElement);

    // Make sure SVG has a namespace
    if (!svgElement.getAttribute("xmlns")) {
      svgElement.setAttribute("xmlns", "http://www.w3.org/2000/svg");
    }

    const svgData = new XMLSerializer().serializeToString(svgElement);
    console.log("Serialized SVG data:", svgData);

    // Create a jsPDF instance
    const pdf = new jsPDF({
      orientation: "l",
      unit: "px",
      format: [svgElement.clientWidth, svgElement.clientHeight],
    });

    try {
      // Add the SVG directly to the jsPDF instance
      await pdf.svg(svgElement, {
        x: 0,
        y: 0,
        width: svgElement.clientWidth,
        height: svgElement.clientHeight,
      });

      // Save the PDF
      pdf.save("mesh.pdf");
      console.log("PDF generated and saved.");
    } catch (error) {
      console.error("Error in adding SVG to PDF", error);
    }
  };

  const reductionAmountWidth = width * 0.1;
  const reductionAmountHeight = height * 0.1;

  const lineMargin = 0;

  return (
    <div className="flex flex-col ">
      <div
        ref={divRef}
        className="flex flex-col items-center justify-center p-auto bg-white rounded-lg shadow"
        style={{
          width: `${containerSize.width}px`,
          height: `${containerSize.height}px`,
        }}
      >
        <div
          className="svg-container shadow-md rounded overflow-hidden p-3 bg-light-gray"
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
                {heightSticks.map(
                  (stick, index) =>
                    index > 0 && (
                      <text
                        key={`h-num-${index}`}
                        x={-20}
                        y={(stick + heightSticks[index - 1]) / 2}
                        fill="black"
                        textAnchor="end"
                        fontSize="8"
                      >
                        {apertureSize[0]}
                      </text>
                    )
                )}
                <text
                  x={-20}
                  y={heightSticks[0] - 10}
                  fill="black"
                  textAnchor="end"
                  fontSize="8"
                >
                  {rightFilament}
                </text>
                <text
                  x={-20}
                  y={heightSticks[heightSticks.length - 1] + 10}
                  fill="black"
                  textAnchor="end"
                  fontSize="8"
                >
                  {leftFilament}
                </text>
              </g>
              <g>
                <text
                  x={widthSticks[0] - 15}
                  y={-15}
                  fill="black"
                  textAnchor="start"
                  fontSize="8"
                  alignmentBaseline="after-edge"
                >
                  {backFilament}
                </text>

                {widthSticks.map(
                  (stick, index) =>
                    index > 0 && (
                      <text
                        key={`w-num-${index}`}
                        x={(stick + widthSticks[index - 1]) / 2}
                        y={-15}
                        fill="black"
                        textAnchor="middle"
                        fontSize="8"
                        alignmentBaseline="after-edge"
                      >
                        {apertureSize[1]}
                      </text>
                    )
                )}

                <text
                  x={widthSticks[widthSticks.length - 1] + 15}
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
                {width} cm
              </text>

              <text
                x={(width - lineMargin) / 2} // Center the text
                y={height - lineMargin + 14} // Adjust the y position for spacing
                fill="black"
                textAnchor="middle"
                fontSize="8"
              >
                ÇİZİM ÜZERİNDEKİ TÜM ÖLÇÜLER CM OLARAK VERİLMİŞTİR.
              </text>

              <line
                x1={lineMargin - 10}
                y1={lineMargin}
                x2={lineMargin - 10}
                y2={height - lineMargin}
                stroke="black"
                strokeWidth={1.5}
              />

              {/* Text beside the line */}
              <text
                x={lineMargin + 10} // Adjust the x position for spacing
                y={(height - 14 - lineMargin) / 2} // Center the text vertically
                fill="black"
                textAnchor="middle"
                fontSize="8"
                transform={`rotate(-90, ${lineMargin + 5}, ${height / 2})`}
              >
                {height} cm
              </text>
            </g>
          </svg>
        </div>
      </div>
      <button
        onClick={downloadAsPng}
        style={{
          marginTop: "20px",
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
        Download as PDF
      </button>
    </div>
  );
};

export default ManuelMesh;
