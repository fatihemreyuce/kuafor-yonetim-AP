import { LoginProvider } from "./providers/login-state-provider";
import QueryProvider from "./providers/query-client-provider";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster } from "./components/ui/sonner";
import ProtectedRoute from "./providers/protected-route";
import AdminLayout from "./components/admin-layout";
import LoginPage from "./pages/login/login-page";
import DashboardPage from "./pages/dashboard/dashboard-page";
import ProfilesLayout from "./pages/profiles/profiles-layout";
import ProfilesPage from "./pages/profiles/profiles-page";
import ProfileCreatePage from "./pages/profiles/profile-create-page";
import ProfileDetailPage from "./pages/profiles/profile-detail-page";
import ProfileEditPage from "./pages/profiles/profile-edit-page";
import AddonsLayout from "./pages/addons/addons-layout";
import AddonsPage from "./pages/addons/addons-page";
import AddonCreatePage from "./pages/addons/addon-create-page";
import AddonEditPage from "./pages/addons/addon-edit-page";
import AddonDetailPage from "./pages/addons/addon-detail-page";
import RevenueSummaryLayout from "./pages/revenue-summary/revenue-summary-layout";
import RevenueSummaryPage from "./pages/revenue-summary/revenue-summary-page";
import RevenueSummaryCreatePage from "./pages/revenue-summary/revenue-summary-create-page";
import RevenueSummaryEditPage from "./pages/revenue-summary/revenue-summary-edit-page";
import RevenueSummaryDetailPage from "./pages/revenue-summary/revenue-summary-detail-page";

function App() {
	return (
		<QueryProvider>
			<LoginProvider>
				<BrowserRouter>
					<Toaster />
					<Routes>
						<Route path="/login" element={<LoginPage />} />
						<Route path="/" element={<ProtectedRoute />}>
							<Route path="/" element={<AdminLayout />}>
								<Route index element={<DashboardPage />} />
								<Route path="profiles" element={<ProfilesLayout />}>
									<Route index element={<ProfilesPage />} />
									<Route path="new" element={<ProfileCreatePage />} />
									<Route path=":id/edit" element={<ProfileEditPage />} />
									<Route path=":id" element={<ProfileDetailPage />} />
								</Route>
								<Route path="saloons" element={<AddonsLayout />}>
									<Route index element={<AddonsPage />} />
									<Route path="new" element={<AddonCreatePage />} />
									<Route path=":id/edit" element={<AddonEditPage />} />
									<Route path=":id" element={<AddonDetailPage />} />
								</Route>
								<Route path="revenue-summary" element={<RevenueSummaryLayout />}>
									<Route index element={<RevenueSummaryPage />} />
									<Route path="new" element={<RevenueSummaryCreatePage />} />
									<Route path=":id/edit" element={<RevenueSummaryEditPage />} />
									<Route path=":id" element={<RevenueSummaryDetailPage />} />
								</Route>
							</Route>
						</Route>
					</Routes>
				</BrowserRouter>
			</LoginProvider>
		</QueryProvider>
	);
}

export default App;
