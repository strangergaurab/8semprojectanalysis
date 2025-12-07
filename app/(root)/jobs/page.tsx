// import JobCard from "@/components/cards/JobCard";
// import JobsFilter from "@/components/filters/JobFilter";
// import Pagination from "@/components/Pagination";
// import {
//   fetchCountries,
//   fetchJobs,
//   fetchLocation,
// } from "@/lib/actions/job.action";

// const Page = async ({ searchParams }: RouteParams) => {
//   const { query, location, page } = await searchParams;
//   const userLocation = await fetchLocation();

//   const jobs = await fetchJobs({
//     query: `${query}, ${location}` || `Software Engineer in ${userLocation}`,
//     page: page ?? 1,
//   });

//   const countries = await fetchCountries();
//   const parsedPage = parseInt(page ?? 1);

//   console.log(jobs);

//   return (
//     <>
//       <h1 className="h1-bold text-dark100_light900">Jobs</h1>

//       <div className="flex">
//         <JobsFilter countriesList={countries} />
//       </div>

//       <section className="light-border mb-9 mt-11 flex flex-col gap-9 border-b pb-9">
//         {jobs?.length > 0 ? (
//           jobs
//             ?.filter((job: Job) => job.job_title)
//             .map((job: Job) => <JobCard key={job.id} job={job} />)
//         ) : (
//           <div className="paragraph-regular text-dark200_light800 w-full text-center">
//             Oops! We couldn&apos;t find any jobs at the moment. Please try again
//             later
//           </div>
//         )}
//       </section>

//       {jobs?.length > 0 && (
//         <Pagination page={parsedPage} isNext={jobs?.length === 10} />
//       )}
//     </>
//   );
// };

// export default Page;
import JobCard from "@/components/cards/JobCard";
import JobsFilter from "@/components/filters/JobFilter";
import Pagination from "@/components/Pagination";
import {
  fetchCountries,
  fetchJobs,
  fetchLocation,
} from "@/lib/actions/job.action";

interface RouteParams {
  searchParams: {
    query?: string;
    location?: string;
    page?: string;
  };
}

interface Job {
  id: string;
  job_title: string;
  // Add other job properties here based on your API response
  [key: string]: any;
}

const Page = async ({ searchParams }: RouteParams) => {
  // Await searchParams (Next.js 15 requirement, good practice generally)
  const { query, location, page } = await searchParams;

  // 1. Fetch user location, but default to "Nepal" if it fails or is empty
  let userLocation = await fetchLocation();
  if (!userLocation) userLocation = "Nepal";

  // 2. Construct the search query specifically for Nepal context
  // If the user hasn't typed anything, we default to finding jobs in Nepal
  const searchQuery = query
    ? `${query}, ${location || "Nepal"}` // If user types "React", search "React, Nepal"
    : `Software Engineer in ${location || "Nepal"}`;

  const jobs = await fetchJobs({
    query: searchQuery,
    page: page ?? 1,
  });

  // 3. Fetch countries but prioritize Nepal in the list
  const countries = await fetchCountries();

  // Optional: Ensure Nepal is at the top of your filter list if it exists in the data
  if (countries && Array.isArray(countries)) {
    const nepalIndex = countries.findIndex((c: any) => c.name === "Nepal");
    if (nepalIndex > 0) {
      const [nepal] = countries.splice(nepalIndex, 1);
      countries.unshift(nepal);
    }
  }

  const parsedPage = parseInt(page ?? "1");

  return (
    <>
      <h1 className="h1-bold text-dark100_light900">
        Jobs in <span className="text-primary-500">Nepal</span>
      </h1>

      <div className="flex">
        <JobsFilter countriesList={countries} />
      </div>

      <section className="light-border mb-9 mt-11 flex flex-col gap-9 border-b pb-9">
        {jobs?.length > 0 ? (
          jobs
            ?.filter((job: Job) => job.job_title)
            .map((job: Job) => <JobCard key={job.id} job={job} />)
        ) : (
          <div className="paragraph-regular text-dark200_light800 w-full text-center">
            <p>Oops! We couldn&apos;t find any jobs in Nepal right now.</p>
            <p className="text-small-regular mt-2 text-light-500">
              Try searching for Kathmandu, Lalitpur, or specific tech stacks
              like Laravel.{" "}
            </p>
          </div>
        )}
      </section>

      {jobs?.length > 0 && (
        <Pagination page={parsedPage} isNext={jobs?.length === 10} />
      )}
    </>
  );
};

export default Page;
