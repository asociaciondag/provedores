const filterCategories = document.getElementById('filter-categories');
const filterCouncils = document.getElementById('filter-councils');
const results = document.getElementById('results');

fetch('../provedores.json')
    .then(res => res.json())
    .then(data => {
        const councils = new Set();
        const categories = new Set();

        data.forEach(provider => {
            if (provider.council) {
                councils.add(provider.council);
            }

            provider.categories.forEach(category => categories.add(category));
        });

        filterCouncils.innerHTML += Array.from(councils).map(council => `<option>${council}</option>`).join('');
        filterCategories.innerHTML += Array.from(categories).map(category => `<option>${category}</option>`).join('');

        results.classList.add('providers');
        results.innerHTML = '';

        data.sort((a, b) => a.name < b.name ? -1 : 1);

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
