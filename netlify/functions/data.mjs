const BASE_ID = "appbPGcBMTauJAj18";
const AIRTABLE_API_KEY = Netlify.env.get("AIRTABLE_API_KEY") || "";

function tableResponseToObject(tableData) {
  return tableData.records.reduce(
    (acc, record) => ({ ...acc, [record.id]: record.fields.Name }),
    {}
  );
}
async function getAirtableTable(tableName) {
  const url = `https://api.airtable.com/v0/${BASE_ID}/${encodeURIComponent(
    tableName
  )}`;
  const response = await fetch(url, {
    headers: { authorization: `Bearer ${AIRTABLE_API_KEY}` },
  });
  return await response.json();
}
const tableNames = ["Providers", "Service Areas", "Categories"];

export default async function data(req, context) {
  const promises = tableNames.map(getAirtableTable);
  const [providersResponse, serviceAreasResponse, categoriesResponse] =
    await Promise.all(promises);
  const categories = tableResponseToObject(categoriesResponse);
  const serviceAreas = tableResponseToObject(serviceAreasResponse);

  const providers = providersResponse.records.map((provider) => ({
    id: provider.id,
    Phone: provider.fields["Phone"],
    Categories: provider.fields["Categories"].map((id) => categories[id]),
    Email: provider.fields["Email"],
    serviceAreas: provider.fields["Service Areas"].map(
      (id) => serviceAreas[id]
    ),
    Name: `${provider.fields["First Name"]} ${provider.fields["Last Name"]}`
      .trim()
      // normalize whitespace
      .replace(/\s+/g, " "),
    Company: provider.fields["Company"],
  }));

  return new Response(
    JSON.stringify({
      categories: Object.values(categories),
      serviceAreas: Object.values(serviceAreas),
      providers,
    }),
    {
      headers: {
        "Content-Type": "application/json",
      },
      status: 200,
    }
  );
}
