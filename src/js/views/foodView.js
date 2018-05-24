import { elements } from './base';

export const clearFood = () => {
    elements.food.innerHTML = '';
};

const createNutrients = nutrients => `
    <li class="food__item">
        <div class="food__item-name">${nutrients.name} (${nutrients.name.slice(0,1)})</div>
        <div class="food__item-count">
            <span class="food__item-number">${nutrients.value}</span>
            <span class="food__item-unit">${nutrients.unit}</span>
        </div>
    </li>
`;

export const renderFood = food => {
    const markup = `
        <div class="food__content">
            <h1 class="food__title">
              ${food.name}
            </h1>
        </div>
        <form class="food__calc" action="">
            <input class="food__input" type="number" value="100" step="1" min="1">
            <p>g</p>
            <button class="btn btn-add">
                <i class="ion-plus-round"></i>
                <span>Add to the list</span>
            </button>
        </form>
        <div class="food__nutritient">
            <span class="food__nutritient-title">Nutritient</span>
            <span class="food__nutritient-value">Value per 100g</span>
        </div>
        <div class="food__proximates">
            <h2 class="food__heading">Proximates</h2>
            <ul class="food__proximates-list">
                ${food.proximates.map(el => createNutrients(el)).join('')}
            </ul>
        </div>
        <div class="food__minerals">
            <h2 class="food__heading">Minerals</h2>
            <ul class="food__minerals-list">
                ${food.minerals.map(el => createNutrients(el)).join('')}
            </ul>
        </div>
    `;
    elements.food.innerHTML = '';
    elements.food.insertAdjacentHTML('afterbegin', markup);
};