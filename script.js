const categoriesDiv = document.querySelector('.categories');
const providersTableBody = document.getElementById('providers-table');

// Fetch providers from Netlify serverless function
async function fetchProviders() {
  const response = await fetch('/.netlify/functions/fetchProviders');
  const data = await response.json();
  return data.records; // Airtable records
}

// Render categories
async function renderCategories(providers) {
  const categoryCounts = {};

  // Count providers per category
  providers.forEach((record) => {
    const categories = record.fields.Categories || [];
    categories.forEach((category) => {
      categoryCounts[category] = (categoryCounts[category] || 0) + 1;
    });
  });

  // Sort categories by count
  const sortedCategories = Object.entries(categoryCounts).sort(
    ([, countA], [, countB]) => countB - countA
  );

  // Render categories
  categoriesDiv.innerHTML = '';
  sortedCategories.forEach(([category, count]) => {
    const div = document.createElement('div');
    div.textContent = `${category} (${count})`;
    div.classList.add('category');
    div.onclick = () => renderProviders(providers, category);
    categoriesDiv.appendChild(div);
  });
}

// Render providers
function renderProviders(providers, filterCategory = null) {
  // Filter providers by category if specified
  const filteredProviders = filterCategory
    ? providers.filter((record) =>
        (record.fields.Categories || []).includes(filterCategory)
      )
    : providers;

  // Render provider rows
  providersTableBody.innerHTML = '';
  filteredProviders.forEach((record) => {
    const { Company, FirstName, LastName, Phone, Email, Website, Categories } =
      record.fields;

    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${Company || ''}</td>
      <td>${FirstName || ''}</td>
      <td>${LastName || ''}</td>
      <td>${Phone || ''}</td>
      <td>${Email || ''}</td>
      <td>${Website || ''}</td>
      <td>${(Categories || []).join(', ')}</td>
    `;
    providersTableBody.appendChild(row);
  });
}

// Initialize the page
async function init() {
  const providers = await fetchProviders(); // Fetch providers from the serverless function
  renderCategories(providers); // Render categories
  renderProviders(providers); // Render all providers initially
}

init();
