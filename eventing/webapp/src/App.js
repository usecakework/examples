import {Navbar, Button, Alignment, Tab, Tabs, Divider } from "@blueprintjs/core"
import EventsPanel from "./components/EventsPanel";

// how will this handle deps? some base package probably
function App() {

  return (
    <div className="App">
      <Navbar>
          <Navbar.Group align={Alignment.LEFT}>
              <Navbar.Heading>Cupcake</Navbar.Heading>
              <Navbar.Divider />
              <Button className="bp4-minimal" icon="Pivot" text="Events" active />
          </Navbar.Group>
      </Navbar>
      <EventsPanel />
    </div>
  );
}

export default App;