import React, { useMemo, useRef, useState, useEffect } from "react";
import InfoTable from "./InfoTable";
import DownloadButton from "./DownloadButton";
import { html2Canvas } from "@/utils/html2Canvas";
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

  const downloadAsPng = async () => {
    const element = divRef.current;
    if (!element) {
      console.error("Div element is not found!");
      return;
    }
    await html2Canvas(element);
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
      {<DownloadButton downloadAsPng={downloadAsPng} />}
    </div>
  );
};

export default Mesh;
