import { useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import HomePage from "./Pages/HomePage";
import LoginPage from "./Pages/LoginPage";
import RegisterPage from "./Pages/RegisterPage";
import ProfilePage from "./Pages/ProfilePage";
import { AuthProvider } from "./Context/AuthContext";
import ProtectedRoute from "./ProtectedRoute";
import WorkoutPage from "./Pages/WorkoutPage";
import { WorkoutProvider } from "./Context/WorkoutContext";
import AssistantListPage from "./Pages/AssistantListPage"; 
import GroupClassesPage from "./Pages/GroupClassesPage";
import { GroupClassProvider } from "./Context/GroupClassesContext";
import ProfilePageSettings from "./Pages/ProfilePageSettings";
import ReceiptsListPage from "./Pages/ReceiptsListPage";
import UserManagementPage from "./Pages/UserManagementPage";
import MuscleRoomPage from "./Pages/MuscleRoomPage";
import CreateWorkoutPage from "./Pages/CreateWorkoutPage";
import RegisterTrainerPage from "./Pages/RegisterTrainerPage";
import EditWorkoutPage from "./Pages/EditWorkoutPage";
import TrainerRoutinesPage from "./Pages/TrainerRoutinesPage";
import EditUserPage from "./Pages/EditUserPage";
import CreateGroupClassPage from "./Pages/CreateGrupalClassPage"; 

function App() {
  useEffect(() => {
    const checkSession = async () => {
      try {
        const res = await fetch("http://localhost:4000/api/verify", {
          credentials: "include",
        });
        if (!res.ok) throw new Error("Sesión caducada");
      } catch (err) {
        alert("Has estado inactivo demasiado tiempo. Por favor inicia sesión de nuevo.");
        localStorage.removeItem("user");
        window.location.href = "/login";
      }
    };
    const interval = setInterval(checkSession, 30000); 
    return () => clearInterval(interval);
  }, []);

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
            <Route path="/edit-workout/:workoutId" element={<EditWorkoutPage />} />
            <Route path="/profile-settings" element={<ProfilePageSettings />} />
            <Route path="/my-workouts-by-day/:date" element={<WorkoutPage />} />
            <Route path="/create-workout" element={<CreateWorkoutPage />} />
            <Route path="/group-classes-by-day/:date" element={<GroupClassesPage />} />
            <Route path="/group-class/:id/attendees" element={<AssistantListPage />} />
            <Route path="/my-invoices" element={<ReceiptsListPage />} />
            <Route path="/user-manager" element={<UserManagementPage />} />
            <Route path="/muscle-room" element={<MuscleRoomPage />} />
            <Route path="/register-trainer" element={<RegisterTrainerPage />} />
            <Route path="/trainer-routines" element={<TrainerRoutinesPage />} />
            <Route path="/edit-user" element={<EditUserPage />} />
            <Route path="/create-group-class" element={<CreateGroupClassPage />} />
          </Routes>
        </GroupClassProvider>
      </WorkoutProvider>
    </AuthProvider>
  );
}

export default App;
