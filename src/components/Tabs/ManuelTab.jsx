import Input from "../Input";
import ManuelMesh from "../Mesh/ManuelMesh";
import { useAddKesmeMutation } from "../../store/reducers/kesme";
import ManualCalculationTable from "../Mesh/ManualCalculationTable";
import DownloadButton from "../Buttons/DownloadButton";
import { useRef } from "react";
import { downloadAsPdf, downloadAsPng } from "@/utils/downloads";
const ManuelTab = ({
  manuelMesh,
  manuelCalculated,
  manuelError,
  setManuelMesh,
  setIsManualChange,
  setLastModifiedGroup,
  isButtonDisabled,
  showMessage,
  setShowMessage,
}) => {
  const divRef = useRef();

  const [addKesme, { isLoading: addKesmeIsLoading, isError: addKesmeIsError }] =
    useAddKesmeMutation({
      onError: (error) => {
        console.error("An error occurred in myData query:", error);
      },
    });
  const openKesmeTabFromManual = () => {
    if (!isButtonDisabled) {
      const kesmeData = {
        height_stick: {
          diameter: manuelMesh.diameter[0],
          height: manuelMesh.height,
          number_of_sticks:
            manuelMesh.piece * manuelMesh.numberOfSticks[0],
          total_height_weight:
            manuelMesh.piece * manuelCalculated.totalHeigthWeight,
        },
        width_stick: {
          diameter: manuelMesh.diameter[1],
          height: manuelMesh.width,
          number_of_sticks:
            manuelMesh.piece * manuelMesh.numberOfSticks[1],
          total_width_weight:
            manuelMesh.piece * manuelCalculated.totalWidthWeight,
        },
      };

      addKesme(kesmeData);
      setShowMessage(true);
      setTimeout(() => setShowMessage(false), 2000);
    }
  };
  return (
    <div className="flex flex-col items-center justify-center gap-y-2">
      <div className="flex flex-col items-center justify-center px-4 py-2  mt-4 w-full">
        <div className="flex flex-col items-center gap-y-3 justify-center mb-4">
          <div className="w-full grid  grid-cols-1 sm:grid-cols-2 md:grid-cols-5 lg:grid-cols-7 xl:grid-cols-11 gap-4 xl:gap-2">
            <div className="w-full flex-col md:w-auto flex justify-between items-center">
              <span className="flex-1 text-sm font-semibold">Hasır Boyu:</span>
              <div className="flex-1 w-full md:w-[120px]">
                <Input
                  id="noArrow"
                  type="number"
                  inputMode="decimal"
                  value={manuelMesh.height}
                  onChange={(value) => {
                    setManuelMesh((manuelMesh) => ({
                      ...manuelMesh,
                      height: parseFloat(value),
                    }));
                  }}
                  max={1000}
                  min={0}
                />
              </div>
            </div>
            <div className="w-full flex-col md:w-auto flex justify-between items-center">
              <span className="flex-1 text-sm font-semibold">Hasır Eni:</span>
              <div className="flex-1 w-full md:w-[120px]">
                <Input
                  id="noArrow"
                  type="number"
                  inputMode="decimal"
                  value={manuelMesh.width}
                  onChange={(value) => {
                    setManuelMesh((manuelMesh) => ({
                      ...manuelMesh,
                      width: parseFloat(value),
                    }));
                  }}
                  max={1000}
                  min={0}
                />
              </div>
            </div>

            <div className="w-full flex-col md:w-auto flex justify-between items-center">
              <span className="flex-1 text-sm font-semibold">
                Boy Çubuk Çapı:
              </span>
              <div className="flex-1 w-full md:w-[120px]">
                <Input
                  id="noArrow"
                  type="number"
                  inputMode="decimal"
                  value={manuelMesh.diameter[0]}
                  onChange={(value) => {
                    setManuelMesh((prevManuelMesh) => {
                      return {
                        ...prevManuelMesh,
                        diameter: [value, prevManuelMesh.diameter[1]],
                      };
                    });
                  }}
                />
              </div>
            </div>
            <div className="w-full flex-col md:w-auto flex justify-between items-center">
              <span className="flex-1 text-sm font-semibold">
                En Çubuk Çapı:
              </span>
              <div className="flex-1 w-full md:w-[120px]">
                <Input
                  id="noArrow"
                  type="number"
                  inputMode="decimal"
                  value={manuelMesh.diameter[1]}
                  onChange={(value) => {
                    setManuelMesh((prevManuelMesh) => {
                      return {
                        ...prevManuelMesh,
                        diameter: [prevManuelMesh.diameter[0], value],
                      };
                    });
                  }}
                />
              </div>
            </div>
            <div className="w-full flex-col md:w-auto flex justify-between items-center">
              <span className="flex-1 text-sm font-semibold">
                Boy Çubuk Sayısı
              </span>
              <div className="flex-1 w-full md:w-[120px]">
                <Input
                id="noArrow"
                type="number"
                  value={manuelMesh.numberOfSticks[0]}
                  onChange={(value) => {
                    setManuelMesh((prevManuelMesh) => {
                      return {
                        ...prevManuelMesh,
                        numberOfSticks: [
                          parseInt(value),
                          prevManuelMesh.numberOfSticks[1],
                        ],
                      };
                    });
                    setLastModifiedGroup("A");
                    setIsManualChange(true);
                  }}
                />
              </div>
            </div>
            <div className="w-full flex-col md:w-auto flex justify-between items-center">
              <span className="flex-1 text-sm font-semibold">
                En Çubuk Sayısı:
              </span>
              <div className="flex-1 w-full md:w-[120px]">
                <Input
                id="noArrow"
                type="number"
                  value={manuelMesh.numberOfSticks[1]}
                  onChange={(value) => {
                    setManuelMesh((prevManuelMesh) => {
                      return {
                        ...prevManuelMesh,
                        numberOfSticks: [
                          prevManuelMesh.numberOfSticks[0],
                          parseInt(value),
                        ],
                      };
                    });
                    setLastModifiedGroup("A");
                    setIsManualChange(true);
                  }}
                />
              </div>
            </div>

            <div className="w-full flex-col md:w-auto flex justify-between items-center">
              <span className="flex-1 text-sm font-semibold">
                Ön Filiz Boyu:
              </span>
              <div className="flex-1 w-full md:w-[120px]">
                <Input
                  id="noArrow"
                  type="number"
                  inputMode="decimal"
                  value={manuelMesh.frontFilament}
                  onChange={(value) => {
                    setManuelMesh((manuelMesh) => ({
                      ...manuelMesh,
                      frontFilament: parseFloat(value),
                    }));
                    setLastModifiedGroup("B");
                    setIsManualChange(true);
                  }}
                />
              </div>
            </div>
            <div className="w-full flex-col md:w-auto flex justify-between items-center">
              <span className="flex-1 text-sm font-semibold">
                Arka Filiz Boyu:
              </span>
              <div className="flex-1 w-full md:w-[120px]">
                <Input
                  id="noArrow"
                  type="number"
                  inputMode="decimal"
                  value={manuelMesh.backFilament}
                  onChange={(value) => {
                    setManuelMesh((manuelMesh) => ({
                      ...manuelMesh,
                      backFilament: parseFloat(value),
                    }));
                    setLastModifiedGroup("B");
                    setIsManualChange(true);
                  }}
                />
              </div>
            </div>
            <div className="w-full flex-col md:w-auto flex justify-between items-center">
              <span className="flex-1 text-sm font-semibold">
                Sağ Filiz Boyu:
              </span>
              <div className="flex-1 w-full md:w-[120px]">
                <Input
                  id="noArrow"
                  type="number"
                  inputMode="decimal"
                  value={manuelMesh.rightFilament}
                  onChange={(value) => {
                    setManuelMesh((manuelMesh) => ({
                      ...manuelMesh,
                      rightFilament: parseFloat(value),
                    }));
                    setLastModifiedGroup("B");
                    setIsManualChange(true);
                  }}
                />
              </div>
            </div>
            <div className="w-full flex-col md:w-auto flex justify-between items-center">
              <span className="flex-1 text-sm font-semibold">
                Sol Filiz Boyu:
              </span>
              <div className="flex-1 w-full md:w-[120px]">
                <Input
                  id="noArrow"
                  type="number"
                  inputMode="decimal"
                  value={manuelMesh.leftFilament}
                  onChange={(value) => {
                    setManuelMesh((manuelMesh) => ({
                      ...manuelMesh,
                      leftFilament: parseFloat(value),
                    }));
                    setLastModifiedGroup("B");
                    setIsManualChange(true);
                  }}
                />
              </div>
            </div>
            <div className="w-full flex-col md:w-auto flex justify-between items-center">
              <span className="flex-1 text-sm font-semibold">
                Sipariş Adedi:
              </span>
              <div className="flex-1 w-full md:w-[120px]">
                <Input
                  id="noArrow"
                  type="number"
                  value={manuelMesh.piece}
                  onChange={(value) => {
                    setManuelMesh((manuelMesh) => ({
                      ...manuelMesh,
                      piece: parseInt(value),
                    }));
                  }}
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
              onClick={openKesmeTabFromManual}
            >
              Kesmeye Gönder
            </button>
          </div>
        </div>
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
