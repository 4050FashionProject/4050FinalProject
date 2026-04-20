import NavBar from "../components/NavBar";

function ExplorePage() {
  return (
    <div>
      <h1>Explore Page</h1>
      <p>display feed here</p>
      <NavBar visible={true} current={1} />
    </div>
  );
}

export default ExplorePage;
