import {
  useGetAllKesmeQuery,
  useDeleteKesmeMutation,
  useDeleteAllKesmeMutation,
} from "../../store/reducers/kesme";
import { useState } from "react";
import { printTable, toggleSort } from "@/utils/kesmeHelpers";
import { useEffect } from "react";
import { useSharedReset } from "../../store/hooks/kesme.jsx";

const KesmeTabInformation = ({ onKesmeListChange }) => {
  console.log("KesmeTabInformation rendering");

  useEffect(() => {
    return () => {
      console.log("KesmeTabInformation is unmounting");
    };
  }, []);

  const [openTab, setOpenTab] = useState(1);
  const [isPrinting, setIsPrinting] = useState(false);
  const { resetTrigger, resetCompleted } = useSharedReset();

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

  useEffect(() => {
    console.log(
      `KesmeTabInformation useEffect for resetTrigger: ${resetTrigger}`
    );

    if (resetTrigger) {
      console.log(
        "resetTrigger is true in KesmeTabInformation, calling handleDeleteAllKesme"
      );
      handleDeleteAllKesme();
      resetCompleted(); // Call this to set the resetTrigger back to false
    } else {
      console.log("resetTrigger is false in KesmeTabInformation");
    }
  }, [resetTrigger, resetCompleted, handleDeleteAllKesme]);

  const handleDeleteKesme = (kesme_id) => {
    deleteKesme(kesme_id);
  };

  useEffect(() => {
    // Whenever kesmeList changes, inform the parent component
    onKesmeListChange(kesmeList);
  }, [kesmeList, onKesmeListChange]);

  return (
    <div className="flex flex-col w-full items-center">
      {!isLoading && !isError && (
        <div className="overflow-x-auto w-[80%]">
          <table
            id="kesmeTable"
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
              {kesmeList.map(
                ({ kesme_details: kesme, id: kesme_id }, index) => (
                  <tr key={index + 1000} className="text-center">
                    <td className="border p-2 font-normal  text-black bg-table-blue-second-line">
                      {parseFloat(kesme.height_stick.diameter).toFixed(2) +
                        " mm" || "N/A"}
                    </td>
                    <td className="border p-2 font-normal  text-black bg-table-blue-third-line">
                      {parseFloat(kesme.height_stick.height) + " cm"}
                    </td>
                    <td className="border p-2 font-normal  text-black bg-table-blue-second-line">
                      {parseFloat(kesme.height_stick.number_of_sticks)}
                    </td>
                    <td className="border p-2 font-normal  text-black bg-table-blue-third-line">
                      {parseFloat(
                        kesme.height_stick.total_height_weight
                      ).toFixed(2) + " kg" || "N/A"}
                    </td>
                    <td className="border p-2 font-normal  text-black bg-table-green-second-line">
                      {parseFloat(kesme.width_stick.diameter)?.toFixed(2) +
                        " mm" || "N/A"}
                    </td>
                    <td className="border p-2 font-normal  text-black bg-table-green-third-line">
                      {parseFloat(kesme.width_stick.height) + " cm"}
                    </td>
                    <td className="border p-2 font-normal  text-black bg-table-green-second-line">
                      {parseFloat(kesme.width_stick.number_of_sticks)}
                    </td>
                    <td className="border p-2 font-normal  text-black bg-table-green-third-line">
                      {parseFloat(kesme.width_stick.total_width_weight).toFixed(
                        2
                      ) + " kg" || "N/A"}
                    </td>
                  </tr>
                )
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
          onClick={() => printTable(setIsPrinting, "kesmeTable")}
        >
          Yazdır
        </button>
      </div>
    </div>
  );
};

export default KesmeTabInformation;
