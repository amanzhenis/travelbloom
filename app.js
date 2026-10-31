const form = document.querySelector('#search-form');
const search = document.querySelector('#search');
const results = document.querySelector('#results');
const status = document.querySelector('#status');
const welcome = document.querySelector('#welcome');
let request = 0;
async function recommend(query) {
  const keyword = query.trim().toLowerCase();
  if (!results) { location.href = 'home.html?q=' + encodeURIComponent(keyword); return; }
  const current = ++request;
  results.replaceChildren(); welcome.hidden = true;
  if (!keyword) { status.textContent = 'Enter a destination or try beaches, temples or countries.'; return; }
  status.textContent = 'Finding your next adventure…';
  try {
    const response = await fetch('./destinations.json');
    if (!response.ok) throw new Error('Unable to load recommendations');
    const data = await response.json();
    if (current !== request) return;
    const aliases = {beach:'beaches', beaches:'beaches', temple:'temples', temples:'temples', country:'countries', countries:'countries'};
    const matches = aliases[keyword] ? data[aliases[keyword]] : Object.values(data).flat().filter(place => (place.name + ' ' + place.description).toLowerCase().includes(keyword));
    status.textContent = matches.length ? `${matches.length} recommendations for “${query.trim()}”` : 'No destinations found. Try beach, temple, country, Japan or France.';
    for (const place of matches) {
      const card = document.createElement('article'); card.className = 'card';
      const image = document.createElement('img'); image.src = place.imageUrl; image.alt = place.name; image.width = 900; image.height = 560;
      const body = document.createElement('div');
      const heading = document.createElement('h2'); heading.textContent = place.name;
      const description = document.createElement('p'); description.textContent = place.description;
      const visit = document.createElement('a'); visit.href = 'contact.html'; visit.textContent = 'Plan a visit ↗';
      body.append(heading, description, visit); if (place.credit) { const credit = document.createElement("a"); credit.href = place.creditUrl; credit.textContent = place.credit; credit.style.cssText = "display:block;font-size:9px;margin-top:12px"; body.append(credit); } card.append(image, body); results.append(card);
    }
  } catch (error) { if (current === request) status.textContent = 'Recommendations could not load. Please try again.'; }
}
form.addEventListener('submit', event => { event.preventDefault(); recommend(search.value); });
document.querySelector('#clear').addEventListener('click', () => { ++request; search.value = ''; if (results) { results.replaceChildren(); status.textContent = ''; welcome.hidden = false; } search.focus(); });
document.querySelectorAll('[data-query]').forEach(button => button.addEventListener('click', () => { search.value = button.dataset.query; recommend(search.value); }));
const initial = new URLSearchParams(location.search).get('q');
if (initial) { search.value = initial; recommend(initial); }
const contact = document.querySelector('#contact-form');
if (contact) contact.addEventListener('submit', event => { event.preventDefault(); const fields = new FormData(contact); const link = document.querySelector('#email-draft'); link.href = 'mailto:travelbloom@example.com?subject=' + encodeURIComponent('Travel inquiry from ' + fields.get('name')) + '&body=' + encodeURIComponent(fields.get('message') + '\n\nReply to: ' + fields.get('email')); link.hidden = false; document.querySelector('#contact-status').textContent = 'Your draft is ready. This demo does not send messages automatically.'; });
document.querySelectorAll('nav a').forEach(link => { if (link.pathname === location.pathname || (location.pathname.endsWith('/') && link.pathname.endsWith('index.html'))) link.setAttribute('aria-current', 'page'); });





