import { useState } from "react";
// import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import AutomaticTab from "./components/Tabs/AutomaticTab";
import ManuelTab from "./components/Tabs/ManuelTab";
import KesmeTab from "./components/Tabs/KesmeTab";
import Header from "./components/Header";
import {
  Tabs,
  TabsHeader,
  TabsBody,
  Tab,
  TabPanel,
} from "@material-tailwind/react";

function App() {
  const [tabIndex, setTabIndex] = useState(1);
  const handleTabChange = (index) => setTabIndex(index);
  console.log(tabIndex, "tabb");
  return (
    <Tabs value="1">
      <Header>
        <TabsHeader
          className="bg-transparent justify-center items-center w-full "
          indicatorProps={{
            className: "bg-gray-900/10 shadow-none !text-gray-900",
          }}
        >
          <Tab className="text-sm lg:text-base" key={"auto"} value={"1"}>
            Otomatik Hesapla
          </Tab>
          <Tab className="text-sm lg:text-base" key={"manuel"} value={"2"}>
            Manuel Hesapla
          </Tab>
          <Tab className="text-sm lg:text-base" key={"kesme"} value={"3"}>
            Kesme
          </Tab>
        </TabsHeader>
      </Header>

      <TabsBody>
        <TabPanel key={"auto"} value={"1"}>
          <AutomaticTab />
        </TabPanel>
        <TabPanel key={"manuel"} value={"2"}>
          <ManuelTab />
        </TabPanel>
        <TabPanel key={"kesme"} value={"3"}>
          <KesmeTab />
        </TabPanel>
      </TabsBody>
    </Tabs>
  );
}

export default App;
