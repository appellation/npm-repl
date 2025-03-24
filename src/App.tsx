import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";
import "./App.css";
import Editor from "./Editor";
import Output from "./Output";
import Packages from "./Packages";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <PanelGroup direction="horizontal">
        <Panel>
          <Editor />
        </Panel>
        <PanelResizeHandle />
        <Panel>
          <PanelGroup direction="vertical">
            <Panel>
              <Packages />
            </Panel>
            <PanelResizeHandle />
            <Panel>
              <Output />
            </Panel>
          </PanelGroup>
        </Panel>
      </PanelGroup>
    </QueryClientProvider>
  );
};

export default App;
