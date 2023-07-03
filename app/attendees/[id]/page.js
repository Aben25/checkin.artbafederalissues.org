export default async function AttendeesPage({ params }) {

  const { id } = params;
  
  const url = `https://connect.artba.org/api/events/${id}`; // Add id at the end of URL
  const headers = {
    Authorization: "Basic d2SuLwamTRQfEWqAuwBQ4zSTiSlq34mrICTaMeAIPS4=",
    "Content-Type": "application/json",
    Accept: "application/json",
  };

  const res = await fetch(url, { headers });

  if (!res.ok) {
    // This will activate the closest `error.js` Error Boundary
    throw new Error("Failed to fetch data");
  }

  const data = await res.json();
  console.log("data", data);

  return (
    <div>
      <h1>{data.Email}</h1>
    </div>
  );
}
