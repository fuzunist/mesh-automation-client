import React, { useMemo, useRef, useState, useEffect } from "react";
import MeshInfoTable from "./MeshInfoTable";
import DownloadButton from "../Buttons/DownloadButton";
import DownloadButton2 from "../Buttons/DownloadButton2";
import MeshSVG from "./MeshSVG";
import { downloadAsPdf, downloadAsPng } from "@/utils/downloads";

const ManuelMesh = ({
  manuelCalculated,
  height,
  width,
  backFilament,
  leftFilament,
  frontFilament,
  rightFilament,
  apertureSize,
  diameter,
  firm,
  type,
  piece,
  quality,
}) => {
  const { numberOfSticks, unitMeshWeight } = manuelCalculated;
  const [containerSize, setContainerSize] = useState({ width: 0, height: 0 });
  const margin = 10;
  const stroke = "black";
  const divRef = useRef();
  const svgRef = useRef();
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
  }, [
    manuelCalculated,
    backFilament,
    leftFilament,
    frontFilament,
    rightFilament,
    apertureSize,
    numberOfSticks,
  ]);

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

  useEffect(() => {
    const extraPadding = 180; // Adjust this value as needed
    const maxWidth = Math.max(...widthSticks, width) + extraPadding;
    const maxHeight = Math.max(...heightSticks, height) + extraPadding;

    setContainerSize({
      width: maxWidth,
      height: maxHeight,
    });
  }, [widthSticks, heightSticks, width, height]);

  return (
    <div className="flex flex-col items-center place-content-center">
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
      <div className="flex flex-row justify-between items-center gap-x-4">
        <DownloadButton downloadAsPng={() => downloadAsPng(divRef)} />
        <DownloadButton2 downloadAsPdf={() => downloadAsPdf(divRef)} />
      </div>
    </div>
  );
};

export default ManuelMesh;
