import React, { useMemo, useRef, useState, useEffect } from "react";
import MeshInfoTable from "./MeshInfoTable";
import MeshSVG from "./MeshSVG";
import MeshLogo from "./MeshLogo";

const ManuelMesh = ({
  manuelCalculated,
  height,
  width,
  backFilament,
  leftFilament,
  frontFilament,
  rightFilament,
  numberOfSticks,
  diameter,
  firm,
  type,
  piece,
  quality,
}) => {
  const { apertureSize, unitMeshWeight } = manuelCalculated;
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
      <MeshLogo containerSize={containerSize} />
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
        type="manuel"
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

export default ManuelMesh;
