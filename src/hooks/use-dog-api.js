import { useEffect, useState } from "react";

const useDogApi = (url) => {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  console.log("fetching url...", url);
  console.log("data", data);

  useEffect(() => {
    let ignore = false;

    const fetchBreeds = async () => {
      setIsLoading(true);

      try {
        const response = await fetch(url);
        const data = await response.json();

        if (ignore === false) {
          setData(data);
          setError(null);
          setIsLoading(false);
        }
      } catch (error) {
        if (ignore === false) {
          setData(null);
          setError(error);
          setIsLoading(false);
        }
      }
    };

    fetchBreeds();

    return () => {
      ignore = true;
    };
  }, [url]);

  const dogBreedData = data?.message || {};
  const status = data?.status || "";

  return { data: dogBreedData, status, error, isLoading };
};

export default useDogApi;
