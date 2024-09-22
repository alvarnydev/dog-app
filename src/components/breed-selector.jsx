import { useState } from "react";
import ArrowDown from "../assets/icons/arrow-down";
import ArrowUp from "../assets/icons/arrow-up";
import { capitalizeFirstChar } from "../utils/capitalize-first-char";
import "./breed-selector.css";

export default function BreedSelector({ dogBreeds, status, error, isLoading, selectedBreed, setSelectedBreed }) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const handleDropdownToggle = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleOptionClick = (breed) => {
    setSelectedBreed(breed);
    setIsDropdownOpen(false);
  };

  return (
    <div className="breed-selector">
      <h2 className="selector-title">Auswahl Hunderasse</h2>
      <div className="dropdown-menu">
        <div className="dropdown-header" onClick={handleDropdownToggle}>
          {capitalizeFirstChar(selectedBreed) || "Alle Hunderassen"}
          {isDropdownOpen ? <ArrowUp /> : <ArrowDown />}
        </div>
        {isDropdownOpen && (
          <ul className="dropdown-list">
            <li className="dropdown-option" onClick={() => handleOptionClick("")}>
              Alle Hunderassen
            </li>
            {Object.keys(dogBreeds).map((breed) => (
              <li
                key={breed}
                className={`dropdown-option ${selectedBreed === breed ? "selected" : ""}`}
                onClick={() => handleOptionClick(breed)}
              >
                {capitalizeFirstChar(breed)}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
