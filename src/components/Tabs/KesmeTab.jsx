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
    <div className="flex flex-col w-full items-center">
      <div className="text-black font-medium text-xl uppercase text-center mb-4">
        <h2>KESME BİLGİLERİ</h2>
      
      </div>
      {!isLoading && !isError && (
        <div className="overflow-x-auto w-full">
          <table
            id="kesmeTable"
            className="w-full border-collapse border text-xs border-gray-800 text-center"
          >
            <thead>
              <tr className="bg-slate-50">
                <th className="border p-2 font-medium uppercase text-black bg-table-blue-first-line" colSpan={4} style={{ textDecoration: 'underline' }}>
                  BOY ÇUBUĞU
                </th>
                <th className="border p-2 font-medium uppercase text-black bg-table-green-first-line" colSpan={4} style={{ textDecoration: 'underline' }}>
                  EN ÇUBUĞU
                </th>
                {!isPrinting && (
                <th className="border p-2 font-medium uppercase text-black bg-red-500"></th>)}
              </tr>
              <tr>
                <th
                  className="border p-2 font-medium uppercase text-black bg-table-blue-second-line"
                  onClick={() => toggleSort("diameter0")}
                  style={{ textDecoration: 'underline' }}
                >
                  ÇAP
                </th>
                <th
                  className="border p-2 font-medium uppercase text-black bg-table-blue-third-line"
                  onClick={() => toggleSort("height")}
                  style={{ textDecoration: 'underline' }}
                >
                  UZUNLUK
                </th>
                <th
                  className="border p-2 font-medium uppercase text-black bg-table-blue-second-line"
                  onClick={() => toggleSort("numberOfSticks0")}
                  style={{ textDecoration: 'underline' }}
                >
                  ADET
                </th>
                <th
                  className="border p-2 font-medium uppercase text-black bg-table-blue-third-line"
                  onClick={() => toggleSort("totalHeigthWeight")}
                  style={{ textDecoration: 'underline' }}
                >
                  AĞIRLIK
                </th>
                <th
                  className="border p-2 font-medium uppercase text-black bg-table-green-second-line"
                  onClick={() => toggleSort("diameter1")}
                  style={{ textDecoration: 'underline' }}
                >
                  ÇAP
                </th>
                <th
                  className="border p-2 font-medium uppercase text-black bg-table-green-third-line"
                  onClick={() => toggleSort("width")}
                  style={{ textDecoration: 'underline' }}
                >
                  UZUNLUK
                </th>
                <th
                  className="border p-2 font-medium uppercase text-black bg-table-green-second-line"
                  onClick={() => toggleSort("numberOfSticks1")}
                  style={{ textDecoration: 'underline' }}
                >
                  ADET
                </th>
                <th
                  className="border p-2 font-medium uppercase text-black bg-table-green-third-line"
                  onClick={() => toggleSort("totalWidthWeight")}
                  style={{ textDecoration: 'underline' }}
                >
                  AĞIRLIK
                </th>
                {!isPrinting && (
                <th className="border p-2 font-medium uppercase text-black bg-red-200"
                style={{ textDecoration: 'underline' }}>SATIR SİL</th>)}
              </tr>
            </thead>
            <tbody className="bg-white">
              {kesmeList.map(
                ({ kesme_details: kesme, id: kesme_id }, index) => (
                  <tr key={index + 1000} className="text-center">
                    <td className="border p-2 font-bold uppercase text-black bg-table-blue-second-line">
                      {parseFloat(kesme.height_stick.diameter).toFixed(2) ||
                        "N/A"}
                    </td>
                    <td className="border p-2 font-bold uppercase text-black bg-table-blue-third-line">
                      {parseFloat(kesme.height_stick.height)}
                    </td>
                    <td className="border p-2 font-bold uppercase text-black bg-table-blue-second-line">
                      {parseFloat(kesme.height_stick.number_of_sticks)}
                    </td>
                    <td className="border p-2 font-bold uppercase text-black bg-table-blue-third-line">
                      {parseFloat(
                        kesme.height_stick.total_height_weight
                      ).toFixed(2) || "N/A"}
                    </td>
                    <td className="border p-2 font-bold uppercase text-black bg-table-green-second-line">
                      {parseFloat(kesme.width_stick.diameter)?.toFixed(2) ||
                        "N/A"}
                    </td>
                    <td className="border p-2 font-bold uppercase text-black bg-table-green-third-line">
                      {parseFloat(kesme.width_stick.height)}
                    </td>
                    <td className="border p-2 font-bold uppercase text-black bg-table-green-second-line">
                      {parseFloat(kesme.width_stick.number_of_sticks)}
                    </td>
                    <td className="border p-2 font-bold uppercase text-black bg-table-green-third-line">
                      {parseFloat(kesme.width_stick.total_width_weight).toFixed(
                        2
                      ) || "N/A"}
                    </td>
                    {!isPrinting && (
                      <td className="border p-2 font-medium uppercase text-black bg-red-200">
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

      <div className="mt-16 flex justify-center w-full space-x-5">
        <button
          className="text-white font-bold py-2 px-4 rounded bg-black hover:bg-blue-500"
          onClick={handleDeleteAllKesme}
        >
          Sıfırla
        </button>
        <button
          className="text-white font-bold py-2 px-4 rounded bg-black hover:bg-blue-500"
          onClick={() => printTable(setIsPrinting)}
        >
          Yazdır
        </button>
      </div>
    </div>
  );
};

export default KesmeTab;