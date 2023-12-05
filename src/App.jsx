import { useState, useEffect, useRef } from "react";
import Select from "./components/Select";
import meshFeatures from "./contants/meshFeatures";
import Input from "./components/Input";
import Button from "./components/Button";
import Mesh from "./components/Mesh";
import ManuelMesh from "./components/ManuelMesh";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import "react-tabs/style/react-tabs.css";
import html2canvas from "html2canvas";
import Header from "./components/Header";

const initialValues = {
  calculated: {
    diameter: [0, 0],
    apertureSize: [0, 0],
    numberOfSticks: [0, 0],
    frontFilament: 0,
    backFilament: 0,
    leftFilament: 0,
    rightFilament: 0,
    unitOfHeigthWeight: 0,
    unitOfWidthWeight: 0,
    totalHeigthWeight: 0,
    totalWidthWeight: 0,
    unitMeshWeight: 0,
    totalWeight: 0,
  },
  mesh: {
    type: "Döşeme Hasırı",
    code: Object.keys(meshFeatures)[0], // First key in meshFeatures
    name: Object.keys(meshFeatures[Object.keys(meshFeatures)[0]])[0], // First name in the selected code
    height: 500,
    width: 215,
    numberOfHeightBars: 0,
    numberOfWidthBars: 0,
    piece: 1,
  },
  manuelCalculated: {
    numberOfSticks: [0, 0],
    unitOfHeigthWeight: 0,
    unitOfWidthWeight: 0,
    totalHeigthWeight: 0,
    totalWidthWeight: 0,
    unitMeshWeight: 0,
    totalWeight: 0,
  },
  manuelMesh: {
    type: "Özel Hasır",
    height: 500,
    width: 215,
    numberOfHeightBars: 0,
    numberOfWidthBars: 0,
    diameter: [0, 0],
    apertureSize: [0, 0],
    frontFilament: 0,
    backFilament: 0,
    leftFilament: 0,
    rightFilament: 0,
    piece: 1,
  },
};

function App() {
  const [calculated, setCalculated] = useState(initialValues.calculated);
  const [manuelCalculated, setManuelCalculated] = useState(
    initialValues.manuelCalculated
  );
  const [mesh, setMesh] = useState(initialValues.mesh);
  const [manuelMesh, setManuelMesh] = useState(initialValues.manuelMesh);

  const [error, setError] = useState("");
  const [tabIndex, setTabIndex] = useState(0);
  const tabsRef = useRef(null);

  const [sortOrder, setSortOrder] = useState("desc"); // 'desc' for descending, 'asc' for ascending

  const [kesmeCalculations, setKesmeCalculations] = useState([]);
  const [kesmeCalculationsFromManuel, setKesmeCalculationsFromManuel] =
    useState([]);

  const [combinedKesmeCalculations, setCombinedKesmeCalculations] = useState(
    []
  );

  const [manualInputs, setManualInputs] = useState({
    boyCubukCap: "",
    enCubukCap: "",
    boyGozAraligi: "",
    enGozAraligi: "",
    onFilizBoyu: "",
    arkaFilizBoyu: "",
    sagFilizBoyu: "",
    solFilizBoyu: "",
    hasirBoyu: "",
    hasirEni: "",
    siparisAdedi: "",
  });

  const toggleSort = (sortKey) => {
    setSortOrder((prevOrder) => {
      const newOrder = prevOrder === "desc" ? "asc" : "desc";
      // Sort the combinedKesmeCalculations array
      const sortedData = [...combinedKesmeCalculations].sort((a, b) => {
        const aValue = a[sortKey];
        const bValue = b[sortKey];

        if (newOrder === "desc") {
          return aValue < bValue ? 1 : -1; // Assuming you want to sort by the first diameter
        } else {
          return aValue > bValue ? 1 : -1;
        }
      });
      setCombinedKesmeCalculations(sortedData);
      return newOrder;
    });
  };

  const printTable = () => {
    const table = document.getElementById("kesmeTable"); // Make sure to give your table an ID
    html2canvas(table).then((canvas) => {
      // Create a new window and document to display the image
      const newWindow = window.open("", "_blank");
      newWindow.document.body.appendChild(canvas);
      newWindow.document.title = "Print Table";
      newWindow.print();
      newWindow.close();
    });
  };

  useEffect(() => {
    setError("");
    setCalculated(initialValues.calculated);

    if (
      !mesh.type ||
      !mesh.code ||
      !mesh.name ||
      !mesh.height ||
      !mesh.width ||
      !mesh.piece
    )
      return setError("Tüm alanların doldurulması zorunludur.");

    // Make sure the selected mesh code and name exist in the features object
    if (meshFeatures[mesh.code] && meshFeatures[mesh.code][mesh.name]) {
      const selectedMeshFeature = meshFeatures[mesh.code][mesh.name];
      if (selectedMeshFeature.diameter) {
        const result = { ...initialValues.calculated };

        result.diameter[0] = meshFeatures[mesh.code][mesh.name].diameter.height;
        result.diameter[1] = meshFeatures[mesh.code][mesh.name].diameter.width;

        result.apertureSize[0] =
          meshFeatures[mesh.code][mesh.name].apertureSize.height / 10;
        result.apertureSize[1] =
          meshFeatures[mesh.code][mesh.name].apertureSize.width / 10;

        if (mesh.type === "Çit Hasırı") {
          result.apertureSize[0] = 15;
          result.apertureSize[1] = 5;
        }

        const variable_1 =
          mesh.type === "Perde Hasırı" &&
          (mesh.height === 330 ||
            mesh.height === 335 ||
            mesh.height === 336 ||
            mesh.height === 345);
        const variable_2 = mesh.type === "Perde Hasırı" && mesh.height === 335;
        const variable_3 = mesh.type === "Perde Hasırı" && mesh.height === 336;
        const variable_4 =
          mesh.type === "Perde Hasırı" &&
          (mesh.height === 330 || mesh.height === 345);

        if (variable_1) {
          result.numberOfSticks[0] = 0;
          result.numberOfSticks[1] = 0;
          result.backFilament = 10;
          result.leftFilament = 2.5;
          result.rightFilament = 2.5;
        } else {
          if (mesh.height === 500 && mesh.width === 215) {
            if (mesh.height % result.apertureSize[1] === 0)
              result.numberOfSticks[1] =
                mesh.height / result.apertureSize[1] + mesh.numberOfWidthBars;
            if (mesh.height % result.apertureSize[1] !== 0)
              result.numberOfSticks[1] =
                Math.floor(mesh.height / result.apertureSize[1] - 1) +
                mesh.numberOfWidthBars;
            if (mesh.width % result.apertureSize[0] === 0)
              result.numberOfSticks[0] =
                mesh.width / result.apertureSize[0] +
                1 +
                mesh.numberOfHeightBars;
            if (mesh.width % result.apertureSize[0] !== 0)
              result.numberOfSticks[0] =
                Math.floor(mesh.width / result.apertureSize[0] + 1) +
                mesh.numberOfHeightBars;
          } else {
            result.numberOfSticks[0] =
              Math.ceil(mesh.width / result.apertureSize[0]) +
              mesh.numberOfHeightBars;
            result.numberOfSticks[1] =
              Math.ceil(mesh.height / result.apertureSize[1]) +
              mesh.numberOfWidthBars;
          }

          result.backFilament =
            (mesh.height -
              (result.numberOfSticks[1] - 1) * result.apertureSize[1]) /
            2;
          result.leftFilament =
            (mesh.width -
              (result.numberOfSticks[0] - 1) * result.apertureSize[0]) /
            2;
          result.rightFilament =
            (mesh.width -
              (result.numberOfSticks[0] - 1) * result.apertureSize[0]) /
            2;
        }

        if (variable_2) result.frontFilament = 70;
        else if (variable_3) result.frontFilament = 71;
        else if (variable_4) result.frontFilament = 65;
        else
          result.frontFilament =
            (mesh.height -
              (result.numberOfSticks[1] - 1) * result.apertureSize[1]) /
            2;

        if (variable_1) {
          result.numberOfSticks[0] = Math.floor(
            (mesh.width - result.leftFilament - result.rightFilament) /
              result.apertureSize[0] +
              1
          );
          result.numberOfSticks[1] = Math.floor(
            (mesh.height - result.backFilament - result.frontFilament) /
              result.apertureSize[1] +
              1
          );
        }

        result.unitOfHeigthWeight =
          (((Math.PI * result.diameter[0] * result.diameter[0]) / 4) *
            0.007847 *
            mesh.height) /
          100;
        result.unitOfWidthWeight =
          (((Math.PI * result.diameter[1] * result.diameter[1]) / 4) *
            0.007847 *
            mesh.width) /
          100;
        result.totalHeigthWeight =
          result.unitOfHeigthWeight * result.numberOfSticks[0];
        result.totalWidthWeight =
          result.unitOfWidthWeight * result.numberOfSticks[1];
        result.unitMeshWeight =
          result.totalHeigthWeight + result.totalWidthWeight;
        result.totalWeight = result.unitMeshWeight * mesh.piece;

        setCalculated(result);
      } else {
        setError("Seçilen hasır için çap bilgisi bulunamadı.");
      }
    } else {
      setError("Lütfen Hasır Adını seçin.");
    }
  }, [mesh]);

  useEffect(() => {
    setError("");
    setManuelCalculated(initialValues.manuelCalculated);

    if (
      !manuelMesh.type ||
      !manuelMesh.height ||
      !manuelMesh.width ||
      !manuelMesh.diameter[0] ||
      !manuelMesh.diameter[1] ||
      !manuelMesh.apertureSize[0] ||
      !manuelMesh.apertureSize[1] ||
      !manuelMesh.frontFilament ||
      !manuelMesh.backFilament ||
      !manuelMesh.leftFilament ||
      !manuelMesh.rightFilament ||
      !manuelMesh.piece
    ) {
      return setError("Tüm alanların doldurulması zorunludur.");
    }

    const result = { ...initialValues.manuelCalculated };

    // Calculate the number of sticks for width and height
    result.numberOfSticks[0] =
      Math.ceil(
        (manuelMesh.width -
          manuelMesh.leftFilament -
          manuelMesh.rightFilament) /
          manuelMesh.apertureSize[0]
      ) +
      1 +
      manuelMesh.numberOfHeightBars;
    result.numberOfSticks[1] =
      Math.ceil(
        (manuelMesh.height -
          manuelMesh.frontFilament -
          manuelMesh.backFilament) /
          manuelMesh.apertureSize[1]
      ) +
      1 +
      manuelMesh.numberOfWidthBars;

    // Calculate unit and total weights
    result.unitOfHeigthWeight =
      (((Math.PI * manuelMesh.diameter[0] * manuelMesh.diameter[0]) / 4) *
        0.007847 *
        manuelMesh.height) /
      100;
    result.unitOfWidthWeight =
      (((Math.PI * manuelMesh.diameter[1] * manuelMesh.diameter[1]) / 4) *
        0.007847 *
        manuelMesh.width) /
      100;
    result.totalHeigthWeight =
      result.unitOfHeigthWeight * result.numberOfSticks[0];
    result.totalWidthWeight =
      result.unitOfWidthWeight * result.numberOfSticks[1];
    result.unitMeshWeight = result.totalHeigthWeight + result.totalWidthWeight;
    result.totalWeight = result.unitMeshWeight * manuelMesh.piece;

    setManuelCalculated(result);
  }, [manuelMesh]);

  // Inside the useEffect that runs when `calculated` changes
  useEffect(() => {
    setKesmeCalculations((prevState) => ({
      ...prevState,
      diameter: calculated.diameter,
      numberOfSticks: calculated.numberOfSticks,
      totalHeigthWeight: calculated.totalHeigthWeight,
      totalWidthWeight: calculated.totalWidthWeight,
      // Add this if you want to always reflect the current dimensions from mesh
      height: mesh.height,
      width: mesh.width,
      // Update other fields here
    }));
  }, [calculated, mesh.height, mesh.width]);

  useEffect(() => {
    setKesmeCalculationsFromManuel((prevState) => ({
      ...prevState,
      diameter: manuelMesh.diameter,
      numberOfSticks: manuelCalculated.numberOfSticks,
      totalHeigthWeight: manuelCalculated.totalHeigthWeight,
      totalWidthWeight: manuelCalculated.totalWidthWeight,
      // Add this if you want to always reflect the current dimensions from mesh
      height: manuelMesh.height,
      width: manuelMesh.width,
      // Update other fields here
    }));
  }, [manuelCalculated, manuelMesh.height, manuelMesh.width]); // Add mesh.height and mesh.width as dependencies

  // Function to handle tab change
  const handleTabChange = (index) => setTabIndex(index);

  // Function to check if all fields are filled
  const isButtonDisabled =
    !mesh.type ||
    !mesh.code ||
    !mesh.name ||
    !mesh.height ||
    !mesh.width ||
    !mesh.piece;

  // Function to open "KESME" tab
  const openKesmeTab = () => {
    if (!isButtonDisabled) {
      setCombinedKesmeCalculations((prevCalculations) => [
        ...prevCalculations,
        {
          source: "Otomatik Hesapla",
          diameter: calculated.diameter,
          numberOfSticks: calculated.numberOfSticks,
          totalHeigthWeight: calculated.totalHeigthWeight,
          totalWidthWeight: calculated.totalWidthWeight,
          height: mesh.height,
          width: mesh.width,
          piece: mesh.piece,
        },
      ]);
      setTabIndex(2); // Switch to "KESME" tab
    }
  };

  const handleTypeChange = (value) => {
    console.log("Selected mesh type:", value);
    setMesh((prevMesh) => {
      if (value === "P") {
        console.log("Type set to P, locking code to Q");
        return { ...prevMesh, type: value, code: "Q" };
      } else {
        return { ...prevMesh, type: value };
      }
    });
  };

  const meshTypeOptions = [
    { label: "Çit Hasırı", value: "Çit Hasırı" },
    { label: "Döşeme Hasırı", value: "Döşeme Hasırı" },
    { label: "Perde Hasırı", value: "Perde Hasırı" },
  ];

  const resetKesmeTab = () => {
    setCombinedKesmeCalculations([]);
  };

  const openKesmeTabFromManual = () => {
    if (!isButtonDisabled) {
      setCombinedKesmeCalculations((prevCalculations) => [
        ...prevCalculations,
        {
          source: "Manuel Hesapla",
          diameter: manuelMesh.diameter,
          numberOfSticks: manuelCalculated.numberOfSticks,
          totalHeigthWeight: manuelCalculated.totalHeigthWeight,
          totalWidthWeight: manuelCalculated.totalWidthWeight,
          height: manuelMesh.height,
          width: manuelMesh.width,
          piece: manuelMesh.piece,
        },
      ]);
      setTabIndex(2); // Switch to "KESME" tab
    }
  };

  return (
    <div className="flex flex-col w-screen">
     
    <Header />
    <Tabs selectedIndex={tabIndex} onSelect={handleTabChange}>
      <TabList>
        <Tab>Otomatik Hesapla</Tab>
        <Tab>Manuel Hesapla</Tab>
        <Tab>Kesme</Tab>
      </TabList>

      <TabPanel>
        < div className="flex flex-row items-start mr-4">
          <div className=" flex flex-col md:flex-column md:w-[25%] justify-start px-4 py-2 gap-10 mt-8">
            <div className="flex flex-col gap-3 flex-1 h-full justify-between ">
              <div className="flex items-center ">
                <span className="flex-1 text-sm font-semibold">
                  Hasır Tipi:
                </span>
                <div className="flex-1">
                  <Select
                    value={mesh.type}
                    onChange={(value) => handleTypeChange(value)}
                    options={meshTypeOptions.map((option) => option.label)}
                  />
                </div>
              </div>
              <div className="flex items-center">
                <span className="flex-1 text-sm font-semibold">
                  Hasır Kodu:
                </span>
                <div className="flex-1">
                  <Select
                    value={mesh.code}
                    onChange={(value) =>
                      setMesh((prevMesh) => ({ ...prevMesh, code: value }))
                    }
                    options={["", ...Object.keys(meshFeatures)]}
                    disabled={mesh.type === "Perde Hasırı"}
                  />
                  {console.log(
                    "Is code select disabled?",
                    mesh.type === "Perde Hasırı"
                  )}
                </div>
              </div>
              <div className="flex items-center">
                <span className="flex-1 text-sm font-semibold">Hasır Adı:</span>
                <div className="flex-1">
                  <Select
                    value={mesh.name}
                    onChange={(value) => {
                      setMesh((mesh) => ({ ...mesh, name: value }));
                    }}
                    options={[
                      "",
                      ...(mesh.code
                        ? Object.keys(meshFeatures[mesh.code])
                        : []),
                    ]}
                  />
                </div>
              </div>
              <div className="flex items-center">
                <span className="flex-1 text-sm font-semibold">
                  Hasır Boyu:
                </span>
                <div className="flex-1">
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
                        console.log("Hasır Boyu before update:", mesh.height);
                        setMesh((mesh) => ({
                          ...mesh,
                          height: parseInt(value),
                        }));
                        console.log(
                          "Hasır Boyu after update:",
                          parseInt(value)
                        );
                      }}
                      type="number"
                      max={1000}
                      min={0}
                    />
                  )}
                </div>
              </div>
              <div className="flex items-center">
                <span className="flex-1 text-sm font-semibold">Hasır Eni:</span>
                <div className="flex-1">
                  <Input
                    value={mesh.width}
                    onChange={(value) => {
                      setMesh((mesh) => ({ ...mesh, width: parseInt(value) }));
                    }}
                    type="number"
                    max={1000}
                    min={0}
                  />
                </div>
              </div>
              <div className="flex items-center">
                <span className="flex-1 text-sm font-semibold">
                  Boy Çubuğu +/-:
                </span>
                <div className="flex-1 flex">
                  <Input
                    value={mesh.numberOfHeightBars}
                    onChange={(value) => {
                      console.log(
                        "Boy Çubuğu current value:",
                        mesh.numberOfHeightBars
                      );
                      setMesh((mesh) => ({
                        ...mesh,
                        numberOfHeightBars: value,
                      }));
                      console.log("Boy Çubuğu updated value:", value);
                    }}
                    type="number"
                    disabled={mesh.type === "Perde Hasırı"}
                  />
                </div>
              </div>
              <div className="flex items-center">
                <span className="flex-1 text-sm font-semibold">
                  En Çubuğu +/-:
                </span>
                <div className="flex-1 flex">
                  <Input
                    value={mesh.numberOfWidthBars}
                    onChange={(value) => {
                      console.log(
                        "En Çubuğu current value:",
                        mesh.numberOfWidthBars
                      );
                      setMesh((mesh) => ({
                        ...mesh,
                        numberOfWidthBars: value,
                      }));
                      console.log("En Çubuğu updated value:", value);
                    }}
                    type="number"
                    disabled={mesh.type === "Perde Hasırı"}
                  />
                </div>
              </div>
              <div className="flex items-center">
                <span className="flex-1 text-sm font-semibold">
                  Sipariş Adedi:
                </span>
                <div className="flex-1 flex">
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
              {error && (
                <div className="bg-danger border border-alert-danger-fg-light text-white py-1 px-4 text-center text-sm font-semibold mt-2 rounded">
                  {error}
                </div>
              )}
            </div>
            <div className="flex flex-col max-w-full -mt-5 ">
              <div className="flex flex-col justify-between gap-x-4">
                <div className="mb-4 w-full">
                  <h2 className="text-sm font-semibold uppercase text-center">
                    Çubuk
                  </h2>
                  <table className="w-full border-collapse border text-xs border-gray-800 text-center">
                    <thead>
                      <tr className="bg-gray-100">
                        <th className="border p-2 font-semibold uppercase">
                          Özellikler
                        </th>
                        <th className="border p-2 font-semibold uppercase">
                          Boy Çubuğu
                        </th>
                        <th className="border p-2 font-semibold uppercase">
                          En Çubuğu
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr key="{key}">
                        <td className="border p-2 font-semibold uppercase">
                          ÇAP
                        </td>

                        <td key="{index}" className="border p-2">
                          {calculated.diameter[0]?.toFixed(2) || "N/A"}
                        </td>
                        <td key="{index}" className="border p-2">
                          {calculated.diameter[1]?.toFixed(2) || "N/A"}
                        </td>
                      </tr>
                      <tr key="{key}">
                        <td className="border p-2 font-semibold uppercase">
                          GÖZ ARALIĞI
                        </td>
                        <td key="{index}" className="border p-2">
                          {calculated.apertureSize[0]?.toFixed(2) || "N/A"}
                        </td>
                        <td key="{index}" className="border p-2">
                          {calculated.apertureSize[1]?.toFixed(2) || "N/A"}
                        </td>
                      </tr>
                      <tr key="{key}">
                        <td className="border p-2 font-semibold uppercase">
                          ÇUBUK SAYISI
                        </td>
                        <td key="{index}" className="border p-2">
                          {calculated.numberOfSticks[0] ?? "N/A"}
                        </td>
                        <td key="{index}" className="border p-2">
                          {calculated.numberOfSticks[1] ?? "N/A"}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <div className="mb-4 w-full">
                  <h2 className="text-sm font-semibold uppercase text-center">
                    Filizler
                  </h2>
                  <table className="w-full border-collapse border text-xs border-gray-800 text-center">
                    <thead>
                      <tr className="bg-gray-100">
                        <th className="border p-2 font-semibold uppercase">
                          Özellikler
                        </th>
                        <th className="border p-2 font-semibold uppercase">
                          Değerler
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr key="{key}">
                        <td className="border p-2 font-semibold uppercase">
                          Ön Filiz Boyu
                        </td>
                        <td className="border p-2">
                          {calculated.frontFilament?.toFixed(2) || "N/A"}
                        </td>
                      </tr>
                      <tr key="{key}">
                        <td className="border p-2 font-semibold uppercase">
                          Arka Filiz Boyu
                        </td>
                        <td className="border p-2">
                          {calculated.backFilament?.toFixed(2) || "N/A"}
                        </td>
                      </tr>
                      <tr key="{key}">
                        <td className="border p-2 font-semibold uppercase">
                          {" "}
                          Sağ Filiz Boyu
                        </td>
                        <td className="border p-2">
                          {calculated.rightFilament?.toFixed(2) || "N/A"}
                        </td>
                      </tr>
                      <tr key="{key}">
                        <td className="border p-2 font-semibold uppercase">
                          {" "}
                          Sol Filiz Boyu
                        </td>
                        <td className="border p-2">
                          {calculated.leftFilament?.toFixed(2) || "N/A"}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="mb-4">
                <h2 className="text-sm font-semibold uppercase text-center">
                  Ağırlık
                </h2>
                <table className="w-full border-collapse border text-xs border-gray-800 text-center">
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="border p-2 font-semibold uppercase">
                        Özellikler
                      </th>
                      <th className="border p-2 font-semibold uppercase">
                        Değerler
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr key="{key}">
                      <td className="border p-2 font-semibold uppercase">
                        Boy Birim KG
                      </td>
                      <td className="border p-2">
                        {calculated.unitOfHeigthWeight?.toFixed(3) || "N/A"}
                      </td>
                    </tr>

                    <tr key="{key}">
                      <td className="border p-2 font-semibold uppercase">
                        En Birim KG
                      </td>
                      <td className="border p-2">
                        {calculated.unitOfWidthWeight?.toFixed(3) || "N/A"}
                      </td>
                    </tr>
                    <tr key="{key}">
                      <td className="border p-2 font-semibold uppercase">
                        Boy Toplam KG
                      </td>
                      <td className="border p-2">
                        {" "}
                        {calculated.totalHeigthWeight?.toFixed(2) || "N/A"}
                      </td>
                    </tr>
                    <tr key="{key}">
                      <td className="border p-2 font-semibold uppercase">
                        En Toplam KG
                      </td>
                      <td className="border p-2">
                        {calculated.totalWidthWeight?.toFixed(2) || "N/A"}
                      </td>
                    </tr>
                    <tr key="{key}">
                      <td className="border p-2 font-semibold uppercase">
                        Hasır Birim KG
                      </td>
                      <td className="border p-2">
                        {" "}
                        {calculated.unitMeshWeight?.toFixed(2) || "N/A"}
                      </td>
                    </tr>
                    <tr key="{key}">
                      <td className="border p-2 font-semibold uppercase">
                        {" "}
                        Toplam Ağırlık
                      </td>
                      <td className="border p-2">
                        {calculated.totalWeight?.toFixed(2) || "N/A"}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
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
      </TabPanel>
      <TabPanel>
        <>
          <div className="flex flex-col md:flex-row justify-start px-4 py-2 gap-10 mt-8">
            <div className="flex flex-col gap-3 w-1/3">
              <div className="flex items-center">
                <span className="flex-1 text-sm font-semibold">
                  Hasır Tipi:
                </span>
                <span className="flex-1">Özel Hasır</span>
              </div>

              <div className="flex items-center">
                <span className="flex-1 text-sm font-semibold">
                  Hasır Boyu:
                </span>
                <div className="flex-1 flex">
                  <Input
                    value={manuelMesh.height}
                    onChange={(value) => {
                      setManuelMesh((manuelMesh) => ({
                        ...manuelMesh,
                        height: parseInt(value),
                      }));
                    }}
                    type="number"
                    max={1000}
                    min={0}
                  />
                </div>
              </div>
              <div className="flex items-center">
                <span className="flex-1 text-sm font-semibold">Hasır Eni:</span>
                <div className="flex-1 flex">
                  <Input
                    value={manuelMesh.width}
                    onChange={(value) => {
                      setManuelMesh((manuelMesh) => ({
                        ...manuelMesh,
                        width: parseInt(value),
                      }));
                    }}
                    type="number"
                    max={1000}
                    min={0}
                  />
                </div>
              </div>
              <div className="flex items-center">
                <span className="flex-1 text-sm font-semibold">
                  Boy Çubuğu +/-:
                </span>
                <div className="flex-1 flex">
                  <Input
                    value={manuelMesh.numberOfHeightBars}
                    onChange={(value) => {
                      setManuelMesh((manuelMesh) => ({
                        ...manuelMesh,
                        numberOfHeightBars: value,
                      }));
                    }}
                    type="number"
                  />
                </div>
              </div>
              <div className="flex items-center">
                <span className="flex-1 text-sm font-semibold">
                  En Çubuğu +/-:
                </span>
                <div className="flex-1 flex">
                  <Input
                    value={manuelMesh.numberOfWidthBars}
                    onChange={(value) => {
                      setManuelMesh((manuelMesh) => ({
                        ...manuelMesh,
                        numberOfWidthBars: value,
                      }));
                    }}
                    type="number"
                  />
                </div>
              </div>
              <div className="flex items-center">
                <span className="flex-1 text-sm font-semibold">
                  Boy Çubuk Çapı:
                </span>
                <div className="flex-1 flex">
                  <Input
                    value={manuelMesh.diameter[0]}
                    onChange={(value) => {
                      setManuelMesh((prevManuelMesh) => {
                        return {
                          ...prevManuelMesh,
                          diameter: [value, prevManuelMesh.diameter[1]],
                        };
                      });
                    }}
                    type="number"
                  />
                </div>
              </div>
              <div className="flex items-center">
                <span className="flex-1 text-sm font-semibold">
                  En Çubuk Çapı:
                </span>
                <div className="flex-1 flex">
                  <Input
                    value={manuelMesh.diameter[1]}
                    onChange={(value) => {
                      setManuelMesh((prevManuelMesh) => {
                        return {
                          ...prevManuelMesh,
                          diameter: [prevManuelMesh.diameter[0], value],
                        };
                      });
                    }}
                    type="number"
                  />
                </div>
              </div>
              <div className="flex items-center">
                <span className="flex-1 text-sm font-semibold">
                  Boy Göz Aralığı:
                </span>
                <div className="flex-1 flex">
                  <Input
                    value={manuelMesh.apertureSize[0]}
                    onChange={(value) => {
                      setManuelMesh((prevManuelMesh) => {
                        return {
                          ...prevManuelMesh,
                          apertureSize: [value, prevManuelMesh.apertureSize[1]],
                        };
                      });
                    }}
                    type="number"
                  />
                </div>
              </div>
              <div className="flex items-center">
                <span className="flex-1 text-sm font-semibold">
                  En Göz Aralığı:
                </span>
                <div className="flex-1 flex">
                  <Input
                    value={manuelMesh.apertureSize[1]}
                    onChange={(value) => {
                      setManuelMesh((prevManuelMesh) => {
                        return {
                          ...prevManuelMesh,
                          apertureSize: [prevManuelMesh.apertureSize[0], value],
                        };
                      });
                    }}
                    type="number"
                  />
                </div>
              </div>
              <div className="flex items-center">
                <span className="flex-1 text-sm font-semibold">
                  Ön Filiz Boyu:
                </span>
                <div className="flex-1 flex">
                  <Input
                    value={manuelMesh.frontFilament}
                    onChange={(value) => {
                      setManuelMesh((manuelMesh) => ({
                        ...manuelMesh,
                        frontFilament: value,
                      }));
                    }}
                    type="number"
                  />
                </div>
              </div>
              <div className="flex items-center">
                <span className="flex-1 text-sm font-semibold">
                  Arka Filiz Boyu:
                </span>
                <div className="flex-1 flex">
                  <Input
                    value={manuelMesh.backFilament}
                    onChange={(value) => {
                      setManuelMesh((manuelMesh) => ({
                        ...manuelMesh,
                        backFilament: value,
                      }));
                    }}
                    type="number"
                  />
                </div>
              </div>
              <div className="flex items-center">
                <span className="flex-1 text-sm font-semibold">
                  Sağ Filiz Boyu:
                </span>
                <div className="flex-1 flex">
                  <Input
                    value={manuelMesh.rightFilament}
                    onChange={(value) => {
                      setManuelMesh((manuelMesh) => ({
                        ...manuelMesh,
                        rightFilament: value,
                      }));
                    }}
                    type="number"
                  />
                </div>
              </div>
              <div className="flex items-center">
                <span className="flex-1 text-sm font-semibold">
                  Sol Filiz Boyu:
                </span>
                <div className="flex-1 flex">
                  <Input
                    value={manuelMesh.leftFilament}
                    onChange={(value) => {
                      setManuelMesh((manuelMesh) => ({
                        ...manuelMesh,
                        leftFilament: value,
                      }));
                    }}
                    type="number"
                  />
                </div>
              </div>
              <div className="flex items-center">
                <span className="flex-1 text-sm font-semibold">
                  Sipariş Adedi:
                </span>
                <div className="flex-1 flex">
                  <Input
                    value={manuelMesh.piece}
                    onChange={(value) => {
                      setManuelMesh((manuelMesh) => ({
                        ...manuelMesh,
                        piece: value,
                      }));
                    }}
                    type="number"
                  />
                </div>
              </div>
              <button
                className={`text-white text-sm font-bold py-1 px-4 rounded ${
                  isButtonDisabled
                    ? "bg-gray-500"
                    : "bg-blue-500 hover:bg-blue-700"
                }`}
                disabled={isButtonDisabled}
                onClick={openKesmeTabFromManual}
              >
                Kesmeye Gönder
              </button>
              {error && (
                <div className="bg-danger border border-alert-danger-fg-light text-white py-1 px-4 text-center text-sm font-semibold mt-2 rounded">
                  {error}
                </div>
              )}
            </div>
            <div className="flex flex-col md:w-[60%] mt-4 gap-y-4 ">
              <div className="mb-4 w-full">
                <h2 className="text-sm font-semibold uppercase text-center">
                  Çubuk
                </h2>
                <table className="w-full border-collapse border text-xs border-gray-800 text-center">
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="border p-2 font-semibold uppercase">
                        Özellikler
                      </th>
                      <th className="border p-2 font-semibold uppercase">
                        Boy Çubuğu
                      </th>
                      <th className="border p-2 font-semibold uppercase">
                        En Çubuğu
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr key="{key}">
                      <td className="border p-2 font-semibold uppercase">
                        ÇAP
                      </td>

                      <td key="{index}" className="border p-2">
                        {manuelMesh.diameter[0]?.toFixed(2) || "N/A"}
                      </td>
                      <td key="{index}" className="border p-2">
                        {manuelMesh.diameter[1]?.toFixed(2) || "N/A"}
                      </td>
                    </tr>
                    <tr key="{key}">
                      <td className="border p-2 font-semibold uppercase">
                        GÖZ ARALIĞI
                      </td>
                      <td key="{index}" className="border p-2">
                        {manuelMesh.apertureSize[0]?.toFixed(2) || "N/A"}
                      </td>
                      <td key="{index}" className="border p-2">
                        {manuelMesh.apertureSize[1]?.toFixed(2) || "N/A"}
                      </td>
                    </tr>
                    <tr key="{key}">
                      <td className="border p-2 font-semibold uppercase">
                        ÇUBUK SAYISI
                      </td>
                      <td key="{index}" className="border p-2">
                        {manuelCalculated.numberOfSticks[0] ?? "N/A"}
                      </td>
                      <td key="{index}" className="border p-2">
                        {manuelCalculated.numberOfSticks[1] ?? "N/A"}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div className="mb-4 w-full">
                <h2 className="text-sm font-semibold uppercase text-center">
                  Filizler
                </h2>
                <table className="w-full border-collapse border text-xs border-gray-800 text-center">
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="border p-2 font-semibold uppercase">
                        Özellikler
                      </th>
                      <th className="border p-2 font-semibold uppercase">
                        Değerler
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr key="{key}">
                      <td className="border p-2 font-semibold uppercase">
                        Ön Filiz Boyu
                      </td>
                      <td className="border p-2">
                        {manuelMesh.frontFilament?.toFixed(2) || "N/A"}
                      </td>
                    </tr>
                    <tr key="{key}">
                      <td className="border p-2 font-semibold uppercase">
                        Arka Filiz Boyu
                      </td>
                      <td className="border p-2">
                        {manuelMesh.backFilament?.toFixed(2) || "N/A"}
                      </td>
                    </tr>
                    <tr key="{key}">
                      <td className="border p-2 font-semibold uppercase">
                        {" "}
                        Sağ Filiz Boyu
                      </td>
                      <td className="border p-2">
                        {manuelMesh.rightFilament?.toFixed(2) || "N/A"}
                      </td>
                    </tr>
                    <tr key="{key}">
                      <td className="border p-2 font-semibold uppercase">
                        {" "}
                        Sol Filiz Boyu
                      </td>
                      <td className="border p-2">
                        {manuelMesh.leftFilament?.toFixed(2) || "N/A"}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div className="mb-4">
                <h2 className="text-sm font-semibold uppercase text-center">
                  Ağırlık
                </h2>
                <table className="w-full border-collapse border text-xs border-gray-800 text-center">
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="border p-2 font-semibold uppercase">
                        Özellikler
                      </th>
                      <th className="border p-2 font-semibold uppercase">
                        Değerler
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr key="{key}">
                      <td className="border p-2 font-semibold uppercase">
                        Boy Birim KG
                      </td>
                      <td className="border p-2">
                        {manuelCalculated.unitOfHeigthWeight?.toFixed(3) ||
                          "N/A"}
                      </td>
                    </tr>

                    <tr key="{key}">
                      <td className="border p-2 font-semibold uppercase">
                        En Birim KG
                      </td>
                      <td className="border p-2">
                        {manuelCalculated.unitOfWidthWeight?.toFixed(3) ||
                          "N/A"}
                      </td>
                    </tr>
                    <tr key="{key}">
                      <td className="border p-2 font-semibold uppercase">
                        Boy Toplam KG
                      </td>
                      <td className="border p-2">
                        {" "}
                        {manuelCalculated.totalHeigthWeight?.toFixed(2) ||
                          "N/A"}
                      </td>
                    </tr>
                    <tr key="{key}">
                      <td className="border p-2 font-semibold uppercase">
                        En Toplam KG
                      </td>
                      <td className="border p-2">
                        {manuelCalculated.totalWidthWeight?.toFixed(2) || "N/A"}
                      </td>
                    </tr>
                    <tr key="{key}">
                      <td className="border p-2 font-semibold uppercase">
                        Hasır Birim KG
                      </td>
                      <td className="border p-2">
                        {" "}
                        {manuelCalculated.unitMeshWeight?.toFixed(2) || "N/A"}
                      </td>
                    </tr>
                    <tr key="{key}">
                      <td className="border p-2 font-semibold uppercase">
                        {" "}
                        Toplam Ağırlık
                      </td>
                      <td className="border p-2">
                        {manuelCalculated.totalWeight?.toFixed(2) || "N/A"}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
          {!!manuelCalculated.totalWeight && (
            <div className="flex justify-center items-center mt-8 mb-16">
              <ManuelMesh
                manuelCalculated={manuelCalculated}
                height={manuelMesh.width}
                width={manuelMesh.height}
                frontFilament={manuelMesh.frontFilament}
                backFilament={manuelMesh.backFilament}
                leftFilament={manuelMesh.leftFilament}
                rightFilament={manuelMesh.rightFilament}
                apertureSize={manuelMesh.apertureSize}
                firm="Mongery Yazılım"
                diameter={manuelMesh.diameter}
                type={manuelMesh.type}
                piece={manuelMesh.piece}
                quality="TS 4559 EKİM 1985"
                stroke="black"
              />
            </div>
          )}
        </>
      </TabPanel>
      <TabPanel>
        <div className="w-full flex flex-col items-center">
          <div className="text-lg font-semibold uppercase text-center mb-4">
            <h2>KESME BİLGİLERİ</h2>
            <hr className="border-border-light dark:border-border-dark border-b-2" />
          </div>

          <div className="overflow-x-auto w-full">
            <table id="kesmeTable" className="min-w-full bg-white">
              <thead>
                <tr>
                  <th
                    className="px-6 py-4 text-center text-sm font-semibold text-gray-900"
                    colSpan={4}
                  >
                    BOY ÇUBUĞU
                  </th>
                  <th
                    className="px-6 py-4 text-center text-sm font-semibold text-gray-900"
                    colSpan={4}
                  >
                    EN ÇUBUĞU
                  </th>
                </tr>
                <tr>
                  <th
                    className="px-6 py-4 text-center text-sm font-semibold text-gray-900 cursor-pointer"
                    onClick={() => toggleSort("diameter0")}
                  >
                    ÇAP
                  </th>
                  <th
                    className="px-6 py-4 text-center text-sm font-semibold text-gray-900 cursor-pointer"
                    onClick={() => toggleSort("height")}
                  >
                    UZUNLUK
                  </th>
                  <th
                    className="px-6 py-4 text-center text-sm font-semibold text-gray-900 cursor-pointer"
                    onClick={() => toggleSort("numberOfSticks0")}
                  >
                    ADET
                  </th>
                  <th
                    className="px-6 py-4 text-center text-sm font-semibold text-gray-900 cursor-pointer"
                    onClick={() => toggleSort("totalHeigthWeight")}
                  >
                    AĞIRLIK
                  </th>
                  <th
                    className="px-6 py-4 text-center text-sm font-semibold text-gray-900 cursor-pointer"
                    onClick={() => toggleSort("diameter1")}
                  >
                    ÇAP
                  </th>
                  <th
                    className="px-6 py-4 text-center text-sm font-semibold text-gray-900 cursor-pointer"
                    onClick={() => toggleSort("width")}
                  >
                    UZUNLUK
                  </th>
                  <th
                    className="px-6 py-4 text-center text-sm font-semibold text-gray-900 cursor-pointer"
                    onClick={() => toggleSort("numberOfSticks1")}
                  >
                    ADET
                  </th>
                  <th
                    className="px-6 py-4 text-center font-semibold text-gray-900 cursor-pointer"
                    onClick={() => toggleSort("totalWidthWeight")}
                  >
                    AĞIRLIK
                  </th>
                </tr>
              </thead>
              <tbody>
                {combinedKesmeCalculations.map((calculation, index) => (
                  <tr key={index} className="text-center">
                    <td className="px-6 py-4">
                      {calculation.diameter[0]?.toFixed(2) || "N/A"}
                    </td>
                    <td className="px-6 py-4">{calculation.height}</td>
                    <td className="px-6 py-4">
                      {calculation.numberOfSticks[0] * calculation.piece}
                    </td>
                    <td className="px-6 py-4">
                      {(
                        calculation.totalHeigthWeight * calculation.piece
                      ).toFixed(2) || "N/A"}
                    </td>
                    <td className="px-6 py-4">
                      {calculation.diameter[1]?.toFixed(2) || "N/A"}
                    </td>
                    <td className="px-6 py-4">{calculation.width}</td>
                    <td className="px-6 py-4">
                      {calculation.numberOfSticks[1] * calculation.piece}
                    </td>
                    <td className="px-6 py-4">
                      {(
                        calculation.totalWidthWeight * calculation.piece
                      ).toFixed(2) || "N/A"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-4 flex justify-center w-full space-x-4">
            <button
              className="text-white font-bold py-2 px-4 rounded bg-blue-500 hover:bg-blue-700"
              onClick={resetKesmeTab}
            >
              Sıfırla
            </button>
            <button
              className="text-white font-bold py-2 px-4 rounded bg-green-500 hover:bg-green-700"
              onClick={printTable}
            >
              Yazdır
            </button>
          </div>
        </div>
      </TabPanel>
    </Tabs>
    </div>
  );
}

export default App;
