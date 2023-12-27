import {
  useGetAllKesmeQuery,
  useDeleteKesmeMutation,
  useDeleteAllKesmeMutation,
} from "../../store/reducers/kesme";
import { useState } from "react";
import { printTable, toggleSort } from "@/utils/kesmeHelpers";
import React from "react";

const KesmeTabSeparateSum = () => {
  const [openTab, setOpenTab] = useState(1);
  const [isPrinting, setIsPrinting] = useState(false);

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

  const aggregateKesmeData = (kesmeList) => {
    const aggregatedData = {
      heightStick: new Map(),
      widthStick: new Map(),
    };

    kesmeList.forEach(({ kesme_details: kesme }) => {
      // Process for 'BOY ÇUBUĞU'
      const heightKey =
        kesme.height_stick.diameter + "_" + kesme.height_stick.height;
      if (!aggregatedData.heightStick.has(heightKey)) {
        aggregatedData.heightStick.set(heightKey, {
          diameter: kesme.height_stick.diameter,
          height: kesme.height_stick.height,
          numberOfSticks: 0,
          totalWeight: 0,
        });
      }
      let heightData = aggregatedData.heightStick.get(heightKey);
      heightData.numberOfSticks += kesme.height_stick.number_of_sticks;
      heightData.totalWeight += kesme.height_stick.total_height_weight;

      // Process for 'EN ÇUBUĞU'
      const widthKey =
        kesme.width_stick.diameter + "_" + kesme.width_stick.height;
      if (!aggregatedData.widthStick.has(widthKey)) {
        aggregatedData.widthStick.set(widthKey, {
          diameter: kesme.width_stick.diameter,
          height: kesme.width_stick.height,
          numberOfSticks: 0,
          totalWeight: 0,
        });
      }
      let widthData = aggregatedData.widthStick.get(widthKey);
      widthData.numberOfSticks += kesme.width_stick.number_of_sticks;
      widthData.totalWeight += kesme.width_stick.total_width_weight;
    });

    return {
      aggregatedHeightStick: Array.from(aggregatedData.heightStick.values()),
      aggregatedWidthStick: Array.from(aggregatedData.widthStick.values()),
    };
  };

  const { aggregatedHeightStick, aggregatedWidthStick } =
    !isLoading && !isError
      ? aggregateKesmeData(kesmeList)
      : { aggregatedHeightStick: [], aggregatedWidthStick: [] };

  return (
    <div className="flex flex-col w-full items-center">
      {!isLoading && !isError && (
        <div className="overflow-x-auto w-[80%]">
          <table
            id="kesmeSeparateSumTable"
            className="w-full border-collapse border text-xs border-gray-800 text-center"
          >
            <thead>
              <tr className="bg-slate-50">
                <th
                  className="border p-2 font-bold uppercase text-black bg-table-blue-first-line"
                  colSpan={4}
                >
                  BOY ÇUBUĞU
                </th>
                <th
                  className="border p-2 font-bold uppercase text-black bg-table-green-first-line"
                  colSpan={4}
                >
                  EN ÇUBUĞU
                </th>
              </tr>
              <tr>
                <th
                  className="border p-2 font-bold uppercase text-black bg-table-blue-first-line"
                  onClick={() => toggleSort("diameter0")}
                >
                  ÇAP
                </th>
                <th
                  className="border p-2 font-bold uppercase text-black bg-table-blue-first-line"
                  onClick={() => toggleSort("height")}
                >
                  UZUNLUK
                </th>
                <th
                  className="border p-2 font-bold uppercase text-black bg-table-blue-first-line"
                  onClick={() => toggleSort("numberOfSticks0")}
                >
                  ADET
                </th>
                <th
                  className="border p-2 font-bold uppercase text-black bg-table-blue-first-line"
                  onClick={() => toggleSort("totalHeigthWeight")}
                >
                  AĞIRLIK
                </th>
                <th
                  className="border p-2 font-bold uppercase text-black bg-table-green-first-line"
                  onClick={() => toggleSort("diameter1")}
                >
                  ÇAP
                </th>
                <th
                  className="border p-2 font-bold uppercase text-black bg-table-green-first-line"
                  onClick={() => toggleSort("width")}
                >
                  UZUNLUK
                </th>
                <th
                  className="border p-2 font-bold uppercase text-black bg-table-green-first-line"
                  onClick={() => toggleSort("numberOfSticks1")}
                >
                  ADET
                </th>
                <th
                  className="border p-2 font-bold uppercase text-black bg-table-green-first-line"
                  onClick={() => toggleSort("totalWidthWeight")}
                >
                  AĞIRLIK
                </th>
              </tr>
            </thead>
            <tbody className="bg-white">
              {aggregatedHeightStick.length > 0 ||
              aggregatedWidthStick.length > 0 ? (
                Array.from({
                  length: Math.max(
                    aggregatedHeightStick.length,
                    aggregatedWidthStick.length
                  ),
                }).map((_, index) => (
                  <React.Fragment key={index}>
                    <tr>
                      {aggregatedHeightStick.length > index ? (
                        <>
                          <td className="border p-2 font-normal text-black bg-table-blue-second-line">
                            {parseFloat(
                              aggregatedHeightStick[index].diameter
                            ).toFixed(2) + " mm" || "N/A"}
                          </td>
                          <td className="border p-2 font-normal text-black bg-table-blue-third-line">
                            {parseFloat(aggregatedHeightStick[index].height) +
                              " cm"}
                          </td>
                          <td className="border p-2 font-normal text-black bg-table-blue-second-line">
                            {aggregatedHeightStick[index].numberOfSticks}
                          </td>
                          <td className="border p-2 font-normal text-black bg-table-blue-third-line">
                            {aggregatedHeightStick[index].totalWeight.toFixed(
                              2
                            ) + " kg" || "N/A"}
                          </td>
                        </>
                      ) : (
                        <>
                          <td
                            className="border p-2"
                            style={{ backgroundColor: "#ebeff2" }}
                          ></td>
                          <td
                            className="border p-2"
                            style={{ backgroundColor: "#ebeff2" }}
                          ></td>
                          <td
                            className="border p-2"
                            style={{ backgroundColor: "#ebeff2" }}
                          ></td>
                          <td
                            className="border p-2"
                            style={{ backgroundColor: "#ebeff2" }}
                          ></td>
                        </>
                      )}
                      {aggregatedWidthStick.length > index ? (
                        <>
                          <td className="border p-2 font-normal text-black bg-table-green-second-line">
                            {parseFloat(
                              aggregatedWidthStick[index].diameter
                            ).toFixed(2) + " mm" || "N/A"}
                          </td>
                          <td className="border p-2 font-normal text-black bg-table-green-third-line">
                            {parseFloat(aggregatedWidthStick[index].height) +
                              " cm"}
                          </td>
                          <td className="border p-2 font-normal text-black bg-table-green-second-line">
                            {aggregatedWidthStick[index].numberOfSticks}
                          </td>
                          <td className="border p-2 font-normal text-black bg-table-green-third-line">
                            {aggregatedWidthStick[index].totalWeight.toFixed(
                              2
                            ) + " kg" || "N/A"}
                          </td>
                        </>
                      ) : (
                        <>
                          <td
                            className="border p-2"
                            style={{ backgroundColor: "#ebeff2" }}
                          ></td>
                          <td
                            className="border p-2"
                            style={{ backgroundColor: "#ebeff2" }}
                          ></td>
                          <td
                            className="border p-2"
                            style={{ backgroundColor: "#ebeff2" }}
                          ></td>
                          <td
                            className="border p-2"
                            style={{ backgroundColor: "#ebeff2" }}
                          ></td>
                        </>
                      )}
                    </tr>
                  </React.Fragment>
                ))
              ) : (
                <tr>
                  <td colSpan={8} className="text-center">
                    No data available
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      <div className="mt-16 flex justify-center w-full space-x-5">
        <button
          className="text-white font-bold py-2 px-4 rounded bg-black hover:bg-button-new-hover"
          onClick={handleDeleteAllKesme}
        >
          Sıfırla
        </button>
        <button
          className="text-white font-bold py-2 px-4 rounded bg-black hover:bg-button-new-hover"
          onClick={() => printTable(setIsPrinting, "kesmeSeparateSumTable")}
        >
          Yazdır
        </button>
      </div>
    </div>
  );
};

export default KesmeTabSeparateSum;
