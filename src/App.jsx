import { useState, useEffect, useRef } from "react";
import meshFeatures from "./contants/meshFeatures";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import "react-tabs/style/react-tabs.css";
import { handleDeleteRow } from "./utils/tableHelpers";
import AutomaticTab from "./components/Tabs/AutomaticTab";
import ManuelTab from "./components/Tabs/ManuelTab";
import KesmeTab from "./components/Tabs/KesmeTab";
import { initialValues, meshTypeOptions } from "./contants/meshValues";

import {
  variable_1,
  variable_2,
  variable_3,
  variable_4,
} from "./contants/meshVariables";

function App() {
  const [calculated, setCalculated] = useState(initialValues.calculated);
  const [manuelCalculated, setManuelCalculated] = useState(
    initialValues.manuelCalculated
  );
  const [mesh, setMesh] = useState(initialValues.mesh);
  const [manuelMesh, setManuelMesh] = useState(initialValues.manuelMesh);

  const [showMessage, setShowMessage] = useState(false);

  const [filamentError, setFilamentError] = useState("");
  const [manuelFilamentError, setManuelFilamentError] = useState("");

  const [error, setError] = useState("");
  const [manuelError, setManuelError] = useState("");
  const [tabIndex, setTabIndex] = useState(0);
  const tabsRef = useRef(null);

  const [lastModifiedGroup, setLastModifiedGroup] = useState(null);
  const [isManualChange, setIsManualChange] = useState(false);

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

  let isMeshValid = true;

  useEffect(() => {
    setCalculated(initialValues.calculated);
    // console.log("mesh.type:", mesh.type);
    // console.log("mesh.code:", mesh.code);
    // console.log("mesh.name:", mesh.name);
    // console.log("mesh.height:", mesh.height);
    // console.log("mesh.width:", mesh.width);
    // console.log("mesh.piece:", mesh.piece);
    // console.log("mesh valid mi:", isMeshValid);

    isMeshValid =
      mesh.type &&
      mesh.code &&
      mesh.name &&
      mesh.height &&
      mesh.width &&
      mesh.piece;

    if (!isMeshValid) {
      setError("Tüm alanların doldurulması zorunludur.");
      return;
    }

    setError("");

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

        if (variable_1(mesh)) {
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

        if (variable_2(mesh)) result.frontFilament = 70;
        else if (variable_3(mesh)) result.frontFilament = 71;
        else if (variable_4(mesh)) result.frontFilament = 65;
        else
          result.frontFilament =
            (mesh.height -
              (result.numberOfSticks[1] - 1) * result.apertureSize[1]) /
            2;

        if (variable_1(mesh)) {
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

        let localFilamentError = [];
        if (result.frontFilament < 0) {
          localFilamentError.push("Ön filiz boyu sıfırdan küçük olamaz.");
          result.frontFilament = 0;
        }
        if (result.backFilament < 0) {
          localFilamentError.push("Arka filiz boyu sıfırdan küçük olamaz.");
          result.backFilament = 0;
        }
        if (result.leftFilament < 0) {
          localFilamentError.push("Sol filiz boyu sıfırdan küçük olamaz.");
          result.leftFilament = 0;
        }
        if (result.rightFilament < 0) {
          localFilamentError.push("Sağ filiz boyu sıfırdan küçük olamaz.");
          result.rightFilament = 0;
        }

        if (localFilamentError.length > 0) {
          setFilamentError(localFilamentError.join(" "));
        } else {
          setFilamentError("");
          setCalculated(result);
        }
      } else {
        setError("Seçilen hasır için çap bilgisi bulunamadı.");
      }
    } else {
      setError("Lütfen Hasır Adını seçin.");
    }
  }, [mesh]);

  let isManuelMeshValid = true;

  useEffect(() => {
    if (!isManualChange) return;

    setManuelCalculated(initialValues.manuelCalculated);

    isManuelMeshValid =
      manuelMesh.type &&
      manuelMesh.height &&
      manuelMesh.width &&
      manuelMesh.diameter[0] &&
      manuelMesh.diameter[1] &&
      manuelMesh.apertureSize[0] &&
      manuelMesh.apertureSize[1] &&
      manuelMesh.frontFilament &&
      manuelMesh.backFilament &&
      manuelMesh.leftFilament &&
      manuelMesh.rightFilament &&
      manuelMesh.piece;

    if (!isManuelMeshValid) {
      setManuelError("Tüm alanların doldurulması zorunludur.");
      return;
    }

    setManuelError("");
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

    if (lastModifiedGroup === "A") {
      result.backFilament =
        (manuelMesh.height -
          (result.numberOfSticks[1] - 1) * manuelMesh.apertureSize[1]) /
        2;
      result.leftFilament =
        (manuelMesh.width -
          (result.numberOfSticks[0] - 1) * manuelMesh.apertureSize[0]) /
        2;
      result.rightFilament =
        (manuelMesh.width -
          (result.numberOfSticks[0] - 1) * manuelMesh.apertureSize[0]) /
        2;
      result.frontFilament =
        (manuelMesh.height -
          (result.numberOfSticks[1] - 1) * manuelMesh.apertureSize[1]) /
        2;
    } else if (lastModifiedGroup === "B") {
      manuelMesh.apertureSize[0] =
        meshFeatures["Q"]["106/106"].apertureSize.height / 10;
      manuelMesh.apertureSize[1] =
        meshFeatures["Q"]["106/106"].apertureSize.width / 10;
    }

    let localFilamentError = [];
    if (result.frontFilament < 0) {
      localFilamentError.push("Ön filiz boyu sıfırdan küçük olamaz.");
      result.frontFilament = 0;
    }
    if (result.backFilament < 0) {
      localFilamentError.push("Arka filiz boyu sıfırdan küçük olamaz.");
      result.backFilament = 0;
    }
    if (result.leftFilament < 0) {
      localFilamentError.push("Sol filiz boyu sıfırdan küçük olamaz.");
      result.leftFilament = 0;
    }
    if (result.rightFilament < 0) {
      localFilamentError.push("Sağ filiz boyu sıfırdan küçük olamaz.");
      result.rightFilament = 0;
    }

    if (localFilamentError.length > 0) {
      setManuelFilamentError(localFilamentError.join(" "));
    } else {
      setIsManualChange(false);
      setLastModifiedGroup(null);
      setManuelFilamentError("");
      setManuelCalculated(result);
    }
  }, [manuelMesh, lastModifiedGroup, isManualChange]);

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

  const deleteRow = (index) => {
    handleDeleteRow(setCombinedKesmeCalculations, index);
  };

  // Function to check if all fields are filled
  const isButtonDisabled =
    !mesh.type ||
    !mesh.code ||
    !mesh.name ||
    !mesh.height ||
    !mesh.width ||
    !mesh.piece ||
    filamentError;

  const handleTypeChange = (value) => {
    setMesh((prevMesh) => {
      if (value === "P") {
        return { ...prevMesh, type: value, code: "Q" };
      } else {
        return { ...prevMesh, type: value };
      }
    });
  };

  const resetKesmeTab = () => {
    setCombinedKesmeCalculations([]);
  };

  return (
    <Tabs selectedIndex={tabIndex} onSelect={handleTabChange}>
      <TabList>
        <Tab>Otomatik Hesapla</Tab>
        <Tab>Manuel Hesapla</Tab>
        <Tab>Kesme</Tab>
      </TabList>

      <TabPanel>
        <AutomaticTab
          mesh={mesh}
          setMesh={setMesh}
          meshTypeOptions={meshTypeOptions}
          handleTypeChange={handleTypeChange}
          meshFeatures={meshFeatures}
          setCalculated={setCalculated}
          initialValues={initialValues}
          calculated={calculated}
          setFilamentError={setFilamentError}
          isButtonDisabled={isButtonDisabled}
          setShowMessage={setShowMessage}
          showMessage={showMessage}
          error={error}
          filamentError={filamentError}
        />
      </TabPanel>
      <TabPanel>
        <ManuelTab
          manuelMesh={manuelMesh}
          manuelCalculated={manuelCalculated}
          manuelError={manuelError}
          setManuelMesh={setManuelMesh}
          setIsManualChange={setIsManualChange}
          setLastModifiedGroup={setLastModifiedGroup}
          isButtonDisabled={isButtonDisabled}
          showMessage={showMessage}
          setShowMessage={setShowMessage}
        />
      </TabPanel>
      <TabPanel>
        <KesmeTab />
      </TabPanel>
    </Tabs>
  );
}

export default App;
