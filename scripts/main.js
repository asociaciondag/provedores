import fetchData from './fetch-data.js';

const filterCategories = document.getElementById('filter-categories');
const filterCouncils = document.getElementById('filter-councils');
const results = document.getElementById('results');
const csv = document.getElementById('csv').getAttribute('href');

fetchData(csv).then(data => {
    const councils = [];
    const categories = [];

    data.forEach(provider => {
        const {council} = provider;

        if (council && !councils.includes(council)) {
            councils.push(council);
        }

        provider.categories.forEach(category => {
            if (category && !categories.includes(category)) {
                categories.push(category);
            }
        })
    });

    filterCouncils.innerHTML += councils.map(council => `<option>${council}</option>`).join('');
    filterCategories.innerHTML += categories.map(category => `<option>${category}</option>`).join('');

    results.classList.add('providers');
    results.innerHTML = '';

    data.forEach(provider => {
        const element = document.createElement('article');
        element.classList.add('provider');
        element.innerHTML = `
            <header>
                <h1 class="provider-title">${
                    provider.web
                    ? `<a class="provider-web" href="${provider.web}">${provider.name}</a>`
                    : provider.name
                }</h1>
                <nav>
                    <strong class="provider-council">${provider.council}</strong><br>
                    ${provider.categories.map(cat => `<strong class="provider-category">${cat}</strong>`).join(', ')}
                </nav>
            </header>
            <p class="provider-description">${provider.description || 'Sin descripción'}</p>
            <p class="provider-address">${provider.address}</p>
        `;
        if (provider.phones) {
            element.innerHTML += `
                <p>Teléfono: ${
                    provider.phones.map(phone =>
                        `<a class="provider-phone" href="tel:${phone}">${phone}</a>`
                    ).join(', ')
                }</p>`;
        }
        if (provider.email) {
            element.innerHTML += `<p>Email: <a class="provider-email" href="mailto:${provider.email}">${provider.email}</a></p>`;
        }
        provider.element = element;
        results.append(element);
    });

    filterCouncils.addEventListener('change', filter)
    filterCategories.addEventListener('change', filter)

    function filter() {
        const category = filterCategories.value;
        const council = filterCouncils.value;

        data.forEach(provider => {
            if (council && provider.council && provider.council !== council) {
                provider.element.hidden = true;
                return;
            }

            if (category && !provider.categories.includes(category)) {
                provider.element.hidden = true;
                return;
            }

            provider.element.hidden = false;
        })
    }
})
