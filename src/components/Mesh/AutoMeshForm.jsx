import Select from "../Select";
import Input from "../Input";
import { initialValues, meshTypeOptions } from "../../contants/meshValues";
import meshFeatures from "../../contants/meshFeatures";
import { useAddOrderMutation } from "../../store/reducers/kesme";
import SiparisButton from "../Buttons/SiparisButton";
import React, { useState } from "react";
import * as XLSX from "xlsx";

const AutoMeshForm = ({
  mesh,
  setCalculated,
  setMesh,
  calculated,
  setShowMessage,
  filamentError,
  setFilamentError,
}) => {
  const isButtonDisabled =
    !mesh.type ||
    !mesh.code ||
    !mesh.name ||
    !mesh.height ||
    !mesh.width ||
    !mesh.piece ||
    filamentError;

  const [addOrder, { isLoading: addOrderIsLoading, isError: addOrderIsError }] =
    useAddOrderMutation({
      onError: (error) => {
        console.error("An error occurred in myData query:", error);
      },
    });

  console.log("autoMeshForm daki calculated şu", calculated);

  

  // Function to opnen "KESME" tab

  const openOrdersTab = () => {
    if (!isButtonDisabled) {
      const orderData = {
        information: {
          mesh_type: mesh.type,
          mesh_code: mesh.code,
          mesh_name: mesh.name,
        },
        stick: {
          height_diameter: parseFloat(calculated.diameter[0].toFixed(2)),
          width_diameter: parseFloat(calculated.diameter[1].toFixed(2)),
          height_apertureSize: parseFloat(
            calculated.apertureSize[0].toFixed(2)
          ),
          width_apertureSize: parseFloat(calculated.apertureSize[1].toFixed(2)),
          back_filament: parseFloat(calculated.backFilament.toFixed(2)),
          front_filament: parseFloat(calculated.frontFilament.toFixed(2)),
          left_filament: parseFloat(calculated.leftFilament.toFixed(2)),
          right_filament: parseFloat(calculated.rightFilament.toFixed(2)),
        },
        mesh: {
          height_number_of_sticks: parseFloat(
            calculated.numberOfSticks[0].toFixed(2)
          ),
          width_number_of_sticks: parseFloat(
            calculated.numberOfSticks[1].toFixed(2)
          ),
          unit_mesh_weight: parseFloat(calculated.unitMeshWeight.toFixed(2)),
          length_of_height_stick: parseFloat(mesh.height.toFixed(2)),
          length_of_width_stick: parseFloat(mesh.width.toFixed(2)),
        },
        order: {
          piece: parseInt(mesh.piece, 10),
          total_weight: parseFloat(calculated.totalWeight.toFixed(2)),
        },
      };

      addOrder(orderData);
      setShowMessage(true);
      setTimeout(() => {
        setShowMessage(false);
      }, 1500);
    }
  };

  const handleTypeChange = (value) => {
    setMesh((prevMesh) => {
      if (value === "P") {
        return { ...prevMesh, type: value, code: "Q" };
      } else {
        return { ...prevMesh, type: value };
      }
    });
  };

  const handleKesmeButtonClick = () => {
    openOrdersTab();
  };

  return (
    <div className="flex flex-col xl:flex-row xl:items-end items-center gap-2  justify-center">
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
              <Select
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
      
      <div className="flex xl:-mt-2">
        <SiparisButton
          isButtonDisabled={isButtonDisabled}
          openKesmeTab={handleKesmeButtonClick}
        />
      </div>
    </div>
  );
};

export default AutoMeshForm;
