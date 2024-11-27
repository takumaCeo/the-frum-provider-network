const apiKey = 'patDBledtf4iQUEbj.ef4900285c1a43d887107bef1d9aae629c2aeead41eabe6a58561b9a879e0436';
const baseId = 'appbPGcBMTauJAj18';
const providersTable = 'Providers';
const categoriesTable = 'Categories';

const categoriesDiv = document.querySelector('.categories');
const providersTableBody = document.getElementById('providers-table');

// Fetch data from Airtable
async function fetchAirtableData(table, view = 'Grid view') {
  const url = `https://api.airtable.com/v0/${baseId}/${table}?view=${view}`;
  const response = await fetch(url, {
    headers: { Authorization: `Bearer ${apiKey}` }
  });
  const data = await response.json();
  return data.records;
}

// Render categories
async function renderCategories() {
  const providers = await fetchAirtableData(providersTable);
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
    div.onclick = () => renderProviders(category);
    categoriesDiv.appendChild(div);
  });
}

// Render providers
async function renderProviders(filterCategory = null) {
  const providers = await fetchAirtableData(providersTable);

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
  await renderCategories();
  await renderProviders();
}

init();
