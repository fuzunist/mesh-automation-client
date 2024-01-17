import Select from "../Select";
import Input from "../Input";
import { initialValues, meshTypeOptions } from "../../contants/meshValues";
import meshFeatures from "../../contants/meshFeatures";
import { useAddOrderMutation } from "../../store/reducers/kesme";
import SiparisButton from "../Buttons/SiparisButton";
import React, { useState, useEffect } from "react";
import * as XLSX from "xlsx";
import { useUpdateOrderMutation } from "../../store/reducers/kesme";
import {
  variable_1,
  variable_2,
  variable_3,
  variable_4,
} from "../../contants/meshVariables";
import UpdateOrderSuccessModal from "../UpdateOrderSuccessModal";


const AutoMeshForm = ({
  editingMeshData,
  clearEditingMeshData,
  mesh,
  setCalculated,
  setMesh,
  calculated,
  setShowMessage,
  filamentError,
  setFilamentError,
}) => {
  useEffect(() => {
    if (editingMeshData && Object.keys(editingMeshData).length > 0) {
      setMesh({
        type: editingMeshData.type,
        code: editingMeshData.code,
        name: editingMeshData.name,
        height: editingMeshData.height,
        width: editingMeshData.width,
        piece: editingMeshData.piece,
        numberOfHeightBars: editingMeshData.numberOfHeightBars,
        numberOfWidthBars: editingMeshData.numberOfWidthBars,
      });
    }
  }, [editingMeshData, setMesh]);

  const [showUpdateOrderSuccessModal, setShowUpdateOrderSuccessModal] = useState(false);
  const [updateStatus, setUpdateStatus] = useState(null);
  const [updateMessage, setUpdateMessage] = useState('');



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

  const [
    updateOrder,
    { isLoading: updateOrderIsLoading, isError: updateOrderIsError },
  ] = useUpdateOrderMutation({
    onError: (error) => {
      console.error("An error occurred in myData query:", error);
    },
  });

  console.log("autoMeshForm daki calculated şu", calculated);

  const buttonText =
    editingMeshData && Object.keys(editingMeshData).length > 0
      ? "Düzenlenen Siparişi Güncelle"
      : "Siparişe Gönder";

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
      console.log("eklemeden önce orderData:", orderData);
      addOrder(orderData);
      setShowMessage(true);
      setTimeout(() => {
        setShowMessage(false);
      }, 1500);
      clearEditingMeshData(); // Clear the editingMeshData after submission
    }
  };

  const calculateCalculatedValues = (meshData) => {
    const defaultCalculated = {
      diameter: [4.5, 4.5],
      apertureSize: [15, 5],
      numberOfSticks: [0, 0],
      frontFilament: 0,
      backFilament: 0,
      leftFilament: 0,
      rightFilament: 0,
      totalHeigthWeight: 0,
      totalWidthWeight: 0,
      unitMeshWeight: 0,
      unitOfHeigthWeight: 0.7703774235224721,
      unitOfWidthWeight: 0.331262292114663,
    };

    console.log("calculateCalculatedValues called with meshData:", meshData);

    if (
      !meshData.type ||
      !meshData.code ||
      !meshData.name ||
      !meshData.height ||
      !meshData.width ||
      !meshData.piece
    ) {
      console.error("All mesh fields must be filled.");
      return null;
    }

    if (
      !meshFeatures[meshData.code] ||
      !meshFeatures[meshData.code][meshData.name]
    ) {
      console.error("Please select a valid mesh name.");
      return null;
    }

    const selectedMeshFeature = meshFeatures[meshData.code][meshData.name];

    if (!selectedMeshFeature.diameter) {
      console.error("Diameter information not found for the selected mesh.");
      return null;
    }

    const result = { ...defaultCalculated };

    console.log("selectedMeshFeature value", selectedMeshFeature);
    console.log("result value", result);
    console.log("selectedMeshFeature değeri", selectedMeshFeature);

    if (selectedMeshFeature && selectedMeshFeature.diameter) {
      result.diameter[0] = selectedMeshFeature.diameter.height;
      result.diameter[1] = selectedMeshFeature.diameter.width;
    }

    console.log("diameter den geçmiş result value", result);

    if (selectedMeshFeature && selectedMeshFeature.apertureSize) {
      result.apertureSize[0] = selectedMeshFeature.apertureSize.height / 10;
      result.apertureSize[1] = selectedMeshFeature.apertureSize.width / 10;
    }

    console.log("aperturesize dan geçmişresult value", result);

    if (meshData.type === "Çit Hasırı") {
      result.apertureSize[0] = 15;
      result.apertureSize[1] = 5;
    }

    console.log("çit hasırından geçmiş result value", result);

    if (variable_1(meshData)) {
      result.numberOfSticks[0] = 0;
      result.numberOfSticks[1] = 0;
      result.backFilament = 10;
      result.leftFilament = 2.5;
      result.rightFilament = 2.5;
    } else {
      if (meshData.height === 500 && meshData.width === 215) {
        result.numberOfSticks[1] =
          meshData.height % result.apertureSize[1] === 0
            ? meshData.height / result.apertureSize[1] +
              meshData.numberOfWidthBars
            : Math.floor(meshData.height / result.apertureSize[1] - 1) +
              meshData.numberOfWidthBars;
        result.numberOfSticks[0] =
          meshData.width % result.apertureSize[0] === 0
            ? meshData.width / result.apertureSize[0] +
              1 +
              meshData.numberOfHeightBars
            : Math.floor(meshData.width / result.apertureSize[0] + 1) +
              meshData.numberOfHeightBars;
      } else {
        result.numberOfSticks[0] =
          Math.ceil(meshData.width / result.apertureSize[0]) +
          meshData.numberOfHeightBars;
        result.numberOfSticks[1] =
          Math.ceil(meshData.height / result.apertureSize[1]) +
          meshData.numberOfWidthBars;
      }

      result.backFilament =
        (meshData.height -
          (result.numberOfSticks[1] - 1) * result.apertureSize[1]) /
        2;
      result.leftFilament =
        (meshData.width -
          (result.numberOfSticks[0] - 1) * result.apertureSize[0]) /
        2;
      result.rightFilament = result.leftFilament;
    }

    console.log("ilk if bloğundan geçmiş result value", result);

    if (variable_2(meshData)) result.frontFilament = 70;
    else if (variable_3(meshData)) result.frontFilament = 71;
    else if (variable_4(meshData)) result.frontFilament = 65;
    else
      result.frontFilament =
        (meshData.height -
          (result.numberOfSticks[1] - 1) * result.apertureSize[1]) /
        2;

    console.log("ikinci if bloğundan result value", result);

    if (variable_1(meshData)) {
      result.numberOfSticks[0] = Math.floor(
        (meshData.width - result.leftFilament - result.rightFilament) /
          result.apertureSize[0] +
          1
      );
      result.numberOfSticks[1] = Math.floor(
        (meshData.height - result.backFilament - result.frontFilament) /
          result.apertureSize[1] +
          1
      );
    }

    result.unitOfHeigthWeight =
      (((Math.PI * result.diameter[0] * result.diameter[0]) / 4) *
        0.007847 *
        meshData.height) /
      100;
    result.unitOfWidthWeight =
      (((Math.PI * result.diameter[1] * result.diameter[1]) / 4) *
        0.007847 *
        meshData.width) /
      100;
    result.totalHeigthWeight =
      result.unitOfHeigthWeight * result.numberOfSticks[0];
    result.totalWidthWeight =
      result.unitOfWidthWeight * result.numberOfSticks[1];
    result.unitMeshWeight = result.totalHeigthWeight + result.totalWidthWeight;
    result.totalWeight = result.unitMeshWeight * meshData.piece;

    console.log("bastırmadan önce  result value", result);

    console.log("Calculated values:", result);

    return result;
  };

  const findCalculatedValuesAndUpdateOrder = async (
    meshData,
    editingMeshData
  ) => {
    try {
      const order_id = editingMeshData.which_row_to_update;
      console.log("işte bizim order_id:", order_id);
      const editingMeshDataWitoutOrderId = {
        ...editingMeshData,
        which_row_to_update: undefined,
      };
      setUpdateMessage('Sipariş Güncelleniyor...'); // Display the updating message

      const calculatedValues = calculateCalculatedValues(meshData);
      if (!calculatedValues) {
        throw new Error("Failed to calculate values.");
      }
      await updateSelectedOrder(order_id, meshData, calculatedValues);
      setUpdateMessage(''); // Clear the message
      setShowUpdateOrderSuccessModal(true); // Show modal on success

    } catch (error) {
      console.error("Error in handleOpenOrdersWithCalculatedValues:", error);
      setUpdateMessage(''); // Clear the message

      // Handle the error appropriately (e.g., show a notification to the user)
    }
  };

  const updateSelectedOrder = async (order_id, meshData, calculatedValues) => {
    console.log("işte updateSelectedOrder daki order_id", order_id);
    return new Promise((resolve, reject) => {
      if (!isButtonDisabled) {
        const orderData = {
          information: {
            mesh_type: meshData.type,
            mesh_code: meshData.code,
            mesh_name: meshData.name,
          },
          stick: {
            height_diameter: parseFloat(
              calculatedValues.diameter[0].toFixed(2)
            ),
            width_diameter: parseFloat(calculatedValues.diameter[1].toFixed(2)),
            height_apertureSize: parseFloat(
              calculatedValues.apertureSize[0].toFixed(2)
            ),
            width_apertureSize: parseFloat(
              calculatedValues.apertureSize[1].toFixed(2)
            ),
            back_filament: parseFloat(calculatedValues.backFilament.toFixed(2)),
            front_filament: parseFloat(
              calculatedValues.frontFilament.toFixed(2)
            ),
            left_filament: parseFloat(calculatedValues.leftFilament.toFixed(2)),
            right_filament: parseFloat(
              calculatedValues.rightFilament.toFixed(2)
            ),
          },
          mesh: {
            height_number_of_sticks: parseFloat(
              calculatedValues.numberOfSticks[0].toFixed(2)
            ),
            width_number_of_sticks: parseFloat(
              calculatedValues.numberOfSticks[1].toFixed(2)
            ),
            unit_mesh_weight: parseFloat(
              calculatedValues.unitMeshWeight.toFixed(2)
            ),
            length_of_height_stick: parseFloat(meshData.height),
            length_of_width_stick: parseFloat(meshData.width),
          },
          order: {
            piece: parseInt(meshData.piece, 10),
            total_weight: parseFloat(calculatedValues.totalWeight.toFixed(2)),
          },
        };

        console.log("güncellemeden önce orderData", orderData);
        updateOrder({ order_id, orderData });
        // setShowMessage(true);
        setTimeout(() => {
          //   setShowMessage(false);
          resolve(); // Resolve the promise after the timeout
        }, 1500);
      } else {
        resolve(); // Resolve immediately if the button is disabled
      }
    });
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

  const handleButtonClick = () => {
    if (buttonText === "Düzenlenen Siparişi Güncelle") {
      findCalculatedValuesAndUpdateOrder(mesh, editingMeshData);
    } else {
      openOrdersTab();
    }
  };

  const resetForm = () => {
    clearEditingMeshData(); 
    // Resetting the mesh state to its initial values from 'initialValues.mesh'
    setMesh(initialValues.mesh);
  
    // Reset any other states that you might need to reset
    setFilamentError('');
    setUpdateStatus(null); 
  
    // Close the modal
    setShowUpdateOrderSuccessModal(false);
    clearEditingMeshData(); 
  };

  console.log("Current mesh.code:", mesh.code);
  console.log("meshFeatures for current mesh.code:", meshFeatures[mesh.code]);

  return (
    <div className="flex flex-col xl:flex-col xl:items-center items-center gap-2 justify-center">
    {buttonText === "Düzenlenen Siparişi Güncelle" && (
        <div
          className="text-center text-md font-normal p-2 rounded mb-4 bg-red-200 text-red-900"
          style={{ minHeight: "20px" }}
        >
          Şu an mevcut bir siparişi değiştirmektesiniz.
        </div>
      )}

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
              onChange={(value) => {
                console.log(
                  "Mesh Code bölümündeki meshFeatures:",
                  meshFeatures
                ); // Add this line
                setMesh((prevMesh) => ({ ...prevMesh, code: value }));
              }}
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
                console.log(
                  "Selected mesh.code:",
                  mesh.code,
                  "Corresponding meshFeatures:",
                  meshFeatures[mesh.code]
                );
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

      <div className="flex flex-col items-center xl:mt-2">
        <SiparisButton
          isButtonDisabled={isButtonDisabled}
          openKesmeTab={handleButtonClick}
          buttonText={buttonText}
        />
                {updateMessage && <div className="text-center text-lg font-normal p-2 mt-2 text-black-900">{updateMessage}</div>} {/* Display update message here */}

      </div>
      <UpdateOrderSuccessModal
        show={showUpdateOrderSuccessModal}
        onClose={resetForm}
      />
    </div>
  );
};

export default AutoMeshForm;
