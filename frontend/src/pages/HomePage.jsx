import NavBar from "../components/NavBar";
import { useAuth } from "../hooks/authContext";

function HomePage() {
  const { user } = useAuth();

  return (
    <div>
      <h2>Welcome {user.display_name}</h2>
      <NavBar visible={true} current={0} />
    </div>
  );
}

export default HomePage;
