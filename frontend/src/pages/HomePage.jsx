import { useAuth } from "../hooks/authContext";

function HomePage() {
  const { user } = useAuth();

  return <div>Welcome {user.display_name}</div>;
}

export default HomePage;
