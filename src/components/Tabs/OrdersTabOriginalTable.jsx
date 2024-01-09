import { useState, useEffect } from "react";
import {
  useGetAllOrderQuery,
  useDeleteOrderMutation,
  useDeleteAllOrderMutation,
} from "../../store/reducers/kesme";
import {
  printTable,
  toggleSort,
  optimizeMeshProductionBasic,
} from "@/utils/kesmeHelpers";
import Modal from "@/components/Modal";
import KesmeButton from "../Buttons/KesmeButton";
import { useAddKesmeMutation } from "../../store/reducers/kesme";
import ModalRowDeletion from "@/components/ModalRowDeletion";
import SiparisButton from "../Buttons/SiparisButton";
import * as XLSX from "xlsx";
import React from "react";
import { useAddOrderMutation } from "../../store/reducers/kesme";

import meshFeatures from "../../contants/meshFeatures";
import {
  variable_1,
  variable_2,
  variable_3,
  variable_4,
} from "../../contants/meshVariables";
import { initialValues, meshTypeOptions } from "../../contants/meshValues";

const OrdersTabOriginalTable = ({}) => {
  const [isPrinting, setIsPrinting] = useState(false);
  const [isTableSmall, setIsTableSmall] = useState(false);
  const [sortedOrderList, setSortedOrderList] = useState([]);
  const [checkedOrders, setCheckedOrders] = useState({});
  const [showCheckboxes, setShowCheckboxes] = useState(false);
  const [selectedMeshName, setSelectedMeshName] = useState(null);
  const [lastCheckedOrderId, setLastCheckedOrderId] = useState(null);
  const [checkedCount, setCheckedCount] = useState(0);
  const [optimizedWidthSticks, setOptimizedWidthSticks] = useState([]);
  const [extraWidthLengthUsed, setExtraWidthLengthUsed] = useState(null);
  const [optimizedWidthOrderList, setOptimizedWidthOrderList] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [historyStack, setHistoryStack] = useState([]);
  const [applyColorChange, setApplyColorChange] = useState(false);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [idToDelete, setIdToDelete] = useState(null);
  const [totalWeight, setTotalWeight] = useState(0);
  const [isButtonDisabled, setIsButtonDisabled] =
    useState(/* default disabled state */);
  const [calculatedCalculated, setCalculatedCalculated] = useState(
    initialValues.calculated
  );
  const [selectedFileName, setSelectedFileName] = useState("");

  console.log(
    "ordersTabOriginalTable daki calculated değeri şudur",
    calculatedCalculated
  );

  const {
    data: orderList,
    isLoading,
    isError,
  } = useGetAllOrderQuery("orders", {
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

  const [deleteOrder, { isLoading: orderIsLoading, isError: orderIsError }] =
    useDeleteOrderMutation({
      onError: (error) => {
        console.error("An error occurred in myData query:", error);
      },
    });

  const [
    deleteAllOrder,
    { isLoading: allOrderIsLoading, isError: allOrderIsError },
  ] = useDeleteAllOrderMutation({
    onError: (error) => {
      console.error("An error occurred in myData query:", error);
    },
  });

  const handleDeleteAllOrder = () => {
    deleteAllOrder();
  };

  const handleDeleteOrder = (order_id) => {
    deleteOrder(order_id);
  };

  const toggleTableSize = () => {
    setIsTableSmall(!isTableSmall);
  };

  useEffect(() => {
    setSortedOrderList(orderList); // Initialize sortedOrderList with orderList
  }, [orderList]);

  useEffect(() => {
    if (
      (isTableSmall ? sortedOrderList : orderList) &&
      (isTableSmall ? sortedOrderList.length : orderList.length)
    ) {
      const sum = (isTableSmall ? sortedOrderList : orderList).reduce(
        (acc, order) => {
          // Check if the nested properties exist
          if (
            order.order_details &&
            order.order_details.order &&
            order.order_details.order.total_weight
          ) {
            return (
              acc + (parseFloat(order.order_details.order.total_weight) || 0)
            );
          }
          return acc;
        },
        0
      );
      setTotalWeight(sum);
    }
  }, [orderList, sortedOrderList, isTableSmall]);

  const handleSortByHeightStick = (orderListParam) => {
    setApplyColorChange(true);
    // Determine the list to sort - use provided list or the current version
    const listToSort = Array.isArray(orderListParam)
      ? orderListParam
      : historyStack.length > 0
      ? historyStack[historyStack.length - 1]
      : Array.isArray(sortedOrderList)
      ? sortedOrderList
      : [];

    const sortedData = [...listToSort].sort((a, b) => {
      const meshNameA = parseInt(
        a.order_details.information.mesh_name.split("/")[0],
        10
      );
      const meshNameB = parseInt(
        b.order_details.information.mesh_name.split("/")[0],
        10
      );

      if (meshNameA !== meshNameB) {
        return meshNameA - meshNameB;
      }

      if (
        a.order_details.mesh.length_of_height_stick !==
        b.order_details.mesh.length_of_height_stick
      ) {
        return (
          a.order_details.mesh.length_of_height_stick -
          b.order_details.mesh.length_of_height_stick
        );
      }

      if (
        a.order_details.stick.front_filament !==
        b.order_details.stick.front_filament
      ) {
        return (
          a.order_details.stick.front_filament -
          b.order_details.stick.front_filament
        );
      }

      // New sorting condition for length_of_width_stick
      return (
        a.order_details.mesh.length_of_width_stick -
        b.order_details.mesh.length_of_width_stick
      );
    });

    setSortedOrderList(sortedData);
    setShowCheckboxes(true);
    setSelectedMeshName(null);
    setCheckedOrders({});
    return sortedData;
  };

  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedFileName(file.name);
      // Existing file processing logic
      handleFileUpload(event); // Call your existing file upload handler
    }
  };

  // Custom button click handler to trigger file input
  const handleFileButtonClick = () => {
    document.getElementById("fileInput").click();
  };

  const handleCheckboxChange = (order, orderId) => {
    setCheckedOrders((prevState) => {
      const isCurrentlyChecked = !prevState[orderId];
      let newCheckedOrders = { ...prevState, [orderId]: isCurrentlyChecked };

      // Check if the first-clicked checkbox is being unchecked
      if (orderId === prevState.firstClickedId && !isCurrentlyChecked) {
        // Determine if any other checkboxes in the same group are checked
        const anyOtherCheckedInGroup = Object.keys(prevState).some((id) => {
          return (
            id !== prevState.firstClickedId &&
            prevState[id] &&
            sortedOrderList.some((item) => {
              return (
                id === item.id &&
                item.order_details.information.mesh_name ===
                  order.information.mesh_name &&
                item.order_details.mesh.length_of_height_stick ===
                  order.mesh.length_of_height_stick &&
                item.order_details.stick.front_filament ===
                  order.stick.front_filament
              );
            })
          );
        });

        // If any other checkboxes in the group are checked, prevent unchecking the first-clicked checkbox
        if (anyOtherCheckedInGroup) {
          return prevState; // Do not change the state
        }
      }

      // Update the checkbox state
      newCheckedOrders[orderId] = isCurrentlyChecked;

      // Define current selection criteria
      const currentSelectionCriteria = {
        meshName: order.information.mesh_name,
        heightStick: order.mesh.length_of_height_stick,
        frontFilament: order.stick.front_filament,
        baseWidthStick: selectedMeshName?.baseWidthStick,
        firstClickedId: selectedMeshName?.firstClickedId,
      };

      // Handling first click
      if (isCurrentlyChecked && Object.keys(prevState).length === 0) {
        currentSelectionCriteria.baseWidthStick =
          order.mesh.length_of_width_stick / 2;
        currentSelectionCriteria.firstClickedId = orderId;
      }

      // Update criteria when a checkbox is checked
      if (isCurrentlyChecked) {
        setSelectedMeshName(currentSelectionCriteria);
      } else {
        // Check if any checkboxes in the group are still checked
        const anyCheckedInGroup = sortedOrderList.some((item) => {
          return (
            item.order_details.information.mesh_name ===
              currentSelectionCriteria.meshName &&
            item.order_details.mesh.length_of_height_stick ===
              currentSelectionCriteria.heightStick &&
            item.order_details.stick.front_filament ===
              currentSelectionCriteria.frontFilament &&
            newCheckedOrders[item.id]
          );
        });

        // Reset if no checkboxes in the group are checked
        if (!anyCheckedInGroup) {
          setSelectedMeshName(null);
          newCheckedOrders = {}; // Reset all checkboxes
        }
      }

      if (isCurrentlyChecked) {
        setLastCheckedOrderId(orderId);
      } else if (orderId === lastCheckedOrderId) {
        // Find the new last checked order ID if the current last one is being unchecked
        const remainingCheckedIds = Object.keys(newCheckedOrders).filter(
          (id) => newCheckedOrders[id]
        );
        const newLastCheckedOrderId =
          remainingCheckedIds[remainingCheckedIds.length - 1] || null;
        setLastCheckedOrderId(newLastCheckedOrderId);
      }

      // Update the checked count
      const newCount = Object.values(newCheckedOrders).filter(Boolean).length;
      setCheckedCount(newCount);

      // Update the last checked order ID
      if (isCurrentlyChecked) {
        setLastCheckedOrderId(orderId);
      }

      return newCheckedOrders;
    });
  };

  const handleBirlestir = () => {
    if (orderList && orderList.length > 0) {
      console.log("Raw orderList:", orderList);

      const checkedOrdersList = orderList.filter(
        (order) => checkedOrders[order.id]
      );
      const orders = checkedOrdersList.map((order) => {
        const lengthOfWidthStick =
          order.order_details.mesh.length_of_width_stick;
        const piece = order.order_details.order.piece;

        if (lengthOfWidthStick !== undefined && piece !== undefined) {
          return [parseInt(lengthOfWidthStick, 10), piece];
        } else {
          return [0, 0];
        }
      });

      // Store initial values before optimization
      setInitialValues(orders);

      const optimized = optimizeMeshProductionBasic(orders);
      setOptimizedWidthSticks(optimized.optimizedOrders);
      setExtraWidthLengthUsed(optimized.extraLengthUsed);

      const updatedOrderList = optimized.optimizedOrders.map((opt, index) => ({
        order_details: {
          mesh: {
            length_of_width_stick: opt[0],
          },
          order: {
            piece: opt[1],
          },
        },
        id: checkedOrdersList[index].id,
      }));

      setOptimizedWidthOrderList(updatedOrderList); // Update the modified order list
    }
    setShowModal(true);
  };

  useEffect(() => {
    if (orderList && !historyStack.length) {
      // Initialize historyStack with the raw orderList as Version 0
      setHistoryStack([orderList]);
    }
    // Initialize sortedOrderList with orderList or the latest from historyStack
    setSortedOrderList(
      historyStack.length ? historyStack[historyStack.length - 1] : orderList
    );
  }, [orderList]);

  const handleConfirmation = () => {
    console.log("handleConfirmation called");

    // Extract the updated values from optimizedWidthSticks
    const [updatedLength, updatedQuantity] = optimizedWidthSticks[0];
    console.log(
      `Updated Length: ${updatedLength}, Updated Quantity: ${updatedQuantity}`
    );

    // Find the ID of the first selected order
    const firstSelectedOrderId = Number(
      Object.keys(checkedOrders).find((id) => checkedOrders[id])
    );
    console.log(`First Selected Order ID: ${firstSelectedOrderId}`);

    // Determine the current version of the table to work with
    const currentVersion =
      historyStack.length > 0
        ? historyStack[historyStack.length - 1]
        : sortedOrderList;

    // Map through the current version of the orders and update the first selected order
    const newOrderList = currentVersion
      .map((order) => {
        if (order.id === firstSelectedOrderId) {
          // Update the first selected order with the new values
          return {
            ...order,
            order_details: {
              ...order.order_details,
              mesh: {
                ...order.order_details.mesh,
                length_of_width_stick: updatedLength,
              },
              order: {
                ...order.order_details.order,
                piece: updatedQuantity,
              },
            },
          };
        }
        return order;
      })
      .filter(
        (order) => !checkedOrders[order.id] || order.id === firstSelectedOrderId
      );

    // Log the current version before update
    console.log("Current version before update:", currentVersion);

    // Update the state with the new orders array, effectively creating the new version
    setSortedOrderList(newOrderList);

    // Update the history stack
    // Make sure to push the new version onto a copy of the historyStack
    setHistoryStack((prevHistory) => {
      const newHistory = [...prevHistory];

      // Only push the new version if it's different from the last one
      if (
        !prevHistory.length ||
        prevHistory[prevHistory.length - 1] !== newOrderList
      ) {
        newHistory.push(newOrderList);
      }

      // Automatically sort the table after merging
      const sortedNewOrderList = handleSortByHeightStick(newOrderList);
      if (sortedNewOrderList) {
        // Replace the last unsorted version with the sorted one
        newHistory[newHistory.length - 1] = sortedNewOrderList;
      }

      // Log the versions after update
      console.log(
        `Version ${newHistory.length - 1}:`,
        newHistory[newHistory.length - 2]
      );
      console.log(
        `Version ${newHistory.length}:`,
        newHistory[newHistory.length - 1]
      );
      return newHistory;
    });

    // Reset the states to allow new selections for merging
    setCheckedOrders({});
    setSelectedMeshName(null);
    setLastCheckedOrderId(null);
    setCheckedCount(0);
    setOptimizedWidthSticks([]);
    setExtraWidthLengthUsed(null);
    setOptimizedWidthOrderList([]);

    // Automatically sort the table after merging
    handleSortByHeightStick(newOrderList);

    // Close the modal
    setShowModal(false);
  };

  const handleUndo = () => {
    setHistoryStack((prevHistory) => {
      if (prevHistory.length === 0) {
        console.log("No previous version to revert to.");
        return prevHistory;
      }
      // Remove the last state from the stack and use it to revert the list
      const lastVersion = prevHistory[prevHistory.length - 1];
      setSortedOrderList(lastVersion);
      // Return the new history without the last state
      return prevHistory.slice(0, prevHistory.length - 1);
    });
  };

  const [addKesme, { isLoading: addKesmeIsLoading, isError: addKesmeIsError }] =
    useAddKesmeMutation({
      onError: (error) => {
        console.error("An error occurred in myData query:", error);
      },
    });

  const handleKesmeButtonClick = () => {
    const currentVersion =
      historyStack.length > 0
        ? historyStack[historyStack.length - 1]
        : sortedOrderList;

    if (currentVersion.length === 0) {
      console.log("No orders to process.");
      return;
    }

    currentVersion.forEach((order) => {
      const kesmeData = {
        height_stick: {
          diameter: order.order_details.stick.height_diameter, // Assuming these values are directly accessible
          height: order.order_details.mesh.length_of_height_stick,
          number_of_sticks: order.order_details.mesh.height_number_of_sticks,
          total_height_weight: order.order_details.mesh.unit_mesh_weight, // Assuming you have this info in your order details
        },
        width_stick: {
          diameter: order.order_details.stick.width_diameter,
          height: order.order_details.mesh.length_of_width_stick,
          number_of_sticks: order.order_details.mesh.width_number_of_sticks,
          total_width_weight: order.order_details.mesh.unit_mesh_weight, // Update this field as per your requirement
        },
      };

      // Call addKesme for each order
      addKesme(kesmeData);
    });

    setShowMessage(true);
    setTimeout(() => {
      setShowMessage(false);
    }, 1500);
  };

  const handleShrinkAndSortTable = () => {
    if (!isTableSmall) {
      toggleTableSize(); // Only shrink if the table is not already small
    }
    handleSortByHeightStick();
  };

  const confirmDelete = (order_id) => {
    setShowDeleteConfirmation(true);
    setIdToDelete(order_id);
  };

  const deleteConfirmed = () => {
    if (idToDelete !== null) {
      handleDeleteOrder(idToDelete);
      setShowDeleteConfirmation(false);
      setIdToDelete(null);
    }
  };

  const openOrdersTab = (meshData, calculatedValues) => {
    if (!isButtonDisabled) {
      const orderData = {
        information: {
          mesh_type: meshData.type,
          mesh_code: meshData.code,

          mesh_name: meshData.name,
        },
        stick: {
          height_diameter: parseFloat(calculatedValues.diameter[0].toFixed(2)),
          width_diameter: parseFloat(calculatedValues.diameter[1].toFixed(2)),
          height_apertureSize: parseFloat(
            calculatedValues.apertureSize[0].toFixed(2)
          ),
          width_apertureSize: parseFloat(
            calculatedValues.apertureSize[1].toFixed(2)
          ),
          back_filament: parseFloat(calculatedValues.backFilament.toFixed(2)),
          front_filament: parseFloat(calculatedValues.frontFilament.toFixed(2)),
          left_filament: parseFloat(calculatedValues.leftFilament.toFixed(2)),
          right_filament: parseFloat(calculatedValues.rightFilament.toFixed(2)),
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

      addOrder(orderData);
      setShowMessage(true);
      setTimeout(() => {
        setShowMessage(false);
      }, 1500);
    }
  };

  // Define the function to update the state with the mesh data

  const updateMesh = (newMeshData) => {
    setMesh((prevMesh) => ({
      ...prevMesh,
      ...newMeshData,
    }));
  };

  const handleSendOrder = () => {
    console.log("Order submitted:", mesh);
  };

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    const reader = new FileReader();
    reader.onload = async (e) => {
      const data = new Uint8Array(e.target.result);
      const workbook = XLSX.read(data, { type: "array" });
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      const json = XLSX.utils.sheet_to_json(worksheet);

      for (const row of json) {
        console.log("Original Hasır Adı:", row["Hasır Adı"]);
        // Check and transform 'Hasır Adı' if it contains pairs of numbers
        if (row["Hasır Adı"] && /[-_,. ]/.test(row["Hasır Adı"])) {
          row["Hasır Adı"] = row["Hasır Adı"]
            .toString()
            .replace(/[-_,. ]+/g, "/");

          console.log("Transformed Hasır Adı:", row["Hasır Adı"]);
        }

        const meshData = {
          type: row["Hasır Tipi"],
          code: row["Hasır Kodu"],
          name: row["Hasır Adı"],
          height: row["Hasır Boyu"],
          width: row["Hasır Eni"],
          numberOfHeightBars: 0,
          numberOfWidthBars: 0,
          piece: row["Sipariş Adedi"],
          // Add other necessary fields from the row
        };

        // Calculate the 'calculated' values based on 'meshData'
        const calculatedValues = calculateCalculatedValues(meshData); // Implement this function

        try {
          await openOrdersTab(meshData, calculatedValues); // Pass both meshData and calculatedValues
        } catch (error) {
          console.error("Error processing row:", error);
        }
      }
    };
    reader.readAsArrayBuffer(file);
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

  const handleDownloadTemplate = () => {
    const link = document.createElement('a');
    link.href = 'https://mesh-automation.onrender.com/public/hasir_siparis_bilgileri2.xlsx'; // Path to your template file
    link.download = 'Hasır Sipariş Bilgileri Şablonu.xlsx'; // The default filename for downloading
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <>
      <div className="flex flex-col w-full items-center">
        {!isLoading && !isError && (
          <div className="overflow-x-auto min-w-min">
            <table
              id="orderTable"
              className="w-full border-collapse border text-xs border-gray-800 text-center items-center justify-center align-middle"
            >
              <thead>
                {/* Conditional rendering based on isTableSmall */}
                {isTableSmall ? (
                  // Headers for the smaller version of the table
                  <tr>
                    
                    <th className="border p-2 font-bold text-black bg-table-blue-first-line">
                      HASIR KODU
                    </th>
                    <th className="border p-2 font-bold text-black bg-table-blue-first-line">
                      HASIR TİPİ
                    </th>
                    <th className="border p-2 font-bold text-black bg-table-blue-first-line">
                      HASIR İSMİ
                    </th>
                    <th className="border p-2 font-bold text-black bg-table-blue-first-line">
                      BOY ÇUBUK UZUNLUĞU
                    </th>
                    <th className="border p-2 font-bold text-black bg-table-blue-first-line">
                      EN ÇUBUK UZUNLUĞU
                    </th>
                    <th className="border p-2 font-bold text-black bg-table-blue-first-line">
                      ÖN FİLİZ BOYU
                    </th>
                    <th className="border p-2 font-bold text-black bg-table-blue-first-line">
                      SİPARİŞ SAYISI
                    </th>
                    {showCheckboxes && (
                      <th className="border p-2 font-bold text-black bg-table-blue-first-line">
                        SEÇ
                      </th>
                    )}{" "}
                    {/* Conditional rendering */}
                  </tr>
                ) : (
                  // Headers for the full version of the table
                  <>
                    <tr>
                    <th className="border p-2 font-bold text-black bg-gray-700">
                    
                    </th>
                      <th
                        colSpan="3"
                        className="border p-2 font-bold uppercase text-black bg-table-teal-first-line"
                      >
                        BİLGİLER
                      </th>
                      <th
                        colSpan="8"
                        className="border p-2 font-bold uppercase text-black bg-table-blue-first-line"
                      >
                        ÇUBUK
                      </th>
                      <th
                        colSpan="5"
                        className="border p-2 font-bold uppercase text-black bg-table-green-first-line"
                      >
                        HASIR
                      </th>
                      <th
                        colSpan="2"
                        className="border p-2 font-bold uppercase text-black bg-table-yellow-first-line"
                      >
                        SİPARİŞ
                      </th>
                      {!isPrinting && (
                        <th className="border p-2 font-bold uppercase text-black bg-red-500"></th>
                      )}
                    </tr>
                    <tr>
                    <th className="border p-2 font-bold text-black bg-gray-400">
                      
                    </th>
                    
                      <th className="border p-2 font-bold text-black bg-table-teal-second-line">
                        HASIR KODU
                      </th>
                      <th className="border p-2 font-bold text-black bg-table-teal-third-line">
                        HASIR TİPİ
                      </th>
                      <th className="border p-2 font-bold text-black bg-table-teal-second-line">
                        HASIR İSMİ
                      </th>
                      <th
                        colSpan="2"
                        className="border p-2 font-bold text-black uppercase bg-table-blue-second-line"
                      >
                        ÇAPI
                      </th>
                      <th
                        colSpan="2"
                        className="border p-2 font-bold text-black uppercase bg-table-blue-third-line"
                      >
                        ARALIĞI
                      </th>
                      <th
                        colSpan="4"
                        className="border p-2 font-bold text-black uppercase bg-table-blue-second-line"
                      >
                        FİLİZLERİ
                      </th>
                      <th
                        colSpan="2"
                        className="border p-2 font-bold text-black uppercase bg-table-green-third-line"
                      >
                        ÇUBUK SAYISI
                      </th>
                      <th
                        colSpan="2"
                        className="border p-2 font-bold text-black uppercase bg-table-green-second-line"
                      >
                        ÇUBUK UZUNLUĞU
                      </th>
                      <th
                        colSpan="1"
                        className="border p-2 font-bold text-black uppercase bg-table-green-third-line"
                      >
                        TOPLAM
                      </th>
                      <th
                        colSpan="2"
                        className="border p-2 font-bold text-black uppercase bg-table-yellow-second-line"
                      >
                        TOPLAM
                      </th>
                      {!isPrinting && (
                        <th className="border p-2 font-bold uppercase text-black bg-red-100"></th>
                      )}
                    </tr>
                    <tr className="bg-slate-50">
                    <th className="border p-2 font-bold text-black bg-gray-400">
                      No
                    </th>
                      <th className="border p-2 font-bold text-black bg-table-teal-second-line">
                        Kodu
                      </th>
                      <th className="border p-2 font-bold text-black bg-table-teal-third-line">
                        Tipi
                      </th>
                      <th className="border p-2 font-bold text-black bg-table-teal-second-line">
                        İsmi
                      </th>
                      <th className="border p-2 font-bold text-black uppercase bg-table-blue-second-line">
                        BOY
                      </th>
                      <th className="border p-2 font-bold text-black uppercase bg-table-blue-second-line">
                        EN
                      </th>
                      <th className="border p-2 font-bold text-black uppercase bg-table-blue-third-line">
                        BOY
                      </th>
                      <th className="border p-2 font-bold text-black uppercase bg-table-blue-third-line">
                        EN
                      </th>
                      <th
                        colSpan="1"
                        className="border p-2 font-bold text-black uppercase bg-table-blue-second-line"
                      >
                        ARKA
                      </th>
                      <th
                        colSpan="1"
                        className="border p-2 font-bold text-black uppercase bg-table-blue-second-line"
                      >
                        ÖN
                      </th>
                      <th
                        colSpan="1"
                        className="border p-2 font-bold text-black uppercase bg-table-blue-second-line"
                      >
                        SAĞ
                      </th>
                      <th
                        colSpan="1"
                        className="border p-2 font-bold text-black uppercase bg-table-blue-second-line"
                      >
                        SOL
                      </th>
                      <th className="border p-2 font-bold text-black uppercase bg-table-green-third-line">
                        BOY
                      </th>
                      <th className="border p-2 font-bold text-black uppercase bg-table-green-third-line">
                        EN
                      </th>
                      <th className="border p-2 font-bold text-black uppercase bg-table-green-second-line">
                        BOY
                      </th>
                      <th className="border p-2 font-bold text-black uppercase bg-table-green-second-line">
                        EN
                      </th>
                      <th
                        colSpan="1"
                        className="border p-2 font-bold text-black uppercase bg-table-green-third-line"
                      >
                        AĞIRLIK
                      </th>
                      <th
                        colSpan="1"
                        className="border p-2 font-bold text-black uppercase bg-table-yellow-second-line"
                      >
                        ADET
                      </th>
                      <th
                        colSpan="1"
                        className="border p-2 font-bold text-black uppercase bg-table-yellow-second-line"
                      >
                        AĞIRLIK
                      </th>
                      {!isPrinting && (
                        <th className="border p-2 font-bold uppercase text-black bg-red-100">
                          SATIR SİL
                        </th>
                      )}
                    </tr>
                  </>
                )}
              </thead>

              <tbody className="bg-white">
                {(() => {
                  let previousLengthOfHeightStick = null;
                  let useBlueBackground = true;
                  let bgClassMeshCode,
                    bgClassMeshType,
                    bgClassMeshName,
                    bgClassBlueSecond,
                    bgClassBlueThird,
                    bgClassYellowSecond,
                    bgClassGreenSecond,
                    bgClassGreenThird;

                  return (isTableSmall ? sortedOrderList : orderList).map(
                    ({ order_details: order, id: order_id }, index) => {
                      if (applyColorChange) {
                        if (
                          previousLengthOfHeightStick !== null &&
                          previousLengthOfHeightStick !==
                            order.mesh.length_of_height_stick
                        ) {
                          useBlueBackground = !useBlueBackground;
                        }
                        previousLengthOfHeightStick =
                          order.mesh.length_of_height_stick;

                        let dynamicBgClass = useBlueBackground
                          ? "bg-table-blue-second-line"
                          : "bg-table-yellow-second-line";
                        bgClassMeshCode = dynamicBgClass;
                        bgClassMeshType = dynamicBgClass;
                        bgClassMeshName = dynamicBgClass;
                        bgClassBlueSecond = dynamicBgClass;
                        bgClassBlueThird = dynamicBgClass;
                        bgClassYellowSecond = dynamicBgClass;
                        bgClassGreenSecond = dynamicBgClass;
                        bgClassGreenThird = dynamicBgClass;
                      } else {
                        bgClassMeshCode = "bg-table-teal-second-line";
                        bgClassMeshType = "bg-table-teal-third-line";
                        bgClassMeshName = "bg-table-teal-second-line";
                        bgClassBlueSecond = "bg-table-blue-second-line";
                        bgClassBlueThird = "bg-table-blue-third-line";
                        bgClassYellowSecond = "bg-table-yellow-second-line";
                        bgClassGreenSecond = "bg-table-green-second-line";
                        bgClassGreenThird = "bg-table-green-third-line";
                      }

                      return (
                        <tr key={index + 1000} className="text-center">
                          <td className="border p-2 font-normal text-black bg-gray-400">
                            {index + 1}
                          </td>
                          <td
                            className={`border p-2 font-normal text-black ${bgClassMeshCode}`}
                          >
                            {order.information.mesh_code || "N/A"}
                          </td>
                          <td
                            className={`border p-2 font-normal text-black ${bgClassMeshType}`}
                          >
                            {order.information.mesh_type || "N/A"}
                          </td>
                          <td
                            className={`border p-2 font-normal text-black ${bgClassMeshName}`}
                          >
                            {order.information.mesh_name || "N/A"}
                          </td>

                          {/* Additional columns for small-size table */}
                          {isTableSmall && (
                            <>
                              <td
                                className={`border p-2 font-normal text-black ${bgClassBlueSecond}`}
                              >
                                {order.mesh.length_of_height_stick + " cm" ||
                                  "N/A"}
                              </td>
                              <td
                                className={`border p-2 font-normal text-black ${bgClassBlueSecond}`}
                              >
                                {order.mesh.length_of_width_stick + " cm" ||
                                  "N/A"}
                              </td>
                              <td
                                className={`border p-2 font-normal text-black ${bgClassBlueSecond}`}
                              >
                                {order.stick.front_filament + " cm" || "N/A"}
                              </td>
                              <td
                                className={`border p-2 font-normal text-black ${bgClassYellowSecond}`}
                              >
                                {order.order.piece + " adet" || "N/A"}
                              </td>
                              {showCheckboxes && (
                                <td
                                  className={`border p-2 text-black ${bgClassYellowSecond}`}
                                >
                                  <input
                                    type="checkbox"
                                    checked={!!checkedOrders[order_id]}
                                    onChange={() =>
                                      handleCheckboxChange(order, order_id)
                                    }
                                    disabled={
                                      order_id !==
                                        selectedMeshName?.firstClickedId &&
                                      selectedMeshName &&
                                      (selectedMeshName.meshName !==
                                        order.information.mesh_name ||
                                        selectedMeshName.heightStick !==
                                          order.mesh.length_of_height_stick ||
                                        selectedMeshName.frontFilament !==
                                          order.stick.front_filament ||
                                        (selectedMeshName.baseWidthStick !==
                                          undefined &&
                                          order.mesh.length_of_width_stick >
                                            selectedMeshName.baseWidthStick))
                                    }
                                  />
                                  {checkedCount > 1 &&
                                    lastCheckedOrderId === order_id && (
                                      <button
                                        className="ml-2 text-white font-bold py-1 px-3 rounded bg-table-green-first-line"
                                        onClick={() => handleBirlestir()}
                                      >
                                        Birleştir
                                      </button>
                                    )}
                                </td>
                              )}
                            </>
                          )}

                          {/* Additional columns for full-size table */}
                          {!isTableSmall && (
                            <>
                              <td
                                className={`border p-2 font-normal text-black ${bgClassBlueSecond}`}
                              >
                                {order.stick.height_diameter + " mm" || "N/A"}
                              </td>
                              <td
                                className={`border p-2 font-normal text-black ${bgClassBlueSecond}`}
                              >
                                {order.stick.width_diameter + " mm" || "N/A"}
                              </td>
                              <td
                                className={`border p-2 font-normal text-black ${bgClassBlueThird}`}
                              >
                                {order.stick.height_apertureSize + " cm" ||
                                  "N/A"}
                              </td>
                              <td
                                className={`border p-2 font-normal text-black ${bgClassBlueThird}`}
                              >
                                {order.stick.width_apertureSize + " cm" ||
                                  "N/A"}
                              </td>
                              <td
                                className={`border p-2 font-normal text-black ${bgClassBlueSecond}`}
                              >
                                {order.stick.back_filament + " cm" || "N/A"}
                              </td>
                              <td
                                className={`border p-2 font-normal text-black ${bgClassBlueSecond}`}
                              >
                                {order.stick.front_filament + " cm" || "N/A"}
                              </td>
                              <td
                                className={`border p-2 font-normal text-black ${bgClassBlueSecond}`}
                              >
                                {order.stick.left_filament + " cm" || "N/A"}
                              </td>
                              <td
                                className={`border p-2 font-normal text-black ${bgClassBlueSecond}`}
                              >
                                {order.stick.right_filament + " cm" || "N/A"}
                              </td>
                              <td
                                className={`border p-2 font-normal text-black ${bgClassGreenThird}`}
                              >
                                {order.mesh.height_number_of_sticks + " adet" ||
                                  "N/A"}
                              </td>
                              <td
                                className={`border p-2 font-normal text-black ${bgClassGreenThird}`}
                              >
                                {order.mesh.width_number_of_sticks + " adet" ||
                                  "N/A"}
                              </td>
                              <td
                                className={`border p-2 font-normal text-black ${bgClassGreenSecond}`}
                              >
                                {order.mesh.length_of_height_stick + " cm" ||
                                  "N/A"}
                              </td>
                              <td
                                className={`border p-2 font-normal text-black ${bgClassGreenSecond}`}
                              >
                                {order.mesh.length_of_width_stick + " cm" ||
                                  "N/A"}
                              </td>
                              <td
                                className={`border p-2 font-normal text-black ${bgClassGreenThird}`}
                              >
                                {order.mesh.unit_mesh_weight + " kg" || "N/A"}
                              </td>
                              <td
                                className={`border p-2 font-normal text-black ${bgClassYellowSecond}`}
                              >
                                {order.order.piece + " adet" || "N/A"}
                              </td>
                              <td
                                className={`border p-2 font-normal text-black ${bgClassYellowSecond}`}
                              >
                                {order.order.total_weight + " kg" || "N/A"}
                              </td>
                              {!isPrinting && (
                                <td className="border p-2 font-medium uppercase text-black bg-red-100">
                                  <button
                                    className="bg-red-500 text-white font-bold py-1 px-3 rounded"
                                    onClick={() => confirmDelete(order_id)}
                                  >
                                    X
                                  </button>
                                </td>
                              )}
                            </>
                          )}
                        </tr>
                      );
                    }
                  );
                })()}
              </tbody>
              {(isTableSmall ? sortedOrderList.length : orderList.length) >
                0 && (
                <tfoot className="border-0">
                  <tr className="w-max-full border-0">
                    <td
                      colSpan="100%"
                      className="w-full border-collapse border p-2 text-base font-medium text-black text-center "
                    >
                      Bu siparişin toplam ağırlığı: {totalWeight.toFixed(2)} kg
                    </td>
                  </tr>
                </tfoot>
              )}
            </table>
          </div>
        )}

        <div className="mt-6 flex flex-col items-center">
          <div className="mt-6 mb-2 flex justify-center w-full space-x-5">
            <button
              className="text-white font-bold py-2 px-4 rounded bg-black hover:bg-button-new-hover"
              onClick={handleDeleteAllOrder}
            >
              Sıfırla
            </button>
            <button
              className="text-white font-bold py-2 px-4 rounded bg-black hover:bg-button-new-hover"
              onClick={() => printTable(setIsPrinting, "orderTable")}
            >
              Yazdır
            </button>

            
              <input
                type="file"
                id="fileInput"
                accept=".xlsx, .xls"
                style={{ display: "none" }}
                onChange={handleFileSelect}
              />
              <button
                className="text-white font-bold py-2 px-4 rounded bg-black hover:bg-button-new-hover"
                onClick={handleFileButtonClick}
              >
                Excel yükle
              </button>
              <button
                className="text-white font-bold py-2 px-4 rounded bg-black hover:bg-button-new-hover"
                onClick={handleDownloadTemplate}
                
              >
                Boş Excel İndir
              </button>
            
          </div>
          {selectedFileName && (
            <span className="ml-2">
              "{selectedFileName}" isimli Excel tablosu başarıyla yüklendi.
            </span>
          )}
        </div>
        <Modal
          showModal={showModal}
          setShowModal={setShowModal}
          optimizedValues={optimizedWidthSticks}
          extraWidthLengthUsed={extraWidthLengthUsed}
          initialValues={initialValues}
          onConfirm={handleConfirmation}
        />
      </div>
      <ModalRowDeletion
        showModal={showDeleteConfirmation}
        setShowModal={setShowDeleteConfirmation}
        onConfirm={deleteConfirmed}
      />
    </>
  );
};

export default OrdersTabOriginalTable;
