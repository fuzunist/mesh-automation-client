import React, { useMemo, useRef, useState, useEffect } from "react";
import InfoTable from "./InfoTable";
import DownloadButton from "./DownloadButton";
import DownloadButton2 from "./DownloadButton2";
import { html2Canvas } from "@/utils/html2Canvas";
import { jsPDF } from "jspdf";

import MeshSVG from "./MeshSVG";

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
  const [containerSize, setContainerSize] = useState({ width: 0, height: 0 });
  const divRef = useRef(); // Reference to the div you want to capture
  const svgRef = useRef();
  const margin = 10;
  const offsetX = (containerSize.width - width) / 2;
  const offsetY = (containerSize.height - height) / 2;

  useEffect(() => {
    if (svgRef.current) {
      const bbox = svgRef.current.getBBox();
      setContainerSize({
        width: bbox.width + 180, // Add padding to the width
        height: bbox.height + 120, // Add padding to the height
      });
    }
  }, [calculated, apertureSize, numberOfSticks]);

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

  useEffect(() => {
    const extraPadding = 180; // Adjust this value as needed
    const maxWidth = Math.max(...widthSticks, width) + extraPadding;
    const maxHeight = Math.max(...heightSticks, height) + extraPadding;

    setContainerSize({
      width: maxWidth,
      height: maxHeight,
    });
  }, [widthSticks, heightSticks, width, height]);

  const generatePngDataUrl = async () => {
    const element = divRef.current;
    if (!element) {
      console.error("Div element is not found!");
      return null;
    }
    try {
      const canvas = await html2Canvas(element);
      return canvas.toDataURL("image/png");
    } catch (error) {
      console.error("Error generating PNG data URL:", error);
    }
  };
  const downloadAsPng = async () => {
    const pngDataUrl = await generatePngDataUrl();
    if (pngDataUrl) {
      const downloadLink = document.createElement("a");
      downloadLink.href = pngDataUrl;
      downloadLink.download = "mesh.png";
      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);
    }
  };

  const downloadAsPdf = async () => {
    const pngDataUrl = await generatePngDataUrl();
    if (pngDataUrl) {
      // Define the page size and margins
      const pageWidth = 842; // A4 landscape width in pixels
      const pageHeight = 595; // A4 landscape height in pixels
      const margin = 20; // Margin around the image

      // Create a new PDF in landscape orientation
      const pdf = new jsPDF({
        orientation: "landscape",
        unit: "px",
        format: [pageWidth, pageHeight],
      });

      // Load the image
      const img = new Image();
      img.src = pngDataUrl;
      img.onload = () => {
        // Calculate the aspect ratio
        const aspectRatio = img.width / img.height;

        // Calculate the dimensions to fit the image within the PDF page
        let pdfImageWidth = pageWidth - 2 * margin;
        let pdfImageHeight = pdfImageWidth / aspectRatio;

        // Check if the calculated height exceeds the page height
        if (pdfImageHeight > pageHeight - 2 * margin) {
          pdfImageHeight = pageHeight - 2 * margin;
          pdfImageWidth = pdfImageHeight * aspectRatio;
        }

        // Calculate position to center the image
        const xPosition = (pageWidth - pdfImageWidth) / 2;
        const yPosition = (pageHeight - pdfImageHeight) / 2;

        // Add the image to the PDF
        pdf.addImage(
          pngDataUrl,
          "PNG",
          xPosition,
          yPosition,
          pdfImageWidth,
          pdfImageHeight
        );
        pdf.save("mesh.pdf");
      };
    }
  };

  return (
    <div className="flex flex-col items-center place-content-center ">
      <div ref={divRef}>
        <MeshSVG
          svgRef={svgRef}
          containerSize={containerSize}
          offsetX={offsetX}
          offsetY={offsetY}
          margin={margin}
          heightSticks={heightSticks}
          widthSticks={widthSticks}
          apertureSize={apertureSize}
          stroke={stroke}
          rightFilament={rightFilament}
          leftFilament={leftFilament}
          backFilament={backFilament}
          frontFilament={frontFilament}
          width={width}
          height={height}
        />

        <div
          style={{
            width: `${containerSize.width}px`,
            backgroundColor: "white",
            marginTop: "-20px",
          }}
        >
          {
            <InfoTable
              type={type}
              firm={firm}
              diameter={diameter}
              unitMeshWeight={unitMeshWeight}
              quality={quality}
              piece={piece}
            />
          }
        </div>
      </div>
      <div className="flex flex-row justify-between items-center gap-x-4">
        {<DownloadButton downloadAsPng={downloadAsPng} />}
        {<DownloadButton2 downloadAsPdf={downloadAsPdf} />}
      </div>
    </div>
  );
};

export default Mesh;
