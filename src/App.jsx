import { useState } from "react";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import AutomaticTab from "./components/Tabs/AutomaticTab";
import ManuelTab from "./components/Tabs/ManuelTab";
import KesmeTab from "./components/Tabs/KesmeTab";

function App() {
  const [tabIndex, setTabIndex] = useState(0);
  const handleTabChange = (index) => setTabIndex(index);

  return (
    <Tabs selectedIndex={tabIndex} onSelect={handleTabChange}>
      <TabList>
        <Tab>Otomatik Hesapla</Tab>
        <Tab>Manuel Hesapla</Tab>
        <Tab>Kesme</Tab>
      </TabList>

      <TabPanel>
        <AutomaticTab />
      </TabPanel>
      <TabPanel>
        <ManuelTab />
      </TabPanel>
      <TabPanel>
        <KesmeTab />
      </TabPanel>
    </Tabs>
  );
}

export default App;
