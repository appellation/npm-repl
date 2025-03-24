import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import clsx from "clsx";
import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";
import { lazy, Suspense } from "react";

const Editor = lazy(() => import("./Editor"));
const Output = lazy(() => import("./Output"));
const Packages = lazy(() => import("./Packages"));

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

function Loading() {
	return <span>Loading</span>;
}

const App = () => {
	return (
		<QueryClientProvider client={queryClient}>
			<div className="h-screen">
				<PanelGroup direction="horizontal">
					<Panel>
						<Suspense fallback={<Loading />}>
							<Editor />
						</Suspense>
					</Panel>
					<Handle direction="vertical" />
					<Panel>
						<PanelGroup direction="vertical">
							<Panel>
								<Suspense fallback={<Loading />}>
									<Packages />
								</Suspense>
							</Panel>
							<Handle direction="horizontal" />
							<Panel>
								<Suspense fallback={<Loading />}>
									<Output />
								</Suspense>
							</Panel>
						</PanelGroup>
					</Panel>
				</PanelGroup>
			</div>
		</QueryClientProvider>
	);
};

export default App;
