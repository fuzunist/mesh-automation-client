import React from "react";

const MeshSVG = ({
  svgRef,
  containerSize,
  offsetX,
  offsetY,
  margin,
  heightSticks,
  widthSticks,
  apertureSize,
  stroke,
  rightFilament,
  leftFilament,
  backFilament,
  frontFilament,

  width,
  height,
}) => {
  const lineMargin = 0;
  return (
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
      <g transform={`translate(${offsetX + margin},${offsetY + margin-30})`}>
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
                  {apertureSize[0].toFixed('0')}
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
            {leftFilament}
          </text>

          {/* Position the leftFilament text at the bottom */}
          <text
            x={-20} // Same x position for vertical alignment
            y={heightSticks[heightSticks.length - 1] + 10} // Use the last element's y position for the bottom
            fill="black"
            textAnchor="end"
            fontSize="8"
          >
            {rightFilament}
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
                  {apertureSize[1].toFixed('0')}
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
  );
};

export default MeshSVG;
