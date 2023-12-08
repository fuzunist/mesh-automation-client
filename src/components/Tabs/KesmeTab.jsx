import {
  useGetAllKesmeQuery,
  useDeleteKesmeMutation,
  useDeleteAllKesmeMutation,
} from "../../store/reducers/kesme";
import { useState } from "react";
import { printTable, toggleSort } from "@/utils/kesmeHelpers";

const KesmeTab = () => {
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

  return (
    <div className="w-full flex flex-col items-center">
      <div className="text-lg font-semibold uppercase text-center mb-4">
        <h2>KESME BİLGİLERİ</h2>
        <hr className="border-border-light dark:border-border-dark border-b-2" />
      </div>
      {!isLoading && !isError && (
        <div className="overflow-x-auto w-full">
          <table
            id="kesmeTable"
            className="w-full border-collapse border text-xs border-gray-800 text-center"
          >
            <thead>
              <tr className="bg-slate-50">
                <th className="border p-2 font-semibold uppercase" colSpan={4}>
                  BOY ÇUBUĞU
                </th>
                <th className="border p-2 font-semibold uppercase" colSpan={4}>
                  EN ÇUBUĞU
                </th>
                <th className="border p-2 font-semibold uppercase"></th>
              </tr>
              <tr>
                <th
                  className="border p-2 font-semibold uppercase"
                  onClick={() => toggleSort("diameter0")}
                >
                  ÇAP
                </th>
                <th
                  className="border p-2 font-semibold uppercase"
                  onClick={() => toggleSort("height")}
                >
                  UZUNLUK
                </th>
                <th
                  className="border p-2 font-semibold uppercase"
                  onClick={() => toggleSort("numberOfSticks0")}
                >
                  ADET
                </th>
                <th
                  className="border p-2 font-semibold uppercase"
                  onClick={() => toggleSort("totalHeigthWeight")}
                >
                  AĞIRLIK
                </th>
                <th
                  className="border p-2 font-semibold uppercase"
                  onClick={() => toggleSort("diameter1")}
                >
                  ÇAP
                </th>
                <th
                  className="border p-2 font-semibold uppercase"
                  onClick={() => toggleSort("width")}
                >
                  UZUNLUK
                </th>
                <th
                  className="border p-2 font-semibold uppercase"
                  onClick={() => toggleSort("numberOfSticks1")}
                >
                  ADET
                </th>
                <th
                  className="border p-2 font-semibold uppercase"
                  onClick={() => toggleSort("totalWidthWeight")}
                >
                  AĞIRLIK
                </th>
                <th className="border p-2 font-semibold uppercase">Satır Sil</th>
              </tr>
            </thead>
            <tbody className="bg-white">
              {kesmeList.map(
                ({ kesme_details: kesme, id: kesme_id }, index) => (
                  <tr key={index + 1000} className="text-center">
                    <td className="border p-2">
                      {parseFloat(kesme.height_stick.diameter).toFixed(2) ||
                        "N/A"}
                    </td>
                    <td className="border p-2">
                      {parseFloat(kesme.height_stick.height)}
                    </td>
                    <td className="border p-2">
                      {parseFloat(kesme.height_stick.number_of_sticks)}
                    </td>
                    <td className="border p-2">
                      {parseFloat(
                        kesme.height_stick.total_height_weight
                      ).toFixed(2) || "N/A"}
                    </td>
                    <td className="border p-2">
                      {parseFloat(kesme.width_stick.diameter)?.toFixed(2) ||
                        "N/A"}
                    </td>
                    <td className="border p-2">
                      {parseFloat(kesme.width_stick.height)}
                    </td>
                    <td className="border p-2">
                      {parseFloat(kesme.width_stick.number_of_sticks)}
                    </td>
                    <td className="border p-2">
                      {parseFloat(kesme.width_stick.total_width_weight).toFixed(
                        2
                      ) || "N/A"}
                    </td>
                    {!isPrinting && (
                      <td className="border p-2 print:hidden">
                        <button
                          className="bg-red-500 text-white font-bold py-1 px-3 rounded "
                          onClick={() => handleDeleteKesme(kesme_id)}
                        >
                          X
                        </button>
                      </td>
                    )}
                  </tr>
                )
              )}
            </tbody>
          </table>
        </div>
      )}

      <div className="mt-4 flex justify-center w-full space-x-4">
        <button
          className="text-white font-bold py-2 px-4 rounded bg-blue-500 hover:bg-blue-700"
          onClick={handleDeleteAllKesme}
        >
          Sıfırla
        </button>
        <button
          className="text-white font-bold py-2 px-4 rounded bg-green-500 hover:bg-green-700"
          onClick={() => printTable(setIsPrinting)}
        >
          Yazdır
        </button>
      </div>
    </div>
  );
};

export default KesmeTab;
