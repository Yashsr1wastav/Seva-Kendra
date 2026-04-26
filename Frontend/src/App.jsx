import { Suspense, lazy } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { Toaster } from "sonner";
import { AuthProvider } from "./contexts/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";

const SignIn = lazy(() => import("./pages/SignIn"));
const Dashboard = lazy(() => import("./pages/Dashboard"));
const Beneficiaries = lazy(() => import("./pages/Beneficiaries"));
const LegalAid = lazy(() => import("./pages/LegalAid"));
const Workshops = lazy(() => import("./pages/Workshops"));
const Reports = lazy(() => import("./pages/Reports"));
const Form = lazy(() => import("./pages/Form"));
const StudyCenters = lazy(() => import("./pages/StudyCenters"));
const Teachers = lazy(() => import("./pages/Teachers"));
const GroupLeaders = lazy(() => import("./pages/GroupLeaders"));
const SCStudents = lazy(() => import("./pages/SCStudents"));
const Dropouts = lazy(() => import("./pages/Dropouts"));
const Schools = lazy(() => import("./pages/Schools"));
const CompetitiveExams = lazy(() => import("./pages/CompetitiveExams"));
const BoardPreparation = lazy(() => import("./pages/BoardPreparation"));
const ModuleReports = lazy(() => import("./pages/ModuleReports"));
const HealthCamps = lazy(() => import("./pages/HealthCamps"));
const Elderly = lazy(() => import("./pages/Elderly"));
const MotherChild = lazy(() => import("./pages/MotherChild"));
const PWD = lazy(() => import("./pages/PWD"));
const Adolescents = lazy(() => import("./pages/Adolescents"));
const Tuberculosis = lazy(() => import("./pages/Tuberculosis"));
const HIV = lazy(() => import("./pages/HIV"));
const Leprosy = lazy(() => import("./pages/Leprosy"));
const Addiction = lazy(() => import("./pages/Addiction"));
const OtherDiseases = lazy(() => import("./pages/OtherDiseases"));
const CBUCBODetails = lazy(() => import("./pages/CBUCBODetails"));
const Entitlements = lazy(() => import("./pages/Entitlements"));
const TrackingDashboard = lazy(() => import("./pages/TrackingDashboard"));
const UrgentCases = lazy(() => import("./pages/UrgentCases"));
const UserManagement = lazy(() => import("./pages/UserManagement"));

function App() {
  return (
    <div className="dark">
      <AuthProvider>
        <Toaster position="top-right" richColors expand={true} closeButton />
        <Router>
          <Suspense
            fallback={
              <div className="min-h-screen flex items-center justify-center text-sm text-muted-foreground">
                Loading page...
              </div>
            }
          >
        <Routes>
          <Route path="/signin" element={<SignIn />} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/beneficiaries"
            element={
              <ProtectedRoute>
                <Beneficiaries />
              </ProtectedRoute>
            }
          />
          <Route
            path="/legal-aid"
            element={
              <ProtectedRoute>
                <LegalAid />
              </ProtectedRoute>
            }
          />
          <Route
            path="/workshops"
            element={
              <ProtectedRoute>
                <Workshops />
              </ProtectedRoute>
            }
          />
          <Route
            path="/reports"
            element={
              <ProtectedRoute>
                <Reports />
              </ProtectedRoute>
            }
          />
          <Route
            path="/tracking"
            element={
              <ProtectedRoute>
                <TrackingDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/tracking/urgent-cases"
            element={
              <ProtectedRoute>
                <UrgentCases />
              </ProtectedRoute>
            }
          />
          <Route
            path="/education/study-centers"
            element={
              <ProtectedRoute>
                <StudyCenters />
              </ProtectedRoute>
            }
          />
          <Route
            path="/education/teachers"
            element={
              <ProtectedRoute>
                <Teachers />
              </ProtectedRoute>
            }
          />
          <Route
            path="/education/group-leaders"
            element={
              <ProtectedRoute>
                <GroupLeaders />
              </ProtectedRoute>
            }
          />
          <Route
            path="/education/sc-students"
            element={
              <ProtectedRoute>
                <SCStudents />
              </ProtectedRoute>
            }
          />
          <Route
            path="/education/dropouts"
            element={
              <ProtectedRoute>
                <Dropouts />
              </ProtectedRoute>
            }
          />
          <Route
            path="/education/schools"
            element={
              <ProtectedRoute>
                <Schools />
              </ProtectedRoute>
            }
          />
          <Route
            path="/education/competitive-exams"
            element={
              <ProtectedRoute>
                <CompetitiveExams />
              </ProtectedRoute>
            }
          />
          <Route
            path="/education/board-preparation"
            element={
              <ProtectedRoute>
                <BoardPreparation />
              </ProtectedRoute>
            }
          />
          <Route
            path="/module-reports"
            element={
              <ProtectedRoute>
                <ModuleReports />
              </ProtectedRoute>
            }
          />
          <Route
            path="/health/health-camps"
            element={
              <ProtectedRoute>
                <HealthCamps />
              </ProtectedRoute>
            }
          />
          <Route
            path="/health/elderly"
            element={
              <ProtectedRoute>
                <Elderly />
              </ProtectedRoute>
            }
          />
          <Route
            path="/health/mother-child"
            element={
              <ProtectedRoute>
                <MotherChild />
              </ProtectedRoute>
            }
          />
          <Route
            path="/health/pwd"
            element={
              <ProtectedRoute>
                <PWD />
              </ProtectedRoute>
            }
          />
          <Route
            path="/health/adolescents"
            element={
              <ProtectedRoute>
                <Adolescents />
              </ProtectedRoute>
            }
          />
          <Route
            path="/health/tuberculosis"
            element={
              <ProtectedRoute>
                <Tuberculosis />
              </ProtectedRoute>
            }
          />
          <Route
            path="/health/hiv"
            element={
              <ProtectedRoute>
                <HIV />
              </ProtectedRoute>
            }
          />
          <Route
            path="/health/leprosy"
            element={
              <ProtectedRoute>
                <Leprosy />
              </ProtectedRoute>
            }
          />
          <Route
            path="/health/addiction"
            element={
              <ProtectedRoute>
                <Addiction />
              </ProtectedRoute>
            }
          />
          <Route
            path="/health/other-diseases"
            element={
              <ProtectedRoute>
                <OtherDiseases />
              </ProtectedRoute>
            }
          />
          <Route
            path="/social-justice/cbucbo-details"
            element={
              <ProtectedRoute>
                <CBUCBODetails />
              </ProtectedRoute>
            }
          />
          <Route
            path="/social-justice/entitlements"
            element={
              <ProtectedRoute>
                <Entitlements />
              </ProtectedRoute>
            }
          />
          <Route
            path="/social-justice/legal-aid"
            element={
              <ProtectedRoute>
                <LegalAid />
              </ProtectedRoute>
            }
          />
          <Route
            path="/social-justice/workshops"
            element={
              <ProtectedRoute>
                <Workshops />
              </ProtectedRoute>
            }
          />
          <Route
            path="/users"
            element={
              <ProtectedRoute>
                <UserManagement />
              </ProtectedRoute>
            }
          />
          <Route path="/form" element={<Form />} />
          <Route path="/" element={<Navigate to="/signin" replace />} />
        </Routes>
        </Suspense>
      </Router>
      </AuthProvider>
    </div>
  );
}

export default App;
