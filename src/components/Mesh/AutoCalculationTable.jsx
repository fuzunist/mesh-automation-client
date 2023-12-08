import React from 'react'

const AutoCalculationTable = ({calculated, mesh}) => {
  return (
    <div className="flex w-full -mt-5 ">
    <div className="flex w-full justify-between gap-x-4">
      <div className="mb-4 w-full overflow-x-scroll">
        <table className="w-full border-collapse border text-xs  border-gray-800 text-center">
          <thead>
            <tr className="bg-slate-50 ">
              <th
                colSpan="10"
                className="border p-2 font-semibold uppercase"
              >
                ÇUBUK
              </th>
              <th
                colSpan="5"
                className="border p-2 font-semibold uppercase"
              >
                HASIR
              </th>
              <th
                colSpan="2"
                className="border p-2 font-semibold uppercase"
              >
                SİPARİŞ
              </th>
            </tr>
            <tr className="bg-slate-100">
              <th
                colSpan="2"
                className="border p-2 font-semibold uppercase"
              >
                ÇAPI
              </th>
              <th
                colSpan="2"
                className="border p-2 font-semibold uppercase"
              >
                ARALIĞI
              </th>
              <th
                colSpan="4"
                className="border p-2 font-semibold uppercase"
              >
                FİLİZLERİ
              </th>
              <th
                colSpan="2"
                className="border p-2 font-semibold uppercase"
              >
                BİRİM AĞIRLIĞI
              </th>
              <th
                colSpan="2"
                className="border p-2 font-semibold uppercase"
              >
                ÇUBUK AD.
              </th>
              <th
                colSpan="2"
                className="border p-2 font-semibold uppercase"
              >
                ÇUBUK AĞ.
              </th>
              <th
                colSpan="1"
                className="border p-2 font-semibold uppercase"
              >
                TOPLAM
              </th>
              <th
                colSpan="2"
                className="border p-2 font-semibold uppercase"
              >
                TOPLAM
              </th>
            </tr>
            <tr className="bg-slate-50">
              <th className="border p-2 font-semibold uppercase">BOY</th>
              <th className="border p-2 font-semibold uppercase">EN</th>
              <th className="border p-2 font-semibold uppercase">BOY</th>
              <th className="border p-2 font-semibold uppercase">EN</th>
              <th
                colSpan="2"
                className="border p-2 font-semibold uppercase"
              >
                FİLİZ
              </th>
              <th
                colSpan="2"
                className="border p-2 font-semibold uppercase"
              >
                FİLİZ
              </th>
              <th className="border p-2 font-semibold uppercase">BOY</th>
              <th className="border p-2 font-semibold uppercase">EN</th>
              <th className="border p-2 font-semibold uppercase">BOY</th>
              <th className="border p-2 font-semibold uppercase">EN</th>
              <th className="border p-2 font-semibold uppercase">BOY</th>
              <th className="border p-2 font-semibold uppercase">EN</th>
              <th
                colSpan="1"
                className="border p-2 font-semibold uppercase"
              >
                AĞIRLIK
              </th>
              <th
                colSpan="1"
                className="border p-2 font-semibold uppercase"
              >
                ADET
              </th>
              <th
                colSpan="1"
                className="border p-2 font-semibold uppercase"
              >
                AĞIRLIK
              </th>
            </tr>
            <tr className="bg-slate-100">
              <th className="border p-2 font-semibold uppercase">MM</th>
              <th className="border p-2 font-semibold uppercase">MM</th>
              <th className="border p-2 font-semibold uppercase">CM</th>
              <th className="border p-2 font-semibold uppercase">CM</th>
              <th className="border p-2 font-semibold uppercase">ARKA</th>
              <th className="border p-2 font-semibold uppercase">ÖN</th>
              <th className="border p-2 font-semibold uppercase">YAN</th>
              <th className="border p-2 font-semibold uppercase">YAN</th>
              <th className="border p-2 font-semibold uppercase">KG</th>
              <th className="border p-2 font-semibold uppercase">KG</th>
              <th className="border p-2 font-semibold uppercase">ADET</th>
              <th className="border p-2 font-semibold uppercase">ADET</th>
              <th className="border p-2 font-semibold uppercase">KG</th>
              <th className="border p-2 font-semibold uppercase">KG</th>
              <th className="border p-2 font-semibold uppercase">KG</th>
              <th className="border p-2 font-semibold uppercase">TANE</th>
              <th className="border p-2 font-semibold uppercase">KG</th>
            </tr>
          </thead>

          <tbody className="bg-white">
            <tr>
              <td className="border p-2">
                {calculated.diameter[0]?.toFixed(2) || "N/A"}
              </td>
              <td className="border p-2">
                {calculated.diameter[1]?.toFixed(2) || "N/A"}
              </td>

              <td className="border p-2">
                {calculated.apertureSize[0]?.toFixed(2) || "N/A"}
              </td>
              <td className="border p-2">
                {calculated.apertureSize[1]?.toFixed(2) || "N/A"}
              </td>

              <td className="border p-2">
                {calculated.backFilament?.toFixed(2) || "N/A"}
              </td>

              <td className="border p-2">
                {calculated.frontFilament?.toFixed(2) || "N/A"}
              </td>
              <td className="border p-2">
                {calculated.leftFilament?.toFixed(2) || "N/A"}
              </td>
              <td className="border p-2">
                {calculated.rightFilament?.toFixed(2) || "N/A"}
              </td>

              <td className="border p-2">
                {calculated.unitOfHeigthWeight?.toFixed(3) || "N/A"}
              </td>

              <td className="border p-2">
                {calculated.unitOfWidthWeight?.toFixed(3) || "N/A"}
              </td>

              <td className="border p-2">
                {calculated.numberOfSticks[0] ?? "N/A"}
              </td>
              <td className="border p-2">
                {calculated.numberOfSticks[1] ?? "N/A"}
              </td>

              <td className="border p-2">
                {calculated.totalHeigthWeight?.toFixed(2) || "N/A"}
              </td>

              <td className="border p-2">
                {calculated.totalWidthWeight?.toFixed(2) || "N/A"}
              </td>

              <td className="border p-2">
                {" "}
                {calculated.unitMeshWeight?.toFixed(2) || "N/A"}
              </td>

              <td className="border p-2"> {mesh.piece || "N/A"}</td>

              <td className="border p-2">
                {calculated.totalWeight?.toFixed(2) || "N/A"}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
  )
}

export default AutoCalculationTable