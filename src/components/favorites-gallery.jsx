import React, { useState } from "react";
import TrashCan from "../assets/icons/trash-can";
import "./favorites-gallery.css";

export default function FavoritesGallery({ favoritedImages, setFavoritedImages }) {
  const [isImageLoading, setIsImageLoading] = useState(true);

  const handleRemoveToggleStatus = (imageToRemove) => {
    setFavoritedImages((prevFavoritedImages) => prevFavoritedImages.filter((image) => image !== imageToRemove));
  };

  return (
    <div className="favorites-gallery">
      <div className="title-container">
        <h2>Gallerie Favoriten</h2>
      </div>
      <div className="fav-images">
        {favoritedImages.map((favoriteImage) => (
          <div className="fav-image-container" key={favoriteImage}>
            {isImageLoading && <span className="center-text">Lade Bild...</span>}
            <button className="unfavorite-image" onClick={() => handleRemoveToggleStatus(favoriteImage)}>
              <TrashCan />
            </button>
            <img
              src={favoriteImage}
              alt={`Photo of a dog`}
              className="fav-image"
              onLoad={() => setIsImageLoading(false)}
              onError={() => setIsImageLoading(false)}
              style={{ display: isImageLoading ? "none" : "block" }}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
