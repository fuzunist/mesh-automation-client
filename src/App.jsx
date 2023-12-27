import { useState } from "react";
// import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import AutomaticTab from "./components/Tabs/AutomaticTab";
import ManuelTab from "./components/Tabs/ManuelTab";
import KesmeTab from "./components/Tabs/KesmeTab";
import OrdersTab from "./components/Tabs/OrdersTab";
import Header from "./components/Header";
import {
  Tabs,
  TabsHeader,
  TabsBody,
  Tab,
  TabPanel,
} from "@material-tailwind/react";

function App() {
  const [isKesmeTabActive, setIsKesmeTabActive] = useState(false);

  const handleKesmeListChange = (kesmeList) => {
    // Activate the KESME tab only if kesmeList is not empty
    setIsKesmeTabActive(kesmeList && kesmeList.length > 0);
  };

  return (
    <Tabs value="1">
      <Header>
      <TabsHeader
          className="bg-transparent"
          indicatorProps={{
            className: "bg-gray-900/10 shadow-none !text-gray-900",
          }}
        >
          <Tab className="text-sm " key={"auto"} value={"1"}>
            Otomatik Hesapla
          </Tab>
          <Tab className="text-sm" key={"manuel"} value={"2"}>
            Manuel Hesapla
          </Tab>
          <Tab className="text-sm" key={"orders"} value={"4"}>
            Siparişler
          </Tab>
          <Tab 
            className={`text-sm ${!isKesmeTabActive ? 'opacity-50 cursor-not-allowed' : ''}`} 
            key={"kesme"} 
            value={"3"} 
            disabled={!isKesmeTabActive}
          >
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
        <TabPanel key={"orders"} value={"4"}>
          <OrdersTab  />
        </TabPanel>
        <TabPanel key={"kesme"} value={"3"}>
      <KesmeTab onKesmeListChange={handleKesmeListChange} />
    </TabPanel>
      </TabsBody>
    </Tabs>

  );
}

export default App;
