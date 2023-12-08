import Select from "../Select";
import Input from "../Input";
import Mesh from "../Mesh";
import { useAddKesmeMutation } from "../../store/reducers/kesme";


const AutomaticTab = ({
  mesh,
  setMesh,
  meshTypeOptions,
  handleTypeChange,
  meshFeatures,
  setCalculated,
  initialValues,
  calculated,
  setFilamentError,
  isButtonDisabled,
  showMessage,
  error,
  filamentError,
  setShowMessage,
}) => {

  const [addKesme, { isLoading: addKesmeIsLoading, isError: addKesmeIsError }] =
  useAddKesmeMutation({
    onError: (error) => {
      console.error("An error occurred in myData query:", error);
    },
  });
  // Function to open "KESME" tab
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

  return (
    <div className="flex flex-col items-center justify-center mr-4">
      <div className=" flex flex-col items-center justify-center px-4 py-2 gap-10 mt-4 w-full">
        <div className="flex flex-row gap-3 w-full justify-between ">
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
                onChange={(value) =>
                  setMesh((prevMesh) => ({ ...prevMesh, code: value }))
                }
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
                  value={mesh.height}
                  onChange={(value) => {
                    setMesh((mesh) => ({
                      ...mesh,
                      height: parseInt(value),
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
                  value={mesh.height}
                  onChange={(value) => {
                    setMesh((mesh) => ({
                      ...mesh,
                      numberOfHeightBars: 0,
                      numberOfWidthBars: 0,
                      height: parseInt(value),
                    }));
                  }}
                  type="number"
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
                value={mesh.width}
                onChange={(value) => {
                  setMesh((mesh) => ({
                    ...mesh,
                    numberOfHeightBars: 0,
                    numberOfWidthBars: 0,
                    width: parseInt(value),
                  }));
                }}
                type="number"
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
                value={mesh.piece}
                onChange={(value) => {
                  setMesh((mesh) => ({ ...mesh, piece: value }));
                }}
                type="number"
                min={0}
              />
            </div>
          </div>
          <div className="flex flex-col justify-center">
            <button
              className={`text-white text-sm font-bold py-1 px-4 rounded mt-2 ${
                isButtonDisabled
                  ? "bg-gray-500"
                  : "bg-blue-500 hover:bg-blue-700"
              }`}
              disabled={isButtonDisabled}
              onClick={openKesmeTab}
            >
              Kesmeye Gönder
            </button>
          </div>
        </div>
        {(error || showMessage) && (
          <div>
            {error && (
              <div className="my-2 text-md text-red-500 rounded ">{error}</div>
            )}
            {showMessage && (
              <div className="my-2 text-md text-green-500 rounded ">
                Kesme'ye başarıyla eklendi.
              </div>
            )}
          </div>
        )}
        <div className="flex flex-row w-full -mt-5 ">
          <div className="flex flex-row w-full justify-between gap-x-4">
            <div className="mb-4 w-full">
              <table className="w-full border-collapse border text-xs border-gray-800 text-center">
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
      </div>
      {filamentError && (
        <div className="my-2 text-sm text-red-600">{filamentError}</div>
      )}

      {!!calculated.totalWeight && (
        <div className="flex justify-center items-center max-w-[75%] mx-auto ">
          <div className="flex w-full  overflow-y-scroll mt-8 mb-16">
            <Mesh
              calculated={calculated}
              height={mesh.width}
              width={mesh.height}
              firm="Mongery Yazılım"
              type={mesh.type}
              piece={mesh.piece}
              quality="TS 4559 EKİM 1985"
              stroke="black"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default AutomaticTab;
