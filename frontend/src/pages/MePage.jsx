import NavBar from "../components/NavBar";

function MePage() {
  return (
    <div>
      <h1>Me Page</h1>
      <h4>Your posts</h4>
      <p>display my posts here</p>
      <NavBar visible={true} current={3} />
    </div>
  );
}

export default MePage;
