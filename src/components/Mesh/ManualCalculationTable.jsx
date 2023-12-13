import React from 'react'
import { parseToFloat } from '@/utils/tableHelpers';

const ManualCalculationTable = ({manuelCalculated, manuelMesh}) => {

  const diameterValue0 = parseToFloat(manuelMesh.diameter[0]);
  const diameterValue1 = parseToFloat(manuelMesh.diameter[1]);


  return (
    <div className="flex w-full -mt-5 ">
          <div className="flex  w-full justify-between gap-x-4">
            <div className="mb-4 w-full overflow-x-scroll">
              <table className="w-full border-collapse border text-xs border-gray-800 text-center">
              <thead>
              <tr>
                <th
                  colSpan="10"
                  className="border p-2 font-medium uppercase text-black bg-table-blue-first-line"
                >
                  ÇUBUK
                </th>
                <th
                  colSpan="5"
                  className="border p-2  font-medium uppercase text-black bg-table-green-first-line"
                >
                  HASIR
                </th>
                <th
                  colSpan="2"
                  className="border p-2 font-medium uppercase text-black bg-table-yellow-first-line"
                >
                  SİPARİŞ
                </th>
              </tr>
              <tr>
                <th
                  colSpan="2"
                  className="border p-2 font-medium text-black uppercase bg-table-blue-second-line"
                >
                  ÇAPI
                </th>
                <th
                  colSpan="2"
                  className="border p-2 font-medium text-black uppercase bg-table-blue-third-line"
                >
                  ARALIĞI
                </th>
                <th
                  colSpan="4"
                  className="border p-2 font-medium text-black uppercase bg-table-blue-second-line"
                >
                  FİLİZLERİ
                </th>
                <th
                  colSpan="2"
                  className="border p-2 font-medium text-black uppercase bg-table-blue-third-line"
                >
                  BİRİM AĞIRLIĞI
                </th>
                <th
                  colSpan="2"
                  className="border p-2 font-medium text-black uppercase bg-table-green-second-line"
                >
                  ÇUBUK SAYISI
                </th>
                <th
                  colSpan="2"
                  className="border p-2 font-medium text-black uppercase bg-table-green-third-line"
                >
                  ÇUBUK AĞIRLIĞI
                </th>
                <th
                  colSpan="1"
                  className="border p-2 font-medium text-black uppercase bg-table-green-second-line"
                >
                  TOPLAM
                </th>
                <th
                  colSpan="2"
                  className="border p-2 font-medium text-black uppercase bg-table-yellow-second-line"
                >
                  TOPLAM
                </th>
              </tr>
              <tr className="bg-slate-50">
                <th className="border p-2 font-medium text-black uppercase bg-table-blue-second-line">
                  BOY
                </th>
                <th className="border p-2 font-medium text-black uppercase bg-table-blue-second-line">
                  EN
                </th>
                <th className="border p-2 font-medium text-black uppercase bg-table-blue-third-line">
                  BOY
                </th>
                <th className="border p-2 font-medium text-black uppercase bg-table-blue-third-line">
                  EN
                </th>
                <th
                  colSpan="1"
                  className="border p-2 font-medium text-black uppercase bg-table-blue-second-line"
                >
                  ARKA
                </th>
                <th
                  colSpan="1"
                  className="border p-2 font-medium text-black uppercase bg-table-blue-second-line"
                >
                  ÖN
                </th>
                <th
                  colSpan="1"
                  className="border p-2 font-medium text-black uppercase bg-table-blue-second-line"
                >
                  SAĞ
                </th>
                <th
                  colSpan="1"
                  className="border p-2 font-medium  text-black uppercase bg-table-blue-second-line"
                >
                  SOL
                </th>
                <th className="border p-2 font-medium text-black uppercase bg-table-blue-third-line">
                  BOY
                </th>
                <th className="border p-2 font-medium text-black uppercase bg-table-blue-third-line">
                  EN
                </th>
                <th className="border p-2 font-medium text-black uppercase bg-table-green-second-line">
                  BOY
                </th>
                <th className="border p-2 font-medium text-black uppercase bg-table-green-second-line">
                  EN
                </th>
                <th className="border p-2 font-medium text-black uppercase bg-table-green-third-line">
                  BOY
                </th>
                <th className="border p-2 font-medium text-black uppercase bg-table-green-third-line">
                  EN
                </th>
                <th
                  colSpan="1"
                  className="border p-2 font-medium text-black uppercase bg-table-green-second-line"
                >
                  AĞIRLIK
                </th>
                <th
                  colSpan="1"
                  className="border p-2 font-medium text-black uppercase bg-table-yellow-second-line"
                >
                  ADET
                </th>
                <th
                  colSpan="1"
                  className="border p-2 font-medium text-black uppercase bg-table-yellow-second-line"
                >
                  AĞIRLIK
                </th>
              </tr>
              <tr className="bg-slate-100">
                <th className="border p-2 font-medium text-black  bg-table-blue-second-line">
                  mm
                </th>
                <th className="border p-2 font-medium  text-black  bg-table-blue-second-line">
                  mm
                </th>
                <th className="border p-2 font-medium  text-black  bg-table-blue-third-line">
                  cm
                </th>
                <th className="border p-2 font-medium text-black  bg-table-blue-third-line">
                  cm
                </th>
                <th className="border p-2 font-medium text-black  bg-table-blue-second-line">
                  cm
                </th>
                <th className="border p-2 font-medium text-black  bg-table-blue-second-line">
                  cm
                </th>
                <th className="border p-2 font-medium text-black  bg-table-blue-second-line">
                  cm
                </th>
                <th className="border p-2 font-medium text-black  bg-table-blue-second-line">
                  cm
                </th>
                <th className="border p-2 font-medium text-black  bg-table-blue-third-line">
                  kg
                </th>
                <th className="border p-2 font-medium text-black  bg-table-blue-third-line">
                  kg
                </th>
                <th className="border p-2 font-medium text-black  bg-table-green-second-line">
                  adet
                </th>
                <th className="border p-2 font-medium text-black  bg-table-green-second-line">
                  adet
                </th>
                <th className="border p-2 font-medium text-black  bg-table-green-third-line">
                  kg
                </th>
                <th className="border p-2 font-medium text-black  bg-table-green-third-line">
                  kg
                </th>
                <th className="border p-2 font-medium text-black  bg-table-green-second-line">
                  kg
                </th>
                <th className="border p-2 font-medium text-black  bg-table-yellow-second-line">
                  tane
                </th>
                <th className="border p-2 font-medium text-black  bg-table-yellow-second-line">
                  kg
                </th>
              </tr>
            </thead>

                <tbody className="bg-white">
                  <tr>
                    <td className="border p-2 font-bold text-black bg-table-blue-second-line">
                    {diameterValue0 !== null ? diameterValue0.toFixed(2) : "N/A"}
                    </td>
                    <td className="border p-2 font-bold text-black bg-table-blue-second-line">
                    {diameterValue1 !== null ? diameterValue1.toFixed(2) : "N/A"}
                    </td>

                    <td className="border p-2 font-bold text-black bg-table-blue-third-line">
                      {manuelCalculated.apertureSize[0]?.toFixed(2) || "N/A"}
                    </td>
                    <td className="border p-2 font-bold text-black bg-table-blue-third-line">
                      {manuelCalculated.apertureSize[1]?.toFixed(2) || "N/A"}
                    </td>

                    <td className="border p-2 font-bold text-black bg-table-blue-second-line">
                      {manuelMesh.backFilament?.toFixed(2) || "N/A"}
                    </td>

                    <td className="border p-2 font-bold text-black bg-table-blue-second-line">
                      {manuelMesh.frontFilament?.toFixed(2) || "N/A"}
                    </td>
                    <td className="border p-2 font-bold text-black bg-table-blue-second-line">
                      {manuelMesh.leftFilament?.toFixed(2) || "N/A"}
                    </td>
                    <td className="border p-2 font-bold text-black bg-table-blue-second-line">
                      {manuelMesh.rightFilament?.toFixed(2) || "N/A"}
                    </td>

                    <td className="border p-2 font-bold text-black bg-table-blue-third-line">
                      {manuelCalculated.unitOfHeigthWeight?.toFixed(3) || "N/A"}
                    </td>

                    <td className="border p-2 font-bold text-black bg-table-blue-third-line">
                      {manuelCalculated.unitOfWidthWeight?.toFixed(3) || "N/A"}
                    </td>

                    <td className="border p-2 font-bold text-black bg-table-green-second-line">
                      {manuelMesh.numberOfSticks[0] ?? "N/A"}
                    </td>
                    <td className="border p-2 font-bold text-black bg-table-green-second-line">
                      {manuelMesh.numberOfSticks[1] ?? "N/A"}
                    </td>

                    <td className="border p-2 font-bold text-black bg-table-green-third-line">
                      {manuelCalculated.totalHeigthWeight?.toFixed(2) || "N/A"}
                    </td>

                    <td className="border p-2 font-bold text-black bg-table-green-third-line">
                      {manuelCalculated.totalWidthWeight?.toFixed(2) || "N/A"}
                    </td>

                    <td className="border p-2 font-bold text-black bg-table-green-second-line">
                      {" "}
                      {manuelCalculated.unitMeshWeight?.toFixed(2) || "N/A"}
                    </td>

                    <td className="border p-2 font-bold text-black bg-table-yellow-second-line"> {manuelMesh.piece || "N/A"}</td>

                    <td className="border p-2 font-bold text-black bg-table-yellow-second-line">
                      {manuelCalculated.totalWeight?.toFixed(2) || "N/A"}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
  )
}

export default ManualCalculationTable







