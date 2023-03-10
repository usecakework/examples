import {Button, Card, Menu, MenuItem, InputGroup } from "@blueprintjs/core"
import { Popover2, MenuItem2 } from "@blueprintjs/popover2"
import { useState } from "react";
import RunComponent from "./RunComponent";
import axios from "axios";
import Editor from 'react-simple-code-editor';
import { highlight, languages } from 'prismjs/components/prism-core';
import 'prismjs/components/prism-clike';
import 'prismjs/components/prism-python';
import 'prismjs/themes/prism.css';

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

function ScriptEventPanel(props) { 
    const [runCount, setFakeRunCount] = useState(0);
    const [showScripts, setShowScripts] = useState(false);
    const [scriptSaved, setScriptSaved] = useState(false);
    const [code, setCode] = useState(
      `import pandas as pd\n\ndef handleOnSyncStarted(data): \n    df = pd.Dataframe(data)\n    print(df)`
    );

    function renderRuns() {
      return (
        <div>
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

    async function testEvent(eventName) {
        // axios.post(`${BACKEND_URL}/testEvent`, {"name":eventName});
        await new Promise(r => setTimeout(r, 500));
        setFakeRunCount(runCount+1);
    }

    return (
        <div>            
            <h1 style={{marginTop:"0px"}}>{props.name}</h1>
            <div>
                This event gets fired when a sync is completed.
            </div>
            <div style={{marginTop:"5px", marginBottom:"25px"}}>
                <Button onClick={() => testEvent(props.name)}>Test Me!</Button>
            </div>

            <h2>Scripts</h2>        
            <div>
                Write scripts to respond to this action.
            </div>
            <Button style={{marginTop:"5px", marginBottom:"25px"}} onClick={() => setShowScripts(true)}>Add New Script</Button>
            {
              showScripts &&
              (
                <div>
                  <div>
                    <b>Name</b>
                  </div>
                  <InputGroup
                      asyncControl={true}
                      placeholder="Your New Script"                    
                      style={{marginTop:"5px", width: "600px"}}
                  />
                  <div style={{marginTop:"10px", marginBottom:"10px"}}>
                    <b>Script</b>
                  </div>
                  <div style={{display:"flex", gap: 2}}>
                  <Popover2 content={<Menu>
                          <MenuItem2 text="Python" />
                          <MenuItem2 text="Javascript" />
                        </Menu>} placement="bottom">
                      <Button alignText="left" icon="applications" rightIcon="caret-down" text="Python" />
                  </Popover2>
                  <Button alignText="left" text="Install Dependencies" />
                  </div>

                  <Card style={{marginTop:"5px"}}>
                    <Editor
                      value={code}
                      onValueChange={code => setCode(code)}
                      highlight={code => highlight(code, languages.python)}
                      style={{
                        fontFamily: '"Fira code", "Fira Mono", monospace',
                        fontSize: 12,
                      }}
                    />
                  </Card>

                  <div style={{marginTop:"10px", display:"flex", gap:2}}>
                      <Button icon="play">Test</Button>
                      <Button onClick={() => {setScriptSaved(true);setShowScripts(false);}}>Save</Button>                      
                  </div>
                </div>
              )
            }
            {
              scriptSaved && 
              (
                <div>
                  <h3>My First Script</h3>
                  {
                    renderRuns()
                  }
                </div>
              )
            }
            
        </div>
    );
  }
  
export default ScriptEventPanel;