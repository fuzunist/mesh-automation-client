import { useState, useEffect } from "react";
import {
  useGetAllOrderQuery,
  useDeleteOrderMutation,
  useDeleteAllOrderMutation,
  useDeleteAllKesmeMutation,
} from "../../store/reducers/kesme";
import {
  printTable,
  toggleSort,
  optimizeMeshProductionBasic,
} from "@/utils/kesmeHelpers";
import Modal from "@/components/Modal";
import KesmeButton from "../Buttons/KesmeButton";
import { useAddKesmeMutation } from "../../store/reducers/kesme";

const OrdersTabManuel = ({ enableKesmeTab }) => {
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
  const [initialValues, setInitialValues] = useState([]);
  const [historyStack, setHistoryStack] = useState([]);
  const [applyColorChange, setApplyColorChange] = useState(false);
  const [showKesmeSuccessMessage, setShowKesmeSuccessMessage] = useState(false);
  const [kesmeLoading, setKesmeLoading] = useState(false);

  const {
    data: orderList,
    isLoading,
    isError,
  } = useGetAllOrderQuery("orders", {
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

  const getFirstNumberFromString = (str) => {
    if (typeof str === 'string' && str.includes('/')) {
      return parseInt(str.split('/')[0], 10);
    } else if (typeof str === 'string') {
      return parseInt(str, 10);
    }
    return 0; // Default to 0 if not a string or if cannot parse to a number
  };

  const handleSortByHeightStick = (orderListParam = orderList) => {
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
      const meshNameA = getFirstNumberFromString(a.order_details.information.mesh_name);
      const meshNameB = getFirstNumberFromString(b.order_details.information.mesh_name);

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
        Math.max(
          a.order_details.stick.back_filament,
          a.order_details.stick.front_filament
        ) !==
        Math.max(
          b.order_details.stick.back_filament,
          b.order_details.stick.front_filament
        )
      ) {
        return (
          Math.max(
            a.order_details.stick.back_filament,
            a.order_details.stick.front_filament
          ) -
          Math.max(
            b.order_details.stick.back_filament,
            b.order_details.stick.front_filament
          )
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
                Math.max(
                  item.order_details.stick.front_filament,
                  item.order_details.stick.back_filament
                ) ===
                  Math.max(
                    order.stick.front_filament,
                    order.stick.back_filament
                  )
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
        biggerFilamentBetweenBackAndFront: Math.max(
          order.stick.front_filament,
          order.stick.back_filament
        ),
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
            Math.max(
              item.order_details.stick.front_filament,
              item.order_details.stick.back_filament
            ) === currentSelectionCriteria.biggerFilamentBetweenBackAndFront &&
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

  const [addKesme, { isLoading: addKesmeIsLoading, isError: addKesmeIsError }] =
    useAddKesmeMutation({
      onError: (error) => {
        console.error("An error occurred in myData query:", error);
      },
    });

  const [
    deleteAllKesme,
    { isLoading: allKesmeIsLoading, isError: allKesmeIsError },
  ] = useDeleteAllKesmeMutation({
    onError: (error) => {
      console.error("An error occurred in myData query:", error);
    },
  });

  const handleKesmeButtonClick = async () => {
    setKesmeLoading(true);
    try {
      // Attempt to delete all Kesme data
      await deleteAllKesme();

      // Proceed only if the deletion is successful
      const currentVersion =
        historyStack.length > 0
          ? historyStack[historyStack.length - 1]
          : sortedOrderList;

      if (currentVersion.length === 0) {
        console.log("No orders to process.");
        setKesmeLoading(false);
        return;
      }

      console.log("Current version before update:", currentVersion);

      for (const order of currentVersion) {
        const kesmeData = {
          height_stick: {
            diameter: order.order_details.stick.height_diameter,
            height: order.order_details.mesh.length_of_height_stick,
            number_of_sticks: order.order_details.mesh.height_number_of_sticks,
            total_height_weight: order.order_details.mesh.unit_mesh_weight,
          },
          width_stick: {
            diameter: order.order_details.stick.width_diameter,
            height: order.order_details.mesh.length_of_width_stick,
            number_of_sticks: order.order_details.mesh.width_number_of_sticks,
            total_width_weight: order.order_details.mesh.unit_mesh_weight,
          },
        };

        console.log("Adding Kesme data:", kesmeData);
        await addKesme(kesmeData); // Use unwrap to handle any errors
      }

      setShowKesmeSuccessMessage(true);
      setTimeout(() => {
        setShowKesmeSuccessMessage(false);
      }, 3000);
    } catch (error) {
      console.error("An error occurred during the Kesme operation:", error);
    } finally {
      setKesmeLoading(false); // End loading regardless of outcome
    }
  };

  const handleShrinkAndSortTable = () => {
    if (!isTableSmall) {
      toggleTableSize(); // Only shrink if the table is not already small
    }
    handleSortByHeightStick();
  };

  useEffect(() => {
    handleShrinkAndSortTable();
  }, [orderList]);

  return (
    <div className="flex flex-col w-full items-center">
      {!isLoading && !isError && (
        <div className="overflow-x-auto w-[80%]">
          {/* Error message div with a minimum height */}
          <div
            className={`text-center text-md font-normal p-2 rounded mb-4 ${
              Object.keys(checkedOrders).filter((key) => checkedOrders[key])
                .length >= 2
                ? "bg-body-light-gray"
                : "bg-red-200 text-red-900"
            }`}
            style={{ minHeight: "40px" }} // Set a minimum height
          >
            {/* Conditionally render text based on the number of checked checkboxes */}
            {Object.keys(checkedOrders).filter((key) => checkedOrders[key])
              .length === 1 &&
              "Şimdi, seçtiğiniz uzun çubuğa birleştime yapmak istediğiniz diğer çubukları seçiniz."}
            {Object.keys(checkedOrders).filter((key) => checkedOrders[key])
              .length === 0 &&
              "Birleştirme yapılabilecek her bir grup renk ayrımı ile gösterilmektedir. Lütfen birleştime yapmak istediğiniz uzun çubuğu seçiniz."}
          </div>

          <table
            id="orderTable"
            className="w-full border-collapse border text-xs border-gray-800 text-center"
          >
            <thead>
              {/* Conditional rendering based on isTableSmall */}
              {isTableSmall ? (
                // Headers for the smaller version of the table
                <tr>
                  <th className="border p-2 font-bold text-white bg-black">
                    HASIR KODU
                  </th>
                  <th className="border p-2 font-bold text-white bg-black">
                    HASIR TİPİ
                  </th>
                  <th className="border p-2 font-bold text-white bg-black">
                    HASIR İSMİ
                  </th>
                  <th className="border p-2 font-bold text-white bg-black">
                    BOY ÇUBUK UZUNLUĞU
                  </th>
                  <th className="border p-2 font-bold text-white bg-black">
                    EN ÇUBUK UZUNLUĞU
                  </th>
                  <th className="border p-2 font-bold text-white bg-black">
                    FİLİZ BOYU
                  </th>
                  <th className="border p-2 font-bold text-white bg-black">
                    SİPARİŞ SAYISI
                  </th>
                  {showCheckboxes && (
                    <th className="border p-2 font-bold text-white bg-black">
                      SEÇ
                    </th>
                  )}{" "}
                  {/* Conditional rendering */}
                </tr>
              ) : (
                // Headers for the full version of the table
                <>
                  <tr>
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
                        : "bg-table-green-second-line";
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
                              {Math.max(
                                order.stick.back_filament,
                                order.stick.front_filament
                              ) + " cm" || "N/A"}
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
                                      selectedMeshName.biggerFilamentBetweenBackAndFront !==
                                        Math.max(
                                          order.stick.back_filament,
                                          order.stick.front_filament
                                        ) ||
                                      (selectedMeshName.baseWidthStick !==
                                        undefined &&
                                        order.mesh.length_of_width_stick >
                                          selectedMeshName.baseWidthStick))
                                  }
                                />
                                {checkedCount > 1 &&
                                  selectedMeshName?.firstClickedId ===
                                    order_id && (
                                    <button
                                      className="ml-2 text-white font-bold py-1 px-3 rounded bg-table-green-first-line"
                                      onClick={() => handleBirlestir()}
                                    >
                                      Bu hasıra birleştir
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
                              {order.stick.height_apertureSize + " cm" || "N/A"}
                            </td>
                            <td
                              className={`border p-2 font-normal text-black ${bgClassBlueThird}`}
                            >
                              {order.stick.width_apertureSize + " cm" || "N/A"}
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
                                  onClick={() => handleDeleteOrder(order_id)}
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
          </table>
        </div>
      )}

      <div className="flex flex-col w-full items-center">
        {/* Display messages above the buttons */}
        <div className="mb-4 mt-4 text-center">
          {kesmeLoading && (
            <div className="text-black text-md font-semibold">Kesme'ye gönderiliyor...</div>
          )}
          {showKesmeSuccessMessage && (
            <div className="text-green-600 text-md font-semibold">
              Kesme'ye başarıyla gönderildi.
            </div>
          )}
        </div>

        <div className="flex justify-center w-full space-x-5">
          <div className="flex space-x-2 items-center">
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

            {isTableSmall && (
              <button
                className="text-white font-bold py-2 px-4 rounded bg-black hover:bg-button-new-hover"
                onClick={handleUndo}
              >
                İşlemi Geri Al
              </button>
            )}
            {isTableSmall && (
              
                <KesmeButton
                  isButtonDisabled={false}
                  openKesmeTab={handleKesmeButtonClick}
                />
              
            )}
          </div>
        </div>
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
  );
};

export default OrdersTabManuel;
