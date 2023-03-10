import {ButtonGroup, Button, Tabs, Tab} from "@blueprintjs/core"
import EventPanel from "./EventPanel";
import NothingHere from "./NothingHere";
import { useState, useEffect } from "react";
import axios from "axios";
import ScriptEventPanel from "./ScriptEventPanel";

const BACKEND_URL = "http://localhost:3000"

// DO AS LITTLE AS HUMANLY POSSIBLE
// use svix eventId for this, and write this to the log, which we need to use to additionally query
function EventsPanel() {
  const [handlers, setHandlers] = useState([]);

  const getAllHandlers = async () => {
    const response = await axios.get(`${BACKEND_URL}/handlers`);
    const responseHandlers = response.data;
    setHandlers(responseHandlers);
  }

  useEffect(() => {
    getAllHandlers();
  }, []);

  return (
    <div style={{padding: "10px"}}>                    
      <Tabs id="Events" vertical>
        <Tab id="onSyncStarted" title="onSyncStarted" panel={<EventPanel name="onSyncStarted" handlers={handlers}/>} />
        <Tab id="onSyncCompleted" title="onSyncCompleted" panel={<ScriptEventPanel name="onSyncCompleted" />} />
        <Tab id="onFieldUpdated" title="onFieldUpdated" panel={<NothingHere/>} />
        <Tabs.Expander />
      </Tabs>
    </div>
  );
}
  
export default EventsPanel;
  