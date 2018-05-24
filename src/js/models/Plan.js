export default class Plan {
    constructor() {
        this.foods = [];
        this.summary = {
            weight: 0,
            proximates: []
        }
    }

    addNutritient(id, name, proximates, proximatesValues, weight) {
        const food = {
            id,
            name,
            proximates,
            proximatesValues, // Add constant proximatesValues to calculate the plan later
            weight
        }
        this.foods.push(food);

        // Save data in local storage
        this.maintaintData();

        return food;
    }

    deleteItem(id) {
        // Remove one food or all of them
        if (id !== undefined) {
            const index = this.foods.findIndex(el => el.id === id);
            this.foods.splice(index, 1);
        } else this.foods.splice(0, this.foods.length);

        // Save data in local storage
        this.maintaintData();
    }

    calculateFood(id, newWeight) {
        const food = this.foods.find(el => el.id === id);
        food.weight = newWeight;

        // Calculate food proximates based on its weight
        food.proximates.forEach((el, i) => {
            el.value = (Math.ceil(parseFloat(food.proximatesValues[i]) * newWeight)) / 100;
        });

        // Save data in local storage
        this.maintaintData();
    }

    calculatePlan(foods) {
        this.summary.weight = 0;
        let proxArr = this.summary.proximates = [0, 0, 0, 0];

        // Sum up the plan weight in plan summary
        foods.forEach((el, i) => {
            this.summary.weight += el.weight;
        });

        // Sum up proximates in plan summary
        proxArr.forEach((el, i) => {
            foods.forEach(el2 => {
                proxArr[i] += parseFloat(el2.proximates[i].value);
            });
        });

        // Save data in local storage
        this.maintaintData();
    }

    maintaintData() {
        localStorage.setItem('foods', JSON.stringify(this.foods));
        localStorage.setItem('summary', JSON.stringify(this.summary));
    }

    readData() {
        const foods = JSON.parse(localStorage.getItem('foods'));
        const summary = JSON.parse(localStorage.getItem('summary'));

        // Get data back from the local storage
        if (foods) {
            this.foods = foods;
            this.summary = summary;
        }
    }
}