import {
  useGetAllKesmeQuery,
  useDeleteKesmeMutation,
  useDeleteAllKesmeMutation,
} from "../../store/reducers/kesme";
import { useState } from "react";
import { printTable, toggleSort } from "@/utils/kesmeHelpers";
import {
  Tabs,
  TabsHeader,
  TabsBody,
  Tab,
  TabPanel,
} from "@material-tailwind/react";
import KesmeTabInformation from "./KesmeTabInformation";
import KesmeTabApplication from "./KesmeTabApplication";
import Header from "../Header";
import KesmeTabSeparateSum from "./KesmeTabSeparateSum";

const KesmeTab = ({onKesmeListChange}) => {




  

  return (
   
      <Tabs value="5" className="flex flex-col w-full items-center">
        
        <TabsHeader className="flex flex-row w-[700px] " indicatorProps={{
            className: "bg-gray-600/20 shadow-none !text-gray-900",
          }}>
          <Tab value={"5"}>Detaylı Kesme Bilgileri</Tab>
          <Tab value={"6"}>En/Boy Toplam</Tab>
          <Tab value={"10"}>Birleştirilmiş Toplam</Tab>
        </TabsHeader>
     
      
        <TabsBody>
        <TabPanel key={"information"} value={"5"}>
      <KesmeTabInformation onKesmeListChange={onKesmeListChange} />
    </TabPanel>
          <TabPanel key={"separate_sum"} value={"6"}>
            <KesmeTabSeparateSum />
          </TabPanel>
          <TabPanel key={"application"} value={"10"}>
            <KesmeTabApplication />
            
          </TabPanel>
        </TabsBody>
      </Tabs>
  
  );
};

export default KesmeTab;
