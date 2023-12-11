import Select from "../Select";
import Input from "../Input";
import Mesh from "../Mesh/Mesh";
import { useAddKesmeMutation } from "../../store/reducers/kesme";
import AutoCalculationTable from "../Mesh/AutoCalculationTable";
import { useRef } from "react";
import DownloadButton from "../Buttons/DownloadButton";
import { downloadAsPdf, downloadAsPng } from "@/utils/downloads";

const AutomaticTab = ({
  mesh,
  setMesh,
  meshTypeOptions,
  handleTypeChange,
  meshFeatures,
  setCalculated,
  initialValues,
  calculated,
  setFilamentError,
  isButtonDisabled,
  showMessage,
  error,
  filamentError,
  setShowMessage,
}) => {
  const divRef = useRef();

  const [addKesme, { isLoading: addKesmeIsLoading, isError: addKesmeIsError }] =
    useAddKesmeMutation({
      onError: (error) => {
        console.error("An error occurred in myData query:", error);
      },
    });
  // Function to opnen "KESME" tab
  const openKesmeTab = () => {
    if (!isButtonDisabled) {
      const kesmeData = {
        height_stick: {
          diameter: calculated.diameter[0],
          height: mesh.height,
          number_of_sticks: mesh.piece * calculated.numberOfSticks[0],
          total_height_weight: mesh.piece * calculated.totalHeigthWeight,
        },
        width_stick: {
          diameter: calculated.diameter[1],
          height: mesh.width,
          number_of_sticks: mesh.piece * calculated.numberOfSticks[1],
          total_width_weight: mesh.piece * calculated.totalWidthWeight,
        },
      };

      addKesme(kesmeData);
      setShowMessage(true);
      setTimeout(() => {
        setShowMessage(false);
      }, 1500);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center">
      <div className="flex flex-col items-center justify-center px-4 py-2 gap-y-10 mt-4 w-full">
        <div className="flex flex-col xl:flex-row xl:items-end items-center gap-y-2  justify-center">
          <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-8 gap-y-2 gap-x-1 w-full justify-center items-center ">
            <div className="w-full flex-col md:w-auto flex justify-between items-center">
              <span className="text-sm font-semibold">Hasır Tipi:</span>
              <div className="flex-1 flex w-full md:w-[150px]">
                <Select
                  value={mesh.type}
                  onChange={(value) => handleTypeChange(value)}
                  options={meshTypeOptions.map((option) => option.label)}
                />
              </div>
            </div>
            <div className="w-full flex-col md:w-auto flex justify-between items-center">
              <span className="text-sm font-semibold">Hasır Kodu:</span>
              <div className="flex-1 w-full md:w-[120px]">
                <Select
                  value={mesh.code}
                  onChange={(value) =>
                    setMesh((prevMesh) => ({ ...prevMesh, code: value }))
                  }
                  options={["", ...Object.keys(meshFeatures)]}
                  disabled={mesh.type === "Perde Hasırı"}
                />
              </div>
            </div>
            <div className="w-full flex-col md:w-auto flex justify-between items-center">
              <span className="text-sm font-semibold">Hasır Adı:</span>
              <div className="flex-1 w-full md:w-[120px]">
                <Select
                  value={mesh.name}
                  onChange={(value) => {
                    setMesh((mesh) => ({ ...mesh, name: value }));
                  }}
                  options={[
                    "",
                    ...(mesh.code ? Object.keys(meshFeatures[mesh.code]) : []),
                  ]}
                />
              </div>
            </div>
            <div className="w-full flex-col md:w-auto flex justify-between items-center">
              <span className="text-sm font-semibold">Hasır Boyu:</span>
              <div className="flex-1 w-full md:w-[120px]">
                {mesh.type === "Perde Hasırı" ? (
                  <Input
                    id="noArrow"
                    type="number"
                    inputMode="decimal"
                    value={mesh.height}
                    onChange={(value) => {
                      setMesh((mesh) => ({
                        ...mesh,
                        height: parseFloat(value),
                      }));
                      if (value === "330") {
                        setCalculated({
                          ...initialValues.calculated,
                          frontFilament: 65,
                          backFilament: 10,
                          leftFilament: 2.5,
                          rightFilament: 2.5,
                        });
                      } else if (value === "335") {
                        setCalculated({
                          ...initialValues.calculated,
                          frontFilament: 70,
                          backFilament: 10,
                          leftFilament: 2.5,
                          rightFilament: 2.5,
                        });
                      } else if (value === "336") {
                        setCalculated({
                          ...initialValues.calculated,
                          frontFilament: 79,
                          backFilament: 10,
                          leftFilament: 2.5,
                          rightFilament: 2.5,
                        });
                      } else if (value === "345") {
                        setCalculated({
                          ...initialValues.calculated,
                          frontFilament: 65,
                          backFilament: 10,
                          leftFilament: 2.5,
                          rightFilament: 2.5,
                        });
                      } else {
                        setCalculated(initialValues.calculated);
                      }
                    }}
                    options={["", 330, 335, 336, 345]}
                  />
                ) : (
                  <Input
                    id="noArrow"
                    value={mesh.height}
                    onChange={(value) => {
                      setMesh((mesh) => ({
                        ...mesh,
                        numberOfHeightBars: 0,
                        numberOfWidthBars: 0,
                        height: parseFloat(value),
                      }));
                    }}
                    type="number"
                    inputMode="decimal"
                    max={1000}
                    min={0}
                  />
                )}
              </div>
            </div>
            <div className="w-full flex-col md:w-auto flex justify-between items-center">
              <span className="text-sm font-semibold">Hasır Eni:</span>
              <div className="flex-1 w-full md:w-[120px]">
                <Input
                  id="noArrow"
                  value={mesh.width}
                  onChange={(value) => {
                    setMesh((mesh) => ({
                      ...mesh,
                      numberOfHeightBars: 0,
                      numberOfWidthBars: 0,
                      width: parseFloat(value),
                    }));
                  }}
                  type="number"
                  inputMode="decimal"
                  max={1000}
                  min={0}
                />
              </div>
            </div>

            <div className="w-full flex-col md:w-auto flex justify-between items-center">
              <span className="text-sm font-semibold">Boy Çubuğu +/-:</span>
              <div className="flex-1 flex w-full md:w-[120px]">
                <Input
                  value={mesh.numberOfHeightBars}
                  onChange={(value) => {
                    const newValue = parseInt(value);

                    if (calculated.numberOfSticks[0] >= 1) {
                      if (
                        calculated.numberOfSticks[0] === 1 &&
                        mesh.numberOfHeightBars > newValue
                      ) {
                        setFilamentError("Boy Çubuğu daha fazla azaltılamaz.");

                        return;
                      }
                      setMesh((mesh) => ({
                        ...mesh,
                        numberOfHeightBars: newValue,
                      }));
                      setFilamentError("");
                    }
                  }}
                  type="number"
                  disabled={mesh.type === "Perde Hasırı"}
                />
              </div>
            </div>

            <div className="w-full flex-col md:w-auto flex justify-between items-center">
              <span className="text-sm font-semibold">En Çubuğu +/-:</span>
              <div className="flex-1 flex w-full md:w-[120px]">
                <Input
                  value={mesh.numberOfWidthBars}
                  onChange={(value) => {
                    const newValue = parseInt(value);

                    if (calculated.numberOfSticks[1] >= 1) {
                      if (
                        calculated.numberOfSticks[1] === 1 &&
                        mesh.numberOfWidthBars > newValue
                      ) {
                        setFilamentError("En Çubuğu daha fazla azaltılamaz.");

                        return;
                      }
                      setMesh((mesh) => ({
                        ...mesh,
                        numberOfWidthBars: newValue,
                      }));
                      setFilamentError("");
                    }
                  }}
                  type="number"
                  disabled={mesh.type === "Perde Hasırı"}
                />
              </div>
            </div>

            <div className="w-full flex-col md:w-auto flex justify-between items-center">
              <span className="text-sm font-semibold">Sipariş Adedi:</span>
              <div className="flex-1 flex w-full md:w-[120px]">
                <Input
                  id="noArrow"
                  value={mesh.piece}
                  onChange={(value) => {
                    setMesh((mesh) => ({ ...mesh, piece: parseInt(value) }));
                  }}
                  type="number"
                  min={0}
                />
              </div>
            </div>
          </div>
          <div className="flex  xl:-mt-2">
            <button
              className={`text-white w-45 h-full text-sm font-semibold truncate px-2 py-1 mb-0.5 rounded mt-2 ${
                isButtonDisabled
                  ? "bg-gray-500"
                  : "bg-blue-500 hover:bg-blue-700"
              }`}
              disabled={isButtonDisabled}
              onClick={openKesmeTab}
            >
              Kesmeye Gönder
            </button>
          </div>
        </div>
        {(error || showMessage) && (
          <div>
            {error && (
              <div className="my-2 text-md text-red-500 rounded ">{error}</div>
            )}
            {showMessage && (
              <div className="my-2 text-md text-green-500 rounded ">
                Kesme'ye başarıyla eklendi.
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
            <Mesh
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
          <div className="flex flex-row justify-between items-center gap-x-4 mb-6">
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
