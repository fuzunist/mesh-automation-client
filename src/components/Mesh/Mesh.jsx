import React, { useMemo, useRef, useState, useEffect } from "react";
import MeshInfoTable from "./MeshInfoTable";
import DownloadButton from "../Buttons/DownloadButton";
import DownloadButton2 from "../Buttons/DownloadButton2";
import { downloadAsPdf, downloadAsPng } from "@/utils/downloads";
import MeshSVG from "./MeshSVG";

const Mesh = ({
  calculated,
  height,
  width,
  stroke = "red",
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
    const extraPadding = 180;
    const maxWidth = Math.max(...widthSticks, width) + extraPadding;
    const maxHeight = Math.max(...heightSticks, height) + extraPadding;

    setContainerSize({
      width: maxWidth,
      height: maxHeight,
    });
  }, [widthSticks, heightSticks, width, height]);

  return (
    <div className="flex flex-col items-center place-content-center ">
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
        <MeshInfoTable
          type={type}
          firm={firm}
          diameter={diameter}
          unitMeshWeight={unitMeshWeight}
          quality={quality}
          piece={piece}
          containerSize={containerSize}
        />

      
    </div>
  );
};

export default Mesh;
