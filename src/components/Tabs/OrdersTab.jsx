import {useRef,  useState, useEffect } from "react";
import {
  useGetAllOrderQuery,
  useDeleteOrderMutation,
  useDeleteAllOrderMutation,
} from "../../store/reducers/kesme";
import meshFeatures from "../../contants/meshFeatures";
import {
  variable_1,
  variable_2,
  variable_3,
  variable_4,
} from "../../contants/meshVariables";

import {
  printTable,
  toggleSort,
  optimizeMeshProductionBasic,
} from "@/utils/kesmeHelpers";
import Modal from "@/components/Modal";
import KesmeButton from "../Buttons/KesmeButton";
import { useAddKesmeMutation } from "../../store/reducers/kesme";
import { initialValues, meshTypeOptions } from "../../contants/meshValues";
import AutoMesh from "../Mesh/AutoMesh";
import AutoCalculationTable from "../Mesh/AutoCalculationTable";

import {
  Tabs,
  TabsHeader,
  TabsBody,
  Tab,
  TabPanel,
} from "@material-tailwind/react";
import OrdersTabManuel from "./OrdersTabManuel";
import OrdersTabAutomatic from "./OrdersTabAutomatic";
import OrdersTabOriginalTable from "./OrdersTabOriginalTable";

const OrdersTab = ( { enableKesmeTab } ) => {

  const [calculated, setCalculated] = useState(initialValues.calculated);
  const [mesh, setMesh] = useState(initialValues.mesh);
  const [showMessage, setShowMessage] = useState(false);
  const [filamentError, setFilamentError] = useState("");
  const [error, setError] = useState("");
  const [tabIndex, setTabIndex] = useState(0);
  const [kesmeCalculations, setKesmeCalculations] = useState([]);

  const divRef = useRef();

  let isMeshValid = true;
  

  





  return (

    <Tabs value="7" className="flex flex-col w-full items-center">
        
        <TabsHeader className="flex flex-row w-[700px] " indicatorProps={{
            className: "bg-gray-600/20 shadow-none !text-gray-900",
          }}>
        <Tab value={"7"}>Orijinal Sipariş Tablosu</Tab>
          <Tab value={"8"}>Yarı Otomatik Hesap</Tab>
          <Tab value={"9"}>Tam Otomatik Hesap (Beta)</Tab>
        </TabsHeader>
     
      
        <TabsBody>
        <TabPanel key={"original_table_order"} value={"7"}>
          <OrdersTabOriginalTable 
           
          />
        </TabPanel>
        <TabPanel key={"manuel_order"} value={"8"}>
          <OrdersTabManuel enableKesmeTab={enableKesmeTab} />
        </TabPanel>
        <TabPanel key={"automatic_order"} value={"9"}>
          <OrdersTabAutomatic enableKesmeTab={enableKesmeTab} />
        </TabPanel>
      </TabsBody>
      </Tabs>
   
  );
};

export default OrdersTab;
