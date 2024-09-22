import { useEffect, useMemo, useState } from "react";
import HeartEmpty from "../assets/icons/heart-empty";
import HeartFull from "../assets/icons/heart-full";
import useDogApi from "../hooks/use-dog-api";
import { capitalizeFirstChar } from "../utils/capitalize-first-char";
import "./sub-breed-gallery.css";

export default function SubBreedGallery({ subBreeds, selectedBreed, favoritedImages, setFavoritedImages }) {
  const {
    data: breedImages,
    status,
    error,
    isLoading: isLoadingImageUrls,
  } = useDogApi(`https://dog.ceo/api/breed/${selectedBreed}/images`);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isImageLoading, setIsImageLoading] = useState(true);
  const [selectedSubBreeds, setSelectedSubBreeds] = useState(subBreeds.length > 0 ? [subBreeds[0]] : []);
  const breedChosen = !!selectedBreed && selectedBreed !== "Alle Hunderassen";

  // Reset states when breed or subBreeds change
  useEffect(() => {
    setSelectedSubBreeds(subBreeds.length > 0 ? [subBreeds[0]] : []);
    setCurrentImageIndex(0);
  }, [selectedBreed, subBreeds]);

  const memoizedBreedImages = useMemo(() => breedImages, [breedImages]);

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
  }, [memoizedBreedImages, selectedSubBreeds]);

  // console.log("breedImages", breedImages);
  // console.log("selectedSubBreeds", selectedSubBreeds);
  console.log("isLoadingImageUrls", isLoadingImageUrls);

  const currentImageUrl = preparedImages[currentImageIndex];
  const isCurrentImageFavorite = favoritedImages.includes(currentImageUrl);

  const handleNextImageClick = () => {
    setIsImageLoading(true);
    setCurrentImageIndex((idx) => idx + 1);
  };

  const handlePreviousImageClick = () => {
    setIsImageLoading(true);
    setCurrentImageIndex((idx) => idx - 1);
  };

  const handleToggleFavoriteStatus = () => {
    if (isCurrentImageFavorite) {
      setFavoritedImages(favoritedImages.filter((image) => image !== currentImageUrl));
    } else {
      setFavoritedImages([...favoritedImages, currentImageUrl]);
    }
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
    <div className="sub-breed-gallery">
      <h2>Gallerie Subrassen</h2>
      <div className="carousel-container">
        {subBreeds.length > 0 && (
          <div className="sub-breed-options">
            {isLoadingImageUrls ? (
              <p>Lade...</p>
            ) : (
              subBreeds.map((subBreed) => (
                <div className="sub-breed-option">
                  <input
                    type="checkbox"
                    key={subBreed}
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
        )}
        <div className="image-carousel">
          <div className="image-container">
            {!isLoadingImageUrls && (
              <>
                {breedChosen && isImageLoading && <span className="center-text">Lade Bild...</span>}
                {breedChosen && error && <p>Something went wrong: {error.message}</p>}
                {breedChosen && status !== "success" && <p>Something went wrong: {status}</p>}
                {preparedImages.length > 0 ? (
                  <>
                    {!isImageLoading && (
                      <button className="favorite-image" onClick={handleToggleFavoriteStatus}>
                        {isCurrentImageFavorite ? <HeartFull /> : <HeartEmpty />}
                      </button>
                    )}
                    <img
                      src={currentImageUrl}
                      alt={`Photo of a ${selectedBreed}`}
                      className={`dog-image ${!isImageLoading && "fade-in"}`}
                      onLoad={() => setIsImageLoading(false)}
                      onError={() => setIsImageLoading(false)}
                      style={{ display: isImageLoading ? "none" : "block" }}
                    />
                  </>
                ) : (
                  <span className="center-text">Keine Bilder. Bitte Rasse auswählen!</span>
                )}
              </>
            )}
          </div>
          <div className="image-controls">
            <button
              onClick={handlePreviousImageClick}
              disabled={preparedImages.length === 0 || currentImageIndex === 0}
              className="image-controls--button"
            >
              Vorheriges Bild
            </button>
            <button
              onClick={handleNextImageClick}
              disabled={preparedImages.length === 0 || currentImageIndex === breedImages.length - 1}
            >
              Nächstes Bild
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
