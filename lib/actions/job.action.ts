// export const fetchLocation = async () => {
//   const response = await fetch("http://ip-api.com/json/?fields=country");
//   const location = await response.json();
//   return location.country;
// };

// export const fetchCountries = async () => {
//   try {
//     const response = await fetch("https://restcountries.com/v3.1/all");
//     const result = await response.json();
//     return result;
//   } catch (error) {
//     console.log(error);
//   }
// };

// export const fetchJobs = async (filters: JobFilterParams) => {
//   const { query, page } = filters;

//   const headers = {
//     "X-RapidAPI-Key": process.env.NEXT_PUBLIC_RAPID_API_KEY ?? "",
//     "X-RapidAPI-Host": "jsearch.p.rapidapi.com",
//   };

//   const response = await fetch(
//     `https://jsearch.p.rapidapi.com/search?query=${query}&page=${page}`,
//     {
//       headers,
//     }
//   );

//   const result = await response.json();

//   return result.data;
// };
import { Country } from "@/types"; // Assuming you might have a type, otherwise remove this

export const fetchLocation = async () => {
  try {
    const response = await fetch("http://ip-api.com/json/?fields=country");
    const location = await response.json();
    return location.country || "Nepal";
  } catch (error) {
    console.error("Error fetching location, defaulting to Nepal:", error);
    return "Nepal";
  }
};

export const fetchCountries = async () => {
  try {
    const response = await fetch("https://restcountries.com/v3.1/all");
    const result = await response.json();

    // 1. Map to a cleaner format to reduce data size
    const countries = result.map((country: any) => ({
      name: country.name.common,
      value: country.cca2, // 2-letter country code
    }));

    // 2. Sort alphabetically
    countries.sort((a: any, b: any) => a.name.localeCompare(b.name));

    // 3. Find Nepal and move it to the very top (The "Nepal Feature")
    const nepalIndex = countries.findIndex((c: any) => c.name === "Nepal");
    if (nepalIndex > -1) {
      const [nepal] = countries.splice(nepalIndex, 1);
      countries.unshift(nepal);
    }

    return countries;
  } catch (error) {
    console.log("Error fetching countries:", error);
    return [];
  }
};

export const fetchJobs = async (filters: JobFilterParams) => {
  const { query, page } = filters;

  const headers = {
    "X-RapidAPI-Key": process.env.NEXT_PUBLIC_RAPID_API_KEY ?? "",
    "X-RapidAPI-Host": "jsearch.p.rapidapi.com",
  };

  // Check if query exists, otherwise default to generic Nepal search
  const safeQuery = query ? query : "Software Developer in Nepal";

  try {
    const response = await fetch(
      `https://jsearch.p.rapidapi.com/search?query=${safeQuery}&page=${page}&num_pages=1`,
      {
        headers,
      }
    );

    const result = await response.json();

    return result.data || []; // Return empty array if data is null
  } catch (error) {
    console.error("JSearch API Error:", error);
    return [];
  }
};
