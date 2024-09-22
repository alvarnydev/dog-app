import { useState } from "react";
import "./App.css";
import BreedSelector from "./components/breed-selector";
import FavoritesGallery from "./components/favorites-gallery";
import SubBreedGallery from "./components/sub-breed-gallery";
import useDogApi from "./hooks/use-dog-api";
import useLocalStorage from "./hooks/use-local-storage";

function App() {
  const { data: dogBreeds, status, error, isLoading } = useDogApi("https://dog.ceo/api/breeds/list/all");
  const [selectedBreed, setSelectedBreed] = useState("");
  const [favoritedImages, setFavoritedImages] = useLocalStorage("favorite-images", "");
  const subBreeds = dogBreeds[selectedBreed] || [];

  return (
    <main>
      <div>
        <h1 className="site-title">Testaufgabe</h1>
      </div>
      <BreedSelector
        dogBreeds={dogBreeds}
        status={status}
        error={error}
        isLoading={isLoading}
        selectedBreed={selectedBreed}
        setSelectedBreed={setSelectedBreed}
      />
      <SubBreedGallery
        subBreeds={subBreeds}
        selectedBreed={selectedBreed}
        favoritedImages={favoritedImages}
        setFavoritedImages={setFavoritedImages}
      />
      {favoritedImages.length > 0 && (
        <FavoritesGallery favoritedImages={favoritedImages} setFavoritedImages={setFavoritedImages} />
      )}
    </main>
  );
}

export default App;
