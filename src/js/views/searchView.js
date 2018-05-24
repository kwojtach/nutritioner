import { elements } from './base';

export const getInput = () => elements.searchInput.value;

export const clearInput = () => elements.searchInput.value = '';

export const clearResults = () => {
    elements.searchResultsList.innerHTML = '';
    elements.searchResultsPages.innerHTML = '';
};

export const activeNutritient = id => {
    // Remove the active class from all the nutritients to select only one at the time
    const nutritientsArr = Array.from(document.querySelectorAll('.results__item'));
    nutritientsArr.forEach(el => {
        el.classList.remove('results__item--selected');
    });

    // Add the active class to selected nutritient
    document.querySelector(`.results__item[href="#${id}"]`).classList.add('results__item--selected');
};

export const limitNutritientName = (name, limit = 30) => {
    const newName = [];
    if (name.length > limit) {
        name.split(' ').reduce((accumulator, current) => {
            if (accumulator + current.length <= limit) {
                newName.push(current);
            }
            return accumulator + current.length;
        }, 0);

        // Return the new nutritient name if it is longer than limit
        return `${newName.join(' ')}...`;
    }
    // Return name if it is shorter than limit
    return name;
};

const renderNutritient = nutritient => {
    const markup = `
    <li>
        <a href="#${nutritient.ndbno}" class="results__item">
            <h3 class="results__title">${limitNutritientName(nutritient.name)}</h3>
            <i class="results__icon ion-chevron-right"></i>
        </a>
    </li>
    `;
    elements.searchResultsList.insertAdjacentHTML('beforeend', markup);
};

const createButton = (page, type) => `
    <button class="btn btn-page btn-page--${type}" data-goto=${type === 'prev' ? page - 1 : page + 1}>
        <span>Page ${type === 'prev' ? page - 1 : page + 1}</span>
        <i class="ion-chevron-${type === 'prev' ? 'left' : 'right'}"></i>
    </button>
`;

const renderPageButtons = (page, numberOfResults, resultsPerPage) => {
    // Calculate number of pages
    const pages = Math.ceil(numberOfResults / resultsPerPage);

    let button;
    if (page === 1 && pages > 1) {
        // Show button to go to next page
        button = createButton(page, 'next');
    } else if (page < pages) {
        // Show both buttons
        button = `
            ${createButton(page, 'prev')}
            ${createButton(page, 'next')}
        `;
    } else if (page === pages && page > 1) {
        // Show button to go to previous page
        button = createButton(page, 'prev');
    } else {
        button = '';
    }

    elements.searchResultsPages.insertAdjacentHTML('afterbegin', button);
};

export const renderResults = (nutritients, page = 1, resultsPerPage = 12) => {
    const start = (page - 1) * resultsPerPage;
    const end = page * resultsPerPage;

    nutritients.slice(start, end).forEach(renderNutritient);

    renderPageButtons(page, nutritients.length, resultsPerPage);
};