import Input from "../Input";
import { useAddKesmeMutation } from "../../store/reducers/kesme";
import { useAddOrderMutation } from "../../store/reducers/kesme";
import SiparisButtonForManuelTab from "../Buttons/SiparisButtonForManuelTab";

const ManuelMeshForm = ({
  manuelCalculated,
  manuelMesh,
  manuelFilamentError,
  setShowMessage,
  setIsManualChange,
  setManuelMesh,
}) => {
  const isButtonDisabled =
    !manuelMesh.height ||
    !manuelMesh.width ||
    !manuelMesh.diameter[0] ||
    !manuelMesh.diameter[1] ||
    !manuelMesh.numberOfSticks[0] ||
    !manuelMesh.numberOfSticks[1] ||
    !manuelMesh.backFilament ||
    !manuelMesh.rightFilament ||
    !manuelMesh.leftFilament ||
    !manuelMesh.frontFilament ||
    !manuelMesh.piece ||
    manuelFilamentError;

  const [addKesme, { isLoading: addKesmeIsLoading, isError: addKesmeIsError }] =
    useAddKesmeMutation({
      onError: (error) => {
        console.error("An error occurred in myData query:", error);
      },
    });

    const [addOrder, { isLoading: addOrderIsLoading, isError: addOrderIsError }] =
    useAddOrderMutation({
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
          number_of_sticks: manuelMesh.piece * manuelMesh.numberOfSticks[0],
          total_height_weight:
            manuelMesh.piece * manuelCalculated.totalHeigthWeight,
        },
        width_stick: {
          diameter: manuelMesh.diameter[1],
          height: manuelMesh.width,
          number_of_sticks: manuelMesh.piece * manuelMesh.numberOfSticks[1],
          total_width_weight:
            manuelMesh.piece * manuelCalculated.totalWidthWeight,
        },
      };

      addKesme(kesmeData);
      setShowMessage(true);
      setTimeout(() => setShowMessage(false), 2000);
    }
  };

  const openOrdersTabFromManual = () => {
    if (!isButtonDisabled) {
      const orderData = {
        information: {
          mesh_type: manuelMesh.type,
          mesh_code: "-",
          mesh_name: "-",
        },
        stick: {
          height_diameter: parseFloat(manuelMesh.diameter[0].toFixed(2)),
          width_diameter: parseFloat(manuelMesh.diameter[1].toFixed(2)),
          height_apertureSize: parseFloat(manuelCalculated.apertureSize[0].toFixed(2)),
          width_apertureSize: parseFloat(manuelCalculated.apertureSize[1].toFixed(2)),
          back_filament: parseFloat(manuelMesh.backFilament.toFixed(2)),
          front_filament: parseFloat(manuelMesh.frontFilament.toFixed(2)),
          left_filament: parseFloat(manuelMesh.leftFilament.toFixed(2)),
          right_filament: parseFloat(manuelMesh.rightFilament.toFixed(2)),
        },
        mesh: {
          height_number_of_sticks: parseFloat(manuelMesh.numberOfSticks[0].toFixed(2)),
          width_number_of_sticks: parseFloat(manuelMesh.numberOfSticks[1].toFixed(2)),
          unit_mesh_weight: parseFloat(manuelCalculated.unitMeshWeight.toFixed(2)),
          length_of_height_stick: parseFloat(manuelMesh.height.toFixed(2)),
          length_of_width_stick: parseFloat(manuelMesh.width.toFixed(2)),
        },
        order: {
          piece: parseInt(manuelMesh.piece, 10),
          total_weight: parseFloat(manuelCalculated.totalWeight.toFixed(2)),
        },
      };
  
      addOrder(orderData);
      setShowMessage(true);
      setTimeout(() => {
        setShowMessage(false);
      }, 1500);
    }
  };

  const handleKesmeButtonClick = () => {
    openOrdersTabFromManual();
  };

  return (
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
                setIsManualChange(true);
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
          <span className="flex-1 text-sm font-semibold">Boy Çubuk Çapı:</span>
          <div className="flex-1 w-full md:w-[120px]">
            <Input
              id="noArrow"
              type="number"
              inputMode="decimal"
              value={manuelMesh.diameter[0]}
              onChange={(value) => {
                setIsManualChange(true);
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
          <span className="flex-1 text-sm font-semibold">En Çubuk Çapı:</span>
          <div className="flex-1 w-full md:w-[120px]">
            <Input
              id="noArrow"
              type="number"
              inputMode="decimal"
              value={manuelMesh.diameter[1]}
              onChange={(value) => {
                setIsManualChange(true);
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
          <span className="flex-1 text-sm font-semibold">Boy Çubuk Sayısı</span>
          <div className="flex-1 w-full md:w-[120px]">
            <Input
              id="noArrow"
              type="number"
              value={manuelMesh.numberOfSticks[0]}
              onChange={(value) => {
                setIsManualChange(true);
                setManuelMesh((prevManuelMesh) => {
                  return {
                    ...prevManuelMesh,
                    numberOfSticks: [
                      parseInt(value),
                      prevManuelMesh.numberOfSticks[1],
                    ],
                  };
                });
              }}
            />
          </div>
        </div>
        <div className="w-full flex-col md:w-auto flex justify-between items-center">
          <span className="flex-1 text-sm font-semibold">En Çubuk Sayısı:</span>
          <div className="flex-1 w-full md:w-[120px]">
            <Input
              id="noArrow"
              type="number"
              value={manuelMesh.numberOfSticks[1]}
              onChange={(value) => {
                setIsManualChange(true);
                setManuelMesh((prevManuelMesh) => {
                  return {
                    ...prevManuelMesh,
                    numberOfSticks: [
                      prevManuelMesh.numberOfSticks[0],
                      parseInt(value),
                    ],
                  };
                });
              }}
            />
          </div>
        </div>

        <div className="w-full flex-col md:w-auto flex justify-between items-center">
          <span className="flex-1 text-sm font-semibold">Ön Filiz Boyu:</span>
          <div className="flex-1 w-full md:w-[120px]">
            <Input
              id="noArrow"
              type="number"
              inputMode="decimal"
              value={manuelMesh.frontFilament}
              onChange={(value) => {
                setIsManualChange(true);
                setManuelMesh((manuelMesh) => ({
                  ...manuelMesh,
                  frontFilament: parseFloat(value),
                }));
              }}
            />
          </div>
        </div>
        <div className="w-full flex-col md:w-auto flex justify-between items-center">
          <span className="flex-1 text-sm font-semibold">Arka Filiz Boyu:</span>
          <div className="flex-1 w-full md:w-[120px]">
            <Input
              id="noArrow"
              type="number"
              inputMode="decimal"
              value={manuelMesh.backFilament}
              onChange={(value) => {
                setIsManualChange(true);
                setManuelMesh((manuelMesh) => ({
                  ...manuelMesh,
                  backFilament: parseFloat(value),
                }));
              }}
            />
          </div>
        </div>
        <div className="w-full flex-col md:w-auto flex justify-between items-center">
          <span className="flex-1 text-sm font-semibold">Sol Filiz Boyu:</span>
          <div className="flex-1 w-full md:w-[120px]">
            <Input
              id="noArrow"
              type="number"
              inputMode="decimal"
              value={manuelMesh.rightFilament}
              onChange={(value) => {
                setIsManualChange(true);
                setManuelMesh((manuelMesh) => ({
                  ...manuelMesh,
                  rightFilament: parseFloat(value),
                }));
              }}
            />
          </div>
        </div>
        <div className="w-full flex-col md:w-auto flex justify-between items-center">
          <span className="flex-1 text-sm font-semibold">Sağ Filiz Boyu:</span>
          <div className="flex-1 w-full md:w-[120px]">
            <Input
              id="noArrow"
              type="number"
              inputMode="decimal"
              value={manuelMesh.leftFilament}
              onChange={(value) => {
                setIsManualChange(true);
                setManuelMesh((manuelMesh) => ({
                  ...manuelMesh,
                  leftFilament: parseFloat(value),
                }));
              }}
            />
          </div>
        </div>
        <div className="w-full flex-col md:w-auto flex justify-between items-center">
          <span className="flex-1 text-sm font-semibold">Sipariş Adedi:</span>
          <div className="flex-1 w-full md:w-[120px]">
            <Input
              id="noArrow"
              type="number"
              value={manuelMesh.piece}
              onChange={(value) => {
                setIsManualChange(true);
                setManuelMesh((manuelMesh) => ({
                  ...manuelMesh,
                  piece: parseInt(value),
                }));
              }}
            />
          </div>
        </div>
      </div>
      <div className="flex  xl:mt-2">
       <SiparisButtonForManuelTab isButtonDisabled={isButtonDisabled} openKesmeTab={handleKesmeButtonClick} />
      </div>
    </div>
  );
};

export default ManuelMeshForm;
