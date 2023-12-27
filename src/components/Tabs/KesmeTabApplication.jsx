import {
  useGetAllKesmeQuery,
  useDeleteKesmeMutation,
  useDeleteAllKesmeMutation,
} from "../../store/reducers/kesme";
import { useState, useEffect } from "react";

import {
  printTable,
  toggleSort,
  optimizeMeshProduction,
} from "@/utils/kesmeHelpers";
import React from 'react';


const KesmeTabApplication = () => {
  const [openTab, setOpenTab] = useState(1);
  const [isPrinting, setIsPrinting] = useState(false);
  const [optimizedHeightSticks, setOptimizedHeightSticks] = useState([]);
  const [extraHeightLengthUsed, setExtraHeightLengthUsed] = useState(null);
  const [optimizedWidthSticks, setOptimizedWidthSticks] = useState([]);
  const [extraWidthLengthUsed, setExtraWidthLengthUsed] = useState(null);
  const [modifiedKesmeList, setModifiedKesmeList] = useState(null); // New state to store modified kesmeList
  const [optimizedHeightKesmeList, setOptimizedHeightKesmeList] = useState([]);
  const [optimizedWidthKesmeList, setOptimizedWidthKesmeList] = useState([]);

  const {
    data: kesmeList,
    isLoading,
    isError,
  } = useGetAllKesmeQuery("Kesme", {
    onError: (error) => {
      console.error("An error occurred in myData query:", error);
    },
  });
  const [deleteKesme, { isLoading: kesmeIsLoading, isError: kesmeIsError }] =
    useDeleteKesmeMutation({
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

  const handleDeleteAllKesme = () => {
    deleteAllKesme();
  };
  const handleDeleteKesme = (kesme_id) => {
    deleteKesme(kesme_id);
  };

  const handleHeightWidthOptimize = () => {
    handleHeightOptimize();
    handleWidthOptimize();
  };

  const handleHeightOptimize = () => {
    if (kesmeList && kesmeList.length > 0) {
      console.log("Raw kesmeList:", kesmeList);

      const kesmes = kesmeList.map((kesme) => {
        const lengthOfHeightStick = kesme.kesme_details.height_stick.height;
        const heightNumberOfSticks =
          kesme.kesme_details.height_stick.number_of_sticks;

        if (
          lengthOfHeightStick !== undefined &&
          heightNumberOfSticks !== undefined
        ) {
          return [parseInt(lengthOfHeightStick, 10), heightNumberOfSticks];
        } else {
          return [0, 0];
        }
      });

      const optimized = optimizeMeshProduction(kesmes);
      setOptimizedHeightSticks(optimized.optimizedOrders);
      setExtraHeightLengthUsed(optimized.extraLengthUsed);

      // Calculate the diameter and weight for the optimized list
      // Assuming all kesme items have the same diameter and weight per stick
      const diameter = kesmeList[0].kesme_details.height_stick.diameter;
      const weightPerStick =
        kesmeList[0].kesme_details.height_stick.total_height_weight /
        kesmeList[0].kesme_details.height_stick.number_of_sticks;

      const updatedKesmeList = optimized.optimizedOrders.map((opt) => ({
        kesme_details: {
          height_stick: {
            height: opt[0],
            number_of_sticks: opt[1],
            diameter: diameter,
            total_height_weight: weightPerStick * opt[1],
          },
          width_stick: kesmeList[0].kesme_details.width_stick, // Assuming unchanged
        },
      }));

      setOptimizedHeightKesmeList(updatedKesmeList); // Update the modified kesme list
    }
  };

  const handleWidthOptimize = () => {
    if (kesmeList && kesmeList.length > 0) {
      console.log("Raw kesmeList:", kesmeList);
      const kesmes = kesmeList.map((kesme) => {
        const lengthOfWidthStick = kesme.kesme_details.width_stick.height;
        const widthNumberOfSticks =
          kesme.kesme_details.width_stick.number_of_sticks;

        if (
          lengthOfWidthStick !== undefined &&
          widthNumberOfSticks !== undefined
        ) {
          return [parseInt(lengthOfWidthStick, 10), widthNumberOfSticks];
        } else {
          return [0, 0];
        }
      });

      const optimized = optimizeMeshProduction(kesmes);
      setOptimizedWidthSticks(optimized.optimizedOrders);
      setExtraWidthLengthUsed(optimized.extraLengthUsed);

      // Calculate the diameter and weight for the optimized list
      // Assuming all kesme items have the same diameter and weight per stick
      const diameter = kesmeList[0].kesme_details.width_stick.diameter;
      const weightPerStick =
        kesmeList[0].kesme_details.width_stick.total_width_weight /
        kesmeList[0].kesme_details.width_stick.number_of_sticks;

      const updatedKesmeList = optimized.optimizedOrders.map((opt) => {
        // Check if there is already a modified kesme list for height sticks
        const existingKesme = modifiedKesmeList
          ? modifiedKesmeList.find(
              (k) => k.kesme_details.width_stick.height === opt[0]
            )
          : kesmeList.find(
              (k) => k.kesme_details.width_stick.height === opt[0]
            );

        return {
          ...existingKesme, // Keep the existing kesme details, if any
          kesme_details: {
            ...existingKesme.kesme_details,
            width_stick: {
              height: opt[0],
              number_of_sticks: opt[1],
              diameter: diameter,
              total_width_weight: weightPerStick * opt[1],
            },
          },
        };
      });

      setOptimizedWidthKesmeList(updatedKesmeList); // Update the modified kesme list
    }
  };

  console.log("Optimize edilmiş boy çubukları:", optimizedHeightSticks);
  console.log("Optimize edilmiş en çubukları:", optimizedWidthSticks);


   // A function to aggregate kesmeList data by unique pairs of ÇAP and UZUNLUK
   const aggregateAndSortKesmeData = (kesmeList) => {
    const aggregatedData = {};

    (kesmeList || []).forEach(kesme => {
      const heightStick = kesme.kesme_details.height_stick;
      const widthStick = kesme.kesme_details.width_stick;
      const sticks = [heightStick, widthStick];

      sticks.forEach(stick => {
        const key = `${stick.diameter} mm-${stick.height} cm`;
        if (!aggregatedData[key]) {
          aggregatedData[key] = {
            diameter: stick.diameter,
            height: stick.height,
            number_of_sticks: 0,
            total_weight: 0
          };
        }
        aggregatedData[key].number_of_sticks += stick.number_of_sticks;
        aggregatedData[key].total_weight += stick.total_height_weight || stick.total_width_weight;
      });
    });

    return Object.values(aggregatedData).sort((a, b) => {
      // Sort by ÇAP
      if (a.diameter !== b.diameter) {
        return a.diameter - b.diameter;
      }
      // If ÇAP is the same, sort by UZUNLUK
      return a.height - b.height;
    });


  };

  const sortedAggregatedKesmeList = kesmeList ? aggregateAndSortKesmeData(kesmeList) : [];

  return (
    <div className="flex flex-col w-full items-center">
      {!isLoading && !isError && (
        <div className="overflow-x-auto w-[80%]">
          <table
            id="kesmeApplicationTable"
            className="w-full border-collapse border text-xs border-gray-800 text-center"
          >
            <thead>
              <tr className="bg-slate-50">
                <th
                  className="border p-2 font-bold uppercase text-black bg-table-blue-first-line"
                  colSpan={4}
                >
                  Toplam Çubuklar
                </th>
              </tr>
              <tr>
                <th className="border p-2 font-bold uppercase text-black bg-table-blue-first-line">
                  ÇAP
                </th>
                <th className="border p-2 font-bold uppercase text-black bg-table-blue-first-line">
                  UZUNLUK
                </th>
                <th className="border p-2 font-bold uppercase text-black bg-table-blue-first-line">
                  ADET
                </th>
                <th className="border p-2 font-bold uppercase text-black bg-table-blue-first-line">
                  AĞIRLIK
                </th>
              </tr>
            </thead>

            <tbody className="bg-white">
              {sortedAggregatedKesmeList.map((kesme, index) => (
                <tr key={index} className="text-center">
                  <td className="border p-2 font-medium  text-black bg-table-blue-second-line">
                    {parseFloat(kesme.diameter).toFixed(2) + " mm"}
                  </td>
                  <td className="border p-2 font-medium  text-black bg-table-blue-third-line">
                    {parseFloat(kesme.height) + " cm"}
                  </td>
                  <td className="border p-2 font-medium  text-black bg-table-blue-second-line">
                    {kesme.number_of_sticks}
                  </td>
                  <td className="border p-2 font-medium  text-black bg-table-blue-third-line">
                    {parseFloat(kesme.total_weight).toFixed(2) + " kg"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Display extraLengthUsed values */}
      {extraHeightLengthUsed !== null && (
        <div className="mb-4">
          <strong>Fazla Boy Çubuğu Üretim (cm): </strong>
          {extraHeightLengthUsed}
        </div>
      )}
      {extraWidthLengthUsed !== null && (
        <div className="mb-4">
          <strong>Fazla En Çubuğu Üretim (cm): </strong>
          {extraWidthLengthUsed}
        </div>
      )}

      {/* Control Buttons */}
      <div className="mt-16 flex justify-center w-full space-x-5">
        <button
          className="text-white font-bold py-2 px-4 rounded bg-black hover:bg-button-new-hover"
          onClick={handleDeleteAllKesme}
        >
          Sıfırla
        </button>
        <button
          className="text-white font-bold py-2 px-4 rounded bg-black hover:bg-button-new-hover"
          onClick={() => printTable(setIsPrinting, "kesmeApplicationTable")}
        >
          Yazdır
        </button>
        
      </div>
    </div>
  );
};

export default KesmeTabApplication;
