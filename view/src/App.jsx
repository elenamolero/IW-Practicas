import { Routes, Route } from "react-router-dom";
import HomePage from "./Pages/HomePage";
import LoginPage from "./Pages/LoginPage";
import RegisterPage from "./Pages/RegisterPage";
import ProfilePage from "./Pages/ProfilePage";
import { AuthProvider } from "./Context/AuthContext";
import ProtectedRoute from "./ProtectedRoute";
import WorkoutPage from "./Pages/WorkoutPage";
import { WorkoutProvider } from "./context/WorkoutContext";
import AssistantListPage from "./Pages/AssistantListPage"; 
import GroupClassesPage from "./Pages/GroupClassesPage";
import { GroupClassProvider } from "./Context/GroupClassesContext";
import ProfilePageSettings from "./Pages/ProfilePageSettings";
import ReceiptsListPage from "./Pages/ReceiptsListPage";
import UserManagementPage from "./Pages/UserManagementPage";
import MuscleRoomPage from "./Pages/MuscleRoomPage";

function App() {
  return (
    <AuthProvider>
      <WorkoutProvider>
        <GroupClassProvider>
          <Routes>  
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route element={<ProtectedRoute />}>
            <Route path="/profile" element={<ProfilePage />} />
            </Route>
            <Route path="/profile-settings" element={<ProfilePageSettings />} />
            <Route path="/my-workouts-by-day/:date" element={<WorkoutPage />} />
            <Route path="/group-classes-by-day/:date" element={<GroupClassesPage />} />
            <Route path="/group-class/:id/attendees" element={<AssistantListPage />} />
            <Route path="/my-invoices" element={<ReceiptsListPage />} />
            <Route path="/user-manager" element={<UserManagementPage />} />
            <Route path="/muscle-room" element={<MuscleRoomPage />} />
          </Routes>
        </GroupClassProvider>
      </WorkoutProvider>
    </AuthProvider>
  );
}

export default App;