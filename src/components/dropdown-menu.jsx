import { capitalizeFirstChar } from "../utils/capitalize-first-char";
import "./dropdown-menu.css";

export default function DropdownMenu({ selectedBreed, setSelectedBreed, dogBreeds }) {
  return (
    <div className="dropdown-menu">
      <select name="dogBreeds" id="dogBreeds" value={selectedBreed} onChange={(e) => setSelectedBreed(e.target.value)}>
        <option>Select a breed</option>
        {Object.keys(dogBreeds).map((breed) => (
          <option key={breed} value={breed}>
            {capitalizeFirstChar(breed)}
          </option>
        ))}
      </select>
    </div>
  );
}
