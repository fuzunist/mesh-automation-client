import ManuelMesh from "../Mesh/ManuelMesh";
import ManualCalculationTable from "../Mesh/ManualCalculationTable";
import DownloadButton from "../Buttons/DownloadButton";
import { useRef, useState, useEffect } from "react";
import { downloadAsPdf, downloadAsPng } from "@/utils/downloads";
import { initialValues } from "../../contants/meshValues";
import ManuelMeshForm from "../Mesh/ManuelMeshForm";

const ManuelTab = ({}) => {
  const [manuelCalculated, setManuelCalculated] = useState(
    initialValues.manuelCalculated
  );
  const [manuelMesh, setManuelMesh] = useState(initialValues.manuelMesh);

  const [showMessage, setShowMessage] = useState(false);

  const [manuelFilamentError, setManuelFilamentError] = useState("");

  const [manuelError, setManuelError] = useState("");

  const [isManualChange, setIsManualChange] = useState(false);
  const [kesmeCalculationsFromManuel, setKesmeCalculationsFromManuel] =
    useState([]);

  const divRef = useRef();

  let isManuelMeshValid;
  useEffect(() => {
    if (!isManualChange) return;

    setManuelCalculated(initialValues.manuelCalculated);

    isManuelMeshValid =
      manuelMesh.type &&
      manuelMesh.height &&
      manuelMesh.width &&
      manuelMesh.diameter[0] &&
      manuelMesh.diameter[1] &&
      manuelMesh.numberOfSticks[0] &&
      manuelMesh.numberOfSticks[1] &&
      manuelMesh.frontFilament &&
      manuelMesh.backFilament &&
      manuelMesh.leftFilament &&
      manuelMesh.rightFilament &&
      manuelMesh.piece;

    console.log("line 244");
    if (!isManuelMeshValid) {
      console.log("line 245");
      setManuelError("Tüm alanların doldurulması zorunludur.");
      return;
    }

    setManuelError("");
    const result = { ...initialValues.manuelCalculated };

    // Calculate the number of sticks for width and height
    result.apertureSize[0] =
      (manuelMesh.width - manuelMesh.leftFilament - manuelMesh.rightFilament) /
      (manuelMesh.numberOfSticks[0] - 1);

    result.apertureSize[1] =
      (manuelMesh.height - manuelMesh.backFilament - manuelMesh.frontFilament) /
      (manuelMesh.numberOfSticks[1] - 1);

    // Calculate unit and total weights
    result.unitOfHeigthWeight =
      (((Math.PI * manuelMesh.diameter[0] * manuelMesh.diameter[0]) / 4) *
        0.007847 *
        manuelMesh.height) /
      100;
    result.unitOfWidthWeight =
      (((Math.PI * manuelMesh.diameter[1] * manuelMesh.diameter[1]) / 4) *
        0.007847 *
        manuelMesh.width) /
      100;
    result.totalHeigthWeight =
      result.unitOfHeigthWeight * manuelMesh.numberOfSticks[0];
    result.totalWidthWeight =
      result.unitOfWidthWeight * manuelMesh.numberOfSticks[1];
    result.unitMeshWeight = result.totalHeigthWeight + result.totalWidthWeight;
    result.totalWeight = result.unitMeshWeight * manuelMesh.piece;

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
      setManuelFilamentError(localFilamentError.join(" "));
    } else {
      setIsManualChange(false);
      setManuelFilamentError("");
      setManuelCalculated(result);
    }
  }, [manuelMesh]);

  useEffect(() => {
    setKesmeCalculationsFromManuel((prevState) => ({
      ...prevState,
      diameter: manuelMesh.diameter,
      numberOfSticks: manuelMesh.numberOfSticks,
      totalHeigthWeight: manuelCalculated.totalHeigthWeight,
      totalWidthWeight: manuelCalculated.totalWidthWeight,
      // Add this if you want to always reflect the current dimensions from mesh
      height: manuelMesh.height,
      width: manuelMesh.width,
      // Update other fields here
    }));
  }, [
    manuelCalculated,
    manuelMesh.height,
    manuelMesh.width,
    manuelMesh.numberOfSticks,
  ]); // Add mesh.height and mesh.width as dependencies

  return (
    <div className="flex flex-col items-center justify-center gap-y-2">
      <div className="flex flex-col items-center justify-center px-4 py-2  mt-4 w-full">
        <ManuelMeshForm
          manuelCalculated={manuelCalculated}
          manuelMesh={manuelMesh}
          manuelFilamentError={manuelFilamentError}
          setShowMessage={setShowMessage}
          setIsManualChange={setIsManualChange}
          setManuelMesh={setManuelMesh}
        />
      </div>

      {(manuelError || showMessage) && (
        <div>
          {manuelError && (
            <div className="my-2 text-md text-red-500 rounded ">
              {manuelError}
            </div>
          )}
          {showMessage && (
            <div className="my-2 text-md text-green-500 rounded ">
              Kesme'ye başarıyla eklendi.
            </div>
          )}
        </div>
      )}

      <ManualCalculationTable
        manuelCalculated={manuelCalculated}
        manuelMesh={manuelMesh}
      />

      {!!manuelCalculated.totalWeight && (
        <div className="flex flex-col justify-center items-center max-w-[95%] mx-auto">
          <div
            ref={divRef}
            className="flex  w-full overflow-x-scroll mt-8 mb-2"
          >
            <ManuelMesh
              manuelCalculated={manuelCalculated}
              height={manuelMesh.width}
              width={manuelMesh.height}
              frontFilament={manuelMesh.frontFilament}
              backFilament={manuelMesh.backFilament}
              leftFilament={manuelMesh.leftFilament}
              rightFilament={manuelMesh.rightFilament}
              numberOfSticks={manuelMesh.numberOfSticks}
              firm="Mongery Yazılım"
              diameter={manuelMesh.diameter}
              type={manuelMesh.type}
              piece={manuelMesh.piece}
              quality="TS 4559 EKİM 1985"
              stroke="black"
            />
          </div>
          <div className="flex flex-row justify-between items-center gap-x-4">
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

export default ManuelTab;
