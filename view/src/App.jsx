import { Routes, Route } from "react-router-dom";
import HomePage from "./Pages/HomePage";
import LoginPage from "./Pages/LoginPage";
import RegisterPage from "./Pages/RegisterPage";
import ProfilePage from "./Pages/ProfilePage";
import { AuthProvider } from "./Context/AuthContext";
import ProtectedRoute from "./ProtectedRoute";
import WorkoutPage from "./Pages/WorkoutPage";
import { WorkoutProvider } from "./context/WorkoutContext";
import GroupClassesPage from "./Pages/GroupClassesPage"; // importa tu página
import { GroupClassProvider } from "./Context/GroupClassesContext"; // importa tu contexto
import AssistantListPage from "./Pages/AssistantListPage"; 


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
            <Route path="/my-workouts-by-day/:date" element={<WorkoutPage />} />
            <Route path="/group-classes-by-day/:date" element={<GroupClassesPage />} />
            <Route path="/group-class/:id/attendees" element={<AssistantListPage />} />
          </Routes>
        </GroupClassProvider>
      </WorkoutProvider>
    </AuthProvider>
  );
}

export default App;