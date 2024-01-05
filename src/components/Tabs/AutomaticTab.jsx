import AutoMesh from "../Mesh/AutoMesh";
import AutoCalculationTable from "../Mesh/AutoCalculationTable";
import DownloadButton from "../Buttons/DownloadButton";
import { downloadAsPdf, downloadAsPng } from "@/utils/downloads";
import { initialValues, meshTypeOptions } from "../../contants/meshValues";
import meshFeatures from "../../contants/meshFeatures";
import {
  variable_1,
  variable_2,
  variable_3,
  variable_4,
} from "../../contants/meshVariables";

import { useRef, useState, useEffect } from "react";
import AutoMeshForm from "../Mesh/AutoMeshForm";

const AutomaticTab = ({}) => {
  const [calculated, setCalculated] = useState(initialValues.calculated);
  const [mesh, setMesh] = useState(initialValues.mesh);
  const [showMessage, setShowMessage] = useState(false);
  const [filamentError, setFilamentError] = useState("");
  const [error, setError] = useState("");
  const [tabIndex, setTabIndex] = useState(0);
  const [kesmeCalculations, setKesmeCalculations] = useState([]);

  const divRef = useRef();

  let isMeshValid = true;
  useEffect(() => {
    setCalculated(initialValues.calculated);

    isMeshValid =
      mesh.type &&
      mesh.code &&
      mesh.name &&
      mesh.height &&
      mesh.width &&
      mesh.piece;

    if (!isMeshValid) {
      setError("Tüm alanların doldurulması zorunludur.");
      return;
    }
    setError("");

    // Make sure the selected mesh code and name exist in the features object
    if (meshFeatures[mesh.code] && meshFeatures[mesh.code][mesh.name]) {
      const selectedMeshFeature = meshFeatures[mesh.code][mesh.name];
      if (selectedMeshFeature.diameter) {
        const result = { ...initialValues.calculated };

        console.log("AutamaticTab deki result değeri şu", result);

        result.diameter[0] = meshFeatures[mesh.code][mesh.name].diameter.height;
        result.diameter[1] = meshFeatures[mesh.code][mesh.name].diameter.width;

        result.apertureSize[0] =
          meshFeatures[mesh.code][mesh.name].apertureSize.height / 10;
        result.apertureSize[1] =
          meshFeatures[mesh.code][mesh.name].apertureSize.width / 10;

        if (mesh.type === "Çit Hasırı") {
          result.apertureSize[0] = 15;
          result.apertureSize[1] = 5;
        }

        if (variable_1(mesh)) {
          result.numberOfSticks[0] = 0;
          result.numberOfSticks[1] = 0;
          result.backFilament = 10;
          result.leftFilament = 2.5;
          result.rightFilament = 2.5;
        } else {
          if (mesh.height === 500 && mesh.width === 215) {
            if (mesh.height % result.apertureSize[1] === 0)
              result.numberOfSticks[1] =
                mesh.height / result.apertureSize[1] + mesh.numberOfWidthBars;
            if (mesh.height % result.apertureSize[1] !== 0)
              result.numberOfSticks[1] =
                Math.floor(mesh.height / result.apertureSize[1] - 1) +
                mesh.numberOfWidthBars;
            if (mesh.width % result.apertureSize[0] === 0)
              result.numberOfSticks[0] =
                mesh.width / result.apertureSize[0] +
                1 +
                mesh.numberOfHeightBars;
            if (mesh.width % result.apertureSize[0] !== 0)
              result.numberOfSticks[0] =
                Math.floor(mesh.width / result.apertureSize[0] + 1) +
                mesh.numberOfHeightBars;
          } else {
            result.numberOfSticks[0] =
              Math.ceil(mesh.width / result.apertureSize[0]) +
              mesh.numberOfHeightBars;
            result.numberOfSticks[1] =
              Math.ceil(mesh.height / result.apertureSize[1]) +
              mesh.numberOfWidthBars;
          }

          result.backFilament =
            (mesh.height -
              (result.numberOfSticks[1] - 1) * result.apertureSize[1]) /
            2;
          result.leftFilament =
            (mesh.width -
              (result.numberOfSticks[0] - 1) * result.apertureSize[0]) /
            2;
          result.rightFilament =
            (mesh.width -
              (result.numberOfSticks[0] - 1) * result.apertureSize[0]) /
            2;
        }

        if (variable_2(mesh)) result.frontFilament = 70;
        else if (variable_3(mesh)) result.frontFilament = 71;
        else if (variable_4(mesh)) result.frontFilament = 65;
        else
          result.frontFilament =
            (mesh.height -
              (result.numberOfSticks[1] - 1) * result.apertureSize[1]) /
            2;

        if (variable_1(mesh)) {
          result.numberOfSticks[0] = Math.floor(
            (mesh.width - result.leftFilament - result.rightFilament) /
              result.apertureSize[0] +
              1
          );
          result.numberOfSticks[1] = Math.floor(
            (mesh.height - result.backFilament - result.frontFilament) /
              result.apertureSize[1] +
              1
          );
        }

        result.unitOfHeigthWeight =
          (((Math.PI * result.diameter[0] * result.diameter[0]) / 4) *
            0.007847 *
            mesh.height) /
          100;
        result.unitOfWidthWeight =
          (((Math.PI * result.diameter[1] * result.diameter[1]) / 4) *
            0.007847 *
            mesh.width) /
          100;
        result.totalHeigthWeight =
          result.unitOfHeigthWeight * result.numberOfSticks[0];
        result.totalWidthWeight =
          result.unitOfWidthWeight * result.numberOfSticks[1];
        result.unitMeshWeight =
          result.totalHeigthWeight + result.totalWidthWeight;
        result.totalWeight = result.unitMeshWeight * mesh.piece;

        let localFilamentError = [];
        if (result.frontFilament < 0) {
          localFilamentError.push("Ön filiz boyu sıfırdan küçük olamaz.");
          result.frontFilament = 0;
        }
        if (result.backFilament < 0) {
          localFilamentError.push("Arka filiz boyu sıfırdan küçük olamaz.");
          result.backFilament = 0;
        }
        if (result.leftFilament < 0) {
          localFilamentError.push("Sol filiz boyu sıfırdan küçük olamaz.");
          result.leftFilament = 0;
        }
        if (result.rightFilament < 0) {
          localFilamentError.push("Sağ filiz boyu sıfırdan küçük olamaz.");
          result.rightFilament = 0;
        }

        if (localFilamentError.length > 0) {
          setFilamentError(localFilamentError.join(" "));
        } else {
          setFilamentError("");
          setCalculated(result);
        }
      } else {
        setError("Seçilen hasır için çap bilgisi bulunamadı.");
      }
    } else {
      setError("Lütfen Hasır Adını seçin.");
    }
  }, [mesh]);

  // Inside the useEffect that runs when `calculated` changes
  useEffect(() => {
    setKesmeCalculations((prevState) => ({
      ...prevState,
      diameter: calculated.diameter,
      numberOfSticks: calculated.numberOfSticks,
      totalHeigthWeight: calculated.totalHeigthWeight,
      totalWidthWeight: calculated.totalWidthWeight,
      // Add this if you want to always reflect the current dimensions from mesh
      height: mesh.height,
      width: mesh.width,
      // Update other fields here
    }));
  }, [calculated, mesh.height, mesh.width]);
  return (
    <div className="flex flex-col items-center justify-center">
      <div className="flex flex-col text-black items-center justify-center px-4 py-2 gap-y-10 mt-4 w-full">
        <AutoMeshForm 
         mesh={mesh}
         setCalculated={setCalculated}
         setMesh={setMesh}
         calculated={calculated}
         setShowMessage={setShowMessage}
         filamentError={filamentError}
         setFilamentError={setFilamentError}
        />
        {(error || showMessage) && (
          <div>
            {error && (
              <div className="my-2 text-md text-red-500 rounded ">{error}</div>
            )}
            {showMessage && (
              <div className="my-2 text-md text-green-500 rounded ">
                Siparişlere başarıyla eklendi.
              </div>
            )}
          </div>
        )}
        <AutoCalculationTable calculated={calculated} mesh={mesh} />
      </div>
      {filamentError && (
        <div className="my-2 text-sm text-red-600">{filamentError}</div>
      )}

      {!!calculated.totalWeight && (
        <div className="flex flex-col justify-center items-center max-w-[95%] mx-auto ">
          <div
            ref={divRef}
            className="flex  w-full overflow-x-scroll mt-8 mb-2"
          >
            <AutoMesh
              calculated={calculated}
              height={mesh.width}
              width={mesh.height}
              firm="Mongery Yazılım"
              type={mesh.type}
              piece={mesh.piece}
              quality="TS 4559 EKİM 1985"
              stroke="black"
            />
          </div>
          <div className="flex flex-row justify-between items-center gap-x-4 mb-16">
            {
              <DownloadButton
                clickFunction={() => downloadAsPng(divRef)}
                title=" Resim olarak kaydet"
                
              />
            }
            {
              <DownloadButton
                clickFunction={() => downloadAsPdf(divRef)}
                title="PDF İndir"
              />
            }
          </div>
        </div>
      )}
    </div>
  );
};

export default AutomaticTab;
