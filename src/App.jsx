import React, { useState, useEffect, useRef} from 'react';
import AutomaticTab from './components/Tabs/AutomaticTab';
import ManuelTab from './components/Tabs/ManuelTab';
import KesmeTab from './components/Tabs/KesmeTab';
import OrdersTab from './components/Tabs/OrdersTab';
import Header from './components/Header';
import { Tabs, TabsHeader, TabsBody, Tab, TabPanel } from '@material-tailwind/react';


function App() {
  const [isKesmeTabActive, setIsKesmeTabActive] = useState(false);
  const [activeTab, setActiveTab] = useState('1'); 
  const [meshData, setMeshData] = useState({});
  const divRef = useRef(false);

  const openAutomaticTabWithMeshData = (data) => {
    console.log('Function openAutomaticTabWithMeshData called with data:', data);

    setMeshData(data);
    setActiveTab('1'); // Set active tab to the first one
    divRef.current = true;
    console.log('openAutomaticTabWithMeshData: activeTab set to "1"');

  };


  const clearEditingMeshData = () => {
    setMeshData({});
  };


  const handleTabChange = (value) => {
    console.log(`handleTabChange called with value: ${value}`);

    // You can also map the values to the actual names if necessary
    const tabNames = {
      '1': 'Otomatik Hesapla',
      '2': 'Manuel Hesapla',
      '3': 'Kesme',
      '4': 'Siparişler',
    };
    
    console.log(`handleTabChange called with value: ${value}`);

    setActiveTab(value);
    

  };

  const handleKesmeListChange = (kesmeList) => {
    setIsKesmeTabActive(kesmeList && kesmeList.length > 0);
  };

  useEffect(() => {
    console.log(`Active tab is now: ${activeTab}`);
  }, [activeTab]);

  const switchToAutomaticTab = () => {
    console.log("switchToAutomaticTab called");

    setActiveTab('1'); // Assuming '1' is the value for AutomaticTab
  };

  return (
    <div ref= {divRef} className='App'>
      <Tabs value={activeTab ?? '1'} onChange={handleTabChange}>
        <Header>
          <TabsHeader className="bg-transparent" indicatorProps={{ className: 'bg-gray-900/10 shadow-none !text-gray-900' }}>
            <Tab value="1">Otomatik Hesapla</Tab>
            <Tab value="2">Manuel Hesapla</Tab>
            <Tab value="4">Siparişler</Tab>
            <Tab value="3" disabled={!isKesmeTabActive}>
              Kesme
            </Tab>
          </TabsHeader>
        </Header>
        <TabsBody>
          <TabPanel key="1" value="1">
            <AutomaticTab meshDataEditing={meshData} activeTab={activeTab} clearEditingMeshData={clearEditingMeshData} />
          </TabPanel>
          <TabPanel key="2" value="2">
            <ManuelTab activeTab={activeTab}/>
          </TabPanel>
          <TabPanel key="3" value="4">
            <OrdersTab openAutomaticTab={openAutomaticTabWithMeshData} activeTab={activeTab} switchToAutomaticTab={switchToAutomaticTab}/>
          </TabPanel>
          <TabPanel key="4" value="3">
            <KesmeTab onKesmeListChange={handleKesmeListChange} activeTab={activeTab}/>
          </TabPanel>
        </TabsBody>
      </Tabs>
      </div>
   
  );
}

export default App;
