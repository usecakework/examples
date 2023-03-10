import {Button, Card, Collapse} from "@blueprintjs/core"
import { useState } from "react";
import RunComponent from "./RunComponent";
import axios from "axios";

const BACKEND_URL = "http://localhost:3000"

function makeid(length) {
    let result = '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const charactersLength = characters.length;
    let counter = 0;
    while (counter < length) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
      counter += 1;
    }
    return result;
}
const ids = [...Array(50)].map((x, i) => makeid(12))

function EventPanel(props) { 
    const [runCount, setFakeRunCount] = useState(0);

    async function testEvent(eventName) {
        axios.post(`${BACKEND_URL}/testEvent`, {"name":eventName});
        await new Promise(r => setTimeout(r, 500));
        setFakeRunCount(runCount+1);
    }

    return (
        <div>            
            <h1 style={{marginTop:"0px"}}>{props.name}</h1>
            <div>
                This event gets fired when a sync gets started. You can use this to write custom fields to your database.
            </div>
            <div style={{marginTop:"5px", marginBottom:"25px"}}>
                <Button onClick={() => testEvent(props.name)}>Test Me!</Button>
            </div>

            <h2>Handlers</h2>
            {
                props.handlers.length == 0 && 
                <div>
                    Deploy new handlers via the <a>Cupcake CLI</a>. You can also <a>connect a Github repo</a> that automatically deploys on every push.
                </div>
            }
            

            {props.handlers.map((handler) => {
                if (handler.event === props.name) {
                    return (
                        <div>
                            <h3>{handler.name}</h3>
                            <h4>Runs</h4>
                            {
                                runCount == 0 && 
                                    <div>
                                        <i>No runs yet!</i>
                                    </div>
                            }
                            {
                                [...Array(runCount)].map((x, i) =>
                                    <RunComponent id={ids[i]} />
                                )
                            }
                        </div>
                    )
                }
                return <div></div>
            })}
        </div>
    );
  }
  
export default EventPanel;