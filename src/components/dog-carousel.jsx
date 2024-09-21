import { useEffect, useMemo, useState } from "react";
import useDogApi from "../hooks/use-dog-api";
import { capitalizeFirstChar } from "../utils/capitalize-first-char";
import "./dog-carousel.css";

export default function DogCarousel({ dogBreeds, selectedBreed }) {
  const subBreeds = dogBreeds[selectedBreed] || [];
  const {
    data: breedImages,
    status,
    error,
    isLoading,
  } = useDogApi(`https://dog.ceo/api/breed/${selectedBreed}/images`);
  const [currentImageIdx, setCurrentImageIdx] = useState(0);
  const [isImageLoading, setIsImageLoading] = useState(true);
  const [selectedSubBreeds, setSelectedSubBreeds] = useState(subBreeds.length > 0 ? [subBreeds[0]] : []);

  // Reset selectedSubBreeds when selectedBreed changes
  useEffect(() => {
    setSelectedSubBreeds(subBreeds.length > 0 ? [subBreeds[0]] : []);
  }, [selectedBreed, subBreeds]);

  const preparedImages = useMemo(() => {
    if (!Array.isArray(breedImages)) return [];
    let images = breedImages;

    // 1. Filter images by selected subBreed
    if (subBreeds.length > 0) {
      images = images.filter((imageUrl) =>
        selectedSubBreeds.some((selectedSubBreed) => imageUrl.includes(selectedSubBreed))
      );
    }

    // 2. Randomize them
    for (let i = images.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [images[i], images[j]] = [images[j], images[i]];
    }

    return images;
  }, [breedImages, selectedSubBreeds]);

  if (error) {
    return <p>Something went wrong: {error.message}</p>;
  }

  if (!isLoading && status !== "success") {
    return <p>Something went wrong: {status}</p>;
  }

  const handleNextImageClick = () => {
    setIsImageLoading(true);
    setCurrentImageIdx((idx) => idx + 1);
  };

  const handlePreviousImageClick = () => {
    setIsImageLoading(true);
    setCurrentImageIdx((idx) => idx - 1);
  };

  const handleSubBreedChange = (event) => {
    const { value, checked } = event.target;
    setSelectedSubBreeds((prevSelectedSubBreeds) => {
      if (checked) {
        return [...prevSelectedSubBreeds, value]; // Add to array
      } else {
        return prevSelectedSubBreeds.filter((subBreed) => subBreed !== value); // Filter it out
      }
    });
  };

  return (
    <div className="dog-carousel">
      <div className="sub-breed-options">
        {isLoading ? (
          <p>Loading...</p>
        ) : (
          subBreeds.map((subBreed) => (
            <div className="sub-breed-option">
              <input
                type="checkbox"
                id={subBreed}
                value={subBreed}
                onChange={handleSubBreedChange}
                checked={selectedSubBreeds.includes(subBreed)}
              />
              <label htmlFor={subBreed}>{capitalizeFirstChar(subBreed)}</label>
            </div>
          ))
        )}
      </div>
      {!isLoading && (
        <div className="image-carousel">
          <div className="image-container">
            {isImageLoading && <span className="center-text">Loading image...</span>}
            {preparedImages.length > 0 ? (
              <img
                src={preparedImages[currentImageIdx]}
                alt={`Photo of a ${selectedBreed}`}
                className="dog-image"
                onLoad={() => setIsImageLoading(false)}
                onError={() => setIsImageLoading(false)}
                style={{ display: isImageLoading ? "none" : "block" }}
              />
            ) : (
              <span className="center-text">No photos to display.</span>
            )}
          </div>
          <div className="image-controls">
            <button onClick={handlePreviousImageClick} disabled={currentImageIdx === 0}>
              Vorheriges Bild
            </button>
            <button onClick={handleNextImageClick} disabled={currentImageIdx === breedImages.length - 1}>
              Nächstes Bild
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
