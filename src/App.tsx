import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import clsx from "clsx";
import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";
import Editor from "./Editor";
import Output from "./Output";
import Packages from "./Packages";

const queryClient = new QueryClient();

function Handle({ direction }: { direction: "vertical" | "horizontal" }) {
	return (
		<PanelResizeHandle
			className={clsx(
				"bg-gray-200 data-[resize-handle-state=hover]:bg-gray-400",
				direction === "vertical" ? "w-1" : "h-1",
			)}
		/>
	);
}

const App = () => {
	return (
		<QueryClientProvider client={queryClient}>
			<div className="h-screen">
				<PanelGroup direction="horizontal">
					<Panel>
						<Editor />
					</Panel>
					<Handle direction="vertical" />
					<Panel>
						<PanelGroup direction="vertical">
							<Panel>
								<Packages />
							</Panel>
							<Handle direction="horizontal" />
							<Panel>
								<Output />
							</Panel>
						</PanelGroup>
					</Panel>
				</PanelGroup>
			</div>
		</QueryClientProvider>
	);
};

export default App;
