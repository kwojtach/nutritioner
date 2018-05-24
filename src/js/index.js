import Search from './models/Search';
import Food from './models/Food';
import Plan from './models/Plan';
import * as searchView from './views/searchView';
import * as foodView from './views/foodView';
import * as planView from './views/planView';
import { elements, renderLoader, clearLoader } from './views/base';

// Add state object to maintain present state
// of the application
const state = {};

// SEARCH CONTROLLER
const controlSearch = async () => {
    // Get query from the input view
    const query = searchView.getInput();

    if (query) {
        // Create new search object and add it to the present state
        state.search = new Search(query);

        // Clean up UI for the new results
        searchView.clearInput();
        searchView.clearResults();
        renderLoader(elements.searchResults);

        try {
            // Search for the food results
            await state.search.getResults();

            // Render results on the UI
            clearLoader();
            searchView.renderResults(state.search.result);
        } catch(error) {
            alert('Something went wrong, try again :)');
            clearLoader();
        }
    }
};

elements.searchForm.addEventListener('submit', e => {
    e.preventDefault();
    controlSearch();
});

elements.searchResultsPages.addEventListener('click', e => {
    const button = e.target.closest('.btn-page');
    if (button) {
        const goToPage = parseInt(button.dataset.goto, 10);

        // Render buttons if necessary
        searchView.clearResults();
        searchView.renderResults(state.search.result, goToPage);
    }
});


// FOOD CONTROLLER
const controlFood = async () => {
    // Get Nutritient ID from url
    const id = window.location.hash.replace('#', '');

    if (id) {
        // Clean up UI for for new food
        foodView.clearFood();
        renderLoader(elements.food);

        // Add active class to selected nutritient
        if (state.search) searchView.activeNutritient(id);

        // Create new nutritient object
        state.food = new Food(id);

        try {
            // Get nutritient data
            await state.food.getFood();

            state.food.getFoodData();

            // Render food
            clearLoader();
            foodView.renderFood(state.food);
        } catch (error) {
            alert('Food did not load somehow');
        }
    }
};

['hashchange', 'load'].forEach(el => window.addEventListener(el, controlFood));


// PLAN CONTROLLER
const controlPlan = weight => {
    // Create new plan if there is no plan yet
    if (!state.plan) state.plan = new Plan();
    
    // Add food and its nutritients to the plan
    // if it does not exist yet
    let found = false;
    for (let i = 0; i < state.plan.foods.length; i++) {
        if (state.plan.foods[i].id === state.food.id) {
            planView.hightlightPlanFood(state.plan.foods[i].id, true);
            found = true;
            break;
        }
    }
    if (!found) {
        // Add new food to plan

        const food = state.plan.addNutritient(
            state.food.id, 
            state.food.name, 
            state.food.proximates, 
            state.food.proximatesValues, 
            weight);

        // Calculate plan
        state.plan.calculateFood(food.id, weight);
        state.plan.calculatePlan(state.plan.foods);

        // Render the food to the plan
        // and update plan's summary
        planView.renderPlanFood(food);
        planView.updatePlanSummary(state.plan.summary);
    }
};

window.addEventListener('load', () => {
    // Create plan object
    state.plan = new Plan();

    // Get data from storage
    state.plan.readData();

    // Render the plan with all foods
    // and count its summary
    state.plan.foods.forEach(el => planView.renderPlanFood(el));
    if (state.plan.foods.length > 0) planView.updatePlanSummary(state.plan.summary);
});

elements.searchResultsList.addEventListener('click', e => {
    // Highlight the food if it's already added to plan
    if (e.target.matches('.results__item, .results__item *')) planView.hightlightPlanFood(false);
});

elements.food.addEventListener('submit', e => {
    const weight = parseFloat(document.querySelector('.food__input').value);

    // Add food to the plan with food input value
    if (e.target.closest('.food__calc')) {
        e.preventDefault();
        controlPlan(weight);
    }
});

elements.planButton.addEventListener('click', e => planView.renderPlanClearPopout(true));

elements.plan.addEventListener('click', e => {
    // If press yes
    if (e.target.matches('.btn-yes, .btn-yes *')) {
        // Delete all foods from object plan
        state.plan.deleteItem();
        state.plan.calculatePlan(state.plan.foods);

        // Update UI after deleting foods
        planView.deletePlanFood();
        planView.updatePlanSummary(state.plan.summary);
        planView.renderPlanClearPopout(false);
    }

    // If press no
    if (e.target.matches('.btn-no, .btn-no *')) {
        // Close popout window only
        planView.renderPlanClearPopout(false);
    }
});

elements.planList.addEventListener('click', e => {
    const id = e.target.closest('.nutritient').dataset.foodid;
    const food = state.plan.foods.find(el => el.id === id);

    if (e.target.matches('.btn-delete, .btn-delete *')) {
        // Delete specific food from object plan
        state.plan.deleteItem(id);
        state.plan.calculatePlan(state.plan.foods);

        // Update UI after deleting food
        planView.deletePlanFood(id);
        planView.updatePlanSummary(state.plan.summary);
    }

    if (e.target.matches('.btn-close, .btn-close *')) {
        // Close popout window saying that
        // the food is already added
        planView.hightlightPlanFood(id, false);
    }
});

elements.planList.addEventListener('input', e => {
    const id = e.target.closest('.nutritient').dataset.foodid;
    const food = state.plan.foods.find(el => el.id === id);

    if (e.target.matches('.nutritient__input')) {
        const number = parseFloat(e.target.value, 10);

        // Calculate the plan after changing 
        // food input in the plan
        state.plan.calculateFood(id, number);
        state.plan.calculatePlan(state.plan.foods);

        // Update UI after changing food input value
        planView.updatePlanFood(id, food);
        planView.updatePlanSummary(state.plan.summary);
    }
});

elements.print.addEventListener('click', e => {
    // Print the nutrition plan
    window.print();
});