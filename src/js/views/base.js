export const elements = {
    searchForm: document.querySelector('.search'),
    searchInput: document.querySelector('.search__input'),
    searchResults: document.querySelector('.results'),
    searchResultsList: document.querySelector('.results__list'),
    searchResultsPages: document.querySelector('.results__pages'),
    print: document.querySelector('.print'),
    food: document.querySelector('.food'),
    plan: document.querySelector('.plan'),
    planButton: document.querySelector('.btn-remove'),
    planList: document.querySelector('.plan__list')
};

export const elementsStrings = {
    loader: 'loader'
};

export const renderLoader = parent => {
    const loader = `
        <div class="${elementsStrings.loader}">
            <i class="${elementsStrings.loader}__icon ion-load-a"></i>
        </div
    `;
    parent.insertAdjacentHTML('afterbegin', loader);
};

export const clearLoader = () => {
    const loader = document.querySelector(`.${elementsStrings.loader}`);
    if (loader) loader.parentElement.removeChild(loader);
};