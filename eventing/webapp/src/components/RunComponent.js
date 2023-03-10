import {Divider, Card, Collapse} from "@blueprintjs/core"
import { useState } from "react";


function RunComponent(props) {
    const [showLogs, setShowLogs] = useState(false);    

    return (
        <Card style={{padding:"5px", width: "600px"}}>
            <div style={{display: "flex", justifyContent: "space-between"}}>
                <div>
                    {props.id}
                </div>
                <div style={{display: "flex", gap: "12px"}}>
                    <div>
                        03/03/22 13:20:59
                    </div>
                    <div style={{color: "green"}}>                        
                        Success
                    </div>
                    <div>
                        <a onClick={() => setShowLogs(!showLogs)}>View Logs</a>
                    </div>
                </div>
            </div>

            <Collapse isOpen={showLogs}>
                <Divider />
                <div style={{display:"flex", gap: "6px", paddingLeft: "5px"}}>
                    <div>INFO</div>
                    <div>Hello World!</div>
                </div>
            </Collapse>
        </Card>
    );
  }
  
export default RunComponent;
