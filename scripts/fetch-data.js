export default function (url) {
    return fetch(url)
        .then(res => res.text())
        .then(text => parseCsv(text))
}

function parseCsv(text) {
    return text
        .split('\n')
        .map(line => parseLine(line.trim()))
        .slice(1)
        .map(row => {
            const [name, cat1, cat2, council, address, phone, email, web, description] = row;
            const value = { name, council, address, phone, email, web, description, categories: [cat1] };

            if (cat2) {
                value.categories.push(cat2);
            }

            return value;
        })
}

function parseLine(line) {
    const fields = [];
    
    for (let pos = 0; pos < line.length; pos++) {
        let value = '';
        let char = line[pos];
        let quoted = char === '"';

        if (quoted) {
            char = line[++pos];
        }

        while (char && (char !== ',' || quoted)) {
            if (char === '"') {
                quoted = false;
            } else {
                value += char;
            }

            char = line[++pos];
        }

        fields.push(value);
    }

    return fields;
}