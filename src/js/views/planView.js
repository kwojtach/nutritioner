import { elements } from './base';

const createProximates = proximates => `
    <span class="nutritient__proximate">${proximates.value}</span>
`;

export const renderPlanFood = food => {
    const markup = `
        <li class="nutritient" data-foodid=${food.id}>
            <span class="nutritient__name">
                ${food.name}
            </span>
            <div class "nutritient__options"></div>
            <input class="nutritient__input" type="number" value="${food.weight}" step="1" min="1">
                <button class="btn btn-small btn-delete">
                    <i class="ion-android-close"></i>
                </button>
            </div>
            ${food.proximates.map(el => createProximates(el)).join('')}
        </li>
    `;
    elements.planList.insertAdjacentHTML('afterbegin', markup);
};

export const hightlightPlanFood = (id, type) => {

    if (type === true && id !== undefined) {
        const food = document.querySelector(`[data-foodid="${id}"]`);
        const markup = `
        <div class="food-popout">
            <span class="food-popout__text">Food already added</span>
            <button class="btn btn-small btn-close">
                <i class="ion-android-close"></i>
            </button>
        </div>
        `;

        // Add popout window when the food is already added
        food.insertAdjacentHTML('beforeend', markup);
        food.classList.add('nutritient--active');
    } else {
        const popouts = Array.from(document.querySelectorAll('.food-popout'));
        const foods = Array.from(document.querySelectorAll('.nutritient'));

        // Close all popout windows
        popouts.forEach(el => el.parentElement.removeChild(el));
        foods.forEach(el => el.classList.remove('nutritient--active'));
    }
};

export const deletePlanFood = id => {
    // Remove one food or all of them from UI
    if (id !== undefined) {
        const food = document.querySelector(`[data-foodid="${id}"]`);
        if (food) food.parentElement.removeChild(food);
    } else {
        const foods = Array.from(document.querySelectorAll('.nutritient'));
        foods.forEach(el => el.parentElement.removeChild(el));
    }
};

export const renderPlanClearPopout = (type) => {
    if (type === true) {
        const markup = `
        <div class="plan-popout">
            <span class="plan-popout__text">Are you sure?</span>
            <div class="plan-popout__buttons">
                <button class="btn btn-small btn-yes">Y</button>
                <button class="btn btn-small btn-no">N</button>
            </div>
        </div>
        `;

    elements.plan.insertAdjacentHTML('afterbegin', markup);
    } else {
        const popouts = Array.from(document.querySelectorAll('.plan-popout'));
        popouts.forEach(el => el.parentElement.removeChild(el));
    }
}

export const updatePlanFood = (id, food) => {
    const newProximates = Array.from(document.querySelectorAll(`[data-foodid="${id}"] .nutritient__proximate`));

    newProximates.forEach((el, i) => {
        el.textContent = food.proximates[i].value;
    });
};

export const updatePlanSummary = summary => {
    const newProximates = Array.from(document.querySelectorAll('.sum__proximate'));
    const newWeight = document.querySelector('.sum__all');

    newProximates.forEach((el, i) => {
        el.textContent = Math.round(summary.proximates[i] * 100) / 100;
    });
    newWeight.textContent = summary.weight;
};