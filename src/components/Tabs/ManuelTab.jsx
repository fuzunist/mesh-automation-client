import Input from "../Input";
import ManuelMesh from "../ManuelMesh";
import { useAddKesmeMutation } from "../../store/reducers/kesme";
import ManualCalculationTable from "./ManualCalculationTable";

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
            manuelMesh.piece * manuelCalculated.numberOfSticks[0],
          total_height_weight:
            manuelMesh.piece * manuelCalculated.totalHeigthWeight,
        },
        width_stick: {
          diameter: manuelMesh.diameter[1],
          height: manuelMesh.width,
          number_of_sticks:
            manuelMesh.piece * manuelCalculated.numberOfSticks[1],
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
    <>
      <div className="flex flex-col  items-center justify-center px-4 py-2 gap-10 mt-8">
        <div className="flex flex-col w-full mb-4 gap-3">
          <div className="flex flex-row gap-3 w-full justify-between">
            <div className="w-full flex-col md:w-auto flex justify-between items-center">
              <span className="flex-1 text-sm font-semibold">Hasır Tipi:</span>
              <span className="flex-1">Özel Hasır</span>
            </div>

            <div className="w-full flex-col md:w-auto flex justify-between items-center">
              <span className="flex-1 text-sm font-semibold">Hasır Boyu:</span>
              <div className="flex-1 w-full md:w-[120px]">
                <Input
                  value={manuelMesh.height}
                  onChange={(value) => {
                    setManuelMesh((manuelMesh) => ({
                      ...manuelMesh,
                      height: parseInt(value),
                    }));
                  }}
                  type="number"
                  max={1000}
                  min={0}
                />
              </div>
            </div>
            <div className="w-full flex-col md:w-auto flex justify-between items-center">
              <span className="flex-1 text-sm font-semibold">Hasır Eni:</span>
              <div className="flex-1 w-full md:w-[120px]">
                <Input
                  value={manuelMesh.width}
                  onChange={(value) => {
                    setManuelMesh((manuelMesh) => ({
                      ...manuelMesh,
                      width: parseInt(value),
                    }));
                  }}
                  type="number"
                  max={1000}
                  min={0}
                />
              </div>
            </div>
            <div className="w-full flex-col md:w-auto flex justify-between items-center">
              <span className="flex-1 text-sm font-semibold">
                Boy Çubuğu +/-:
              </span>
              <div className="flex-1 w-full md:w-[120px]">
                <Input
                  value={manuelMesh.numberOfHeightBars}
                  onChange={(value) => {
                    setManuelMesh((manuelMesh) => ({
                      ...manuelMesh,
                      numberOfHeightBars: value,
                    }));
                  }}
                  type="number"
                />
              </div>
            </div>
            <div className="w-full flex-col md:w-auto flex justify-between items-center">
              <span className="flex-1 text-sm font-semibold">
                En Çubuğu +/-:
              </span>
              <div className="flex-1 w-full md:w-[120px]">
                <Input
                  value={manuelMesh.numberOfWidthBars}
                  onChange={(value) => {
                    setManuelMesh((manuelMesh) => ({
                      ...manuelMesh,
                      numberOfWidthBars: value,
                    }));
                  }}
                  type="number"
                />
              </div>
            </div>
            <div className="w-full flex-col md:w-auto flex justify-between items-center">
              <span className="flex-1 text-sm font-semibold">
                Boy Çubuk Çapı:
              </span>
              <div className="flex-1 w-full md:w-[120px]">
                <Input
                  value={manuelMesh.diameter[0]}
                  onChange={(value) => {
                    setManuelMesh((prevManuelMesh) => {
                      return {
                        ...prevManuelMesh,
                        diameter: [value, prevManuelMesh.diameter[1]],
                      };
                    });
                  }}
                  type="number"
                />
              </div>
            </div>
            <div className="w-full flex-col md:w-auto flex justify-between items-center">
              <span className="flex-1 text-sm font-semibold">
                En Çubuk Çapı:
              </span>
              <div className="flex-1 w-full md:w-[120px]">
                <Input
                  value={manuelMesh.diameter[1]}
                  onChange={(value) => {
                    setManuelMesh((prevManuelMesh) => {
                      return {
                        ...prevManuelMesh,
                        diameter: [prevManuelMesh.diameter[0], value],
                      };
                    });
                  }}
                  type="number"
                />
              </div>
            </div>
            <div className="w-full flex-col md:w-auto flex justify-between items-center">
              <span className="flex-1 text-sm font-semibold">
                Boy Göz Aralığı:
              </span>
              <div className="flex-1 w-full md:w-[120px]">
                <Input
                  value={manuelMesh.apertureSize[0]}
                  onChange={(value) => {
                    setManuelMesh((prevManuelMesh) => {
                      return {
                        ...prevManuelMesh,
                        apertureSize: [value, prevManuelMesh.apertureSize[1]],
                      };
                    });
                    setLastModifiedGroup("A");
                    setIsManualChange(true);
                  }}
                  type="number"
                />
              </div>
            </div>
            <div className="w-full flex-col md:w-auto flex justify-between items-center">
              <span className="flex-1 text-sm font-semibold">
                En Göz Aralığı:
              </span>
              <div className="flex-1 w-full md:w-[120px]">
                <Input
                  value={manuelMesh.apertureSize[1]}
                  onChange={(value) => {
                    setManuelMesh((prevManuelMesh) => {
                      return {
                        ...prevManuelMesh,
                        apertureSize: [prevManuelMesh.apertureSize[0], value],
                      };
                    });
                    setLastModifiedGroup("A");
                    setIsManualChange(true);
                  }}
                  type="number"
                />
              </div>
            </div>
          </div>
          <div className="flex flex-row gap-3 w-[63%] justify-between ">
            <div className="w-full flex-col md:w-auto flex justify-between items-center">
              <span className="flex-1 text-sm font-semibold">
                Ön Filiz Boyu:
              </span>
              <div className="flex-1 w-full md:w-[120px]">
                <Input
                  value={manuelMesh.frontFilament}
                  onChange={(value) => {
                    setManuelMesh((manuelMesh) => ({
                      ...manuelMesh,
                      frontFilament: value,
                    }));
                    setLastModifiedGroup("B");
                    setIsManualChange(true);
                  }}
                  type="number"
                />
              </div>
            </div>
            <div className="w-full flex-col md:w-auto flex justify-between items-center">
              <span className="flex-1 text-sm font-semibold">
                Arka Filiz Boyu:
              </span>
              <div className="flex-1 w-full md:w-[120px]">
                <Input
                  value={manuelMesh.backFilament}
                  onChange={(value) => {
                    setManuelMesh((manuelMesh) => ({
                      ...manuelMesh,
                      backFilament: value,
                    }));
                    setLastModifiedGroup("B");
                    setIsManualChange(true);
                  }}
                  type="number"
                />
              </div>
            </div>
            <div className="w-full flex-col md:w-auto flex justify-between items-center">
              <span className="flex-1 text-sm font-semibold">
                Sağ Filiz Boyu:
              </span>
              <div className="flex-1 w-full md:w-[120px]">
                <Input
                  value={manuelMesh.rightFilament}
                  onChange={(value) => {
                    setManuelMesh((manuelMesh) => ({
                      ...manuelMesh,
                      rightFilament: value,
                    }));
                    setLastModifiedGroup("B");
                    setIsManualChange(true);
                  }}
                  type="number"
                />
              </div>
            </div>
            <div className="w-full flex-col md:w-auto flex justify-between items-center">
              <span className="flex-1 text-sm font-semibold">
                Sol Filiz Boyu:
              </span>
              <div className="flex-1 w-full md:w-[120px]">
                <Input
                  value={manuelMesh.leftFilament}
                  onChange={(value) => {
                    setManuelMesh((manuelMesh) => ({
                      ...manuelMesh,
                      leftFilament: value,
                    }));
                    setLastModifiedGroup("B");
                    setIsManualChange(true);
                  }}
                  type="number"
                />
              </div>
            </div>
            <div className="w-full flex-col md:w-auto flex justify-between items-center">
              <span className="flex-1 text-sm font-semibold">
                Sipariş Adedi:
              </span>
              <div className="flex-1 w-full md:w-[120px]">
                <Input
                  value={manuelMesh.piece}
                  onChange={(value) => {
                    setManuelMesh((manuelMesh) => ({
                      ...manuelMesh,
                      piece: value,
                    }));
                  }}
                  type="number"
                />
              </div>
            </div>
            <div className="flex flex-col justify-center md:w-[120px]">
              <button
                className={`text-white text-sm font-bold py-1 px-4 rounded mt-2 ${
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
      </div>
      {!!manuelCalculated.totalWeight && (
        <div className="flex justify-center items-center mt-8 mb-16">
          <ManuelMesh
            manuelCalculated={manuelCalculated}
            height={manuelMesh.width}
            width={manuelMesh.height}
            frontFilament={manuelMesh.frontFilament}
            backFilament={manuelMesh.backFilament}
            leftFilament={manuelMesh.leftFilament}
            rightFilament={manuelMesh.rightFilament}
            apertureSize={manuelMesh.apertureSize}
            firm="Mongery Yazılım"
            diameter={manuelMesh.diameter}
            type={manuelMesh.type}
            piece={manuelMesh.piece}
            quality="TS 4559 EKİM 1985"
            stroke="black"
          />
        </div>
      )}
    </>
  );
};

export default ManuelTab;
