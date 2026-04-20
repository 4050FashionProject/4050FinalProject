import NavBar from "../components/NavBar";

function ClosetPage() {
  return (
    <div>
      <h1>Closet Page</h1>
      <p>display closet items</p>
      <NavBar visible={true} current={2} />
    </div>
  );
}

export default ClosetPage;
