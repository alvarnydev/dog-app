import { useState } from "react";
import "./App.css";
import DogCarousel from "./components/dog-carousel";
import DropdownMenu from "./components/dropdown-menu";
import useDogApi from "./hooks/use-dog-api";

function App() {
  const { data: dogBreeds, status, error, isLoading } = useDogApi("https://dog.ceo/api/breeds/list/all");
  const [selectedBreed, setSelectedBreed] = useState("");

  if (error) {
    return <p>Something went wrong: {error.message}</p>;
  }

  if (isLoading) {
    return <p>Waiting on API response...</p>;
  }

  if (!isLoading && status !== "success") {
    return <p>Something went wrong: {status}</p>;
  }

  return (
    <main>
      <DropdownMenu dogBreeds={dogBreeds} selectedBreed={selectedBreed} setSelectedBreed={setSelectedBreed} />
      {selectedBreed && <DogCarousel dogBreeds={dogBreeds} selectedBreed={selectedBreed} />}
    </main>
  );
}

export default App;
