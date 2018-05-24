import axios from 'axios';
import { key, proxy } from '../config';

export default class Food {
    constructor(id) {
        this.id = id;
    }

    async getFood() {
        try {
            const res = await axios(`${proxy}https://api.nal.usda.gov/ndb/reports/?ndbno=${this.id}&format=json&api_key=${key}`);
            this.name = res.data.report.food.name;
            this.components = res.data.report.food.nutrients;
            this.proximates = [];
            this.proximatesValues = []; // Add constant proximatesValues to calculate the plan later
            this.minerals = [];

        } catch (error) {
            console.log(error);
            alert('Something went wrong with rendering food');
        }
    }

    getFoodData() {
        let nutrients = [];

        // Create an array with IDs to target specific proximates and minerals
        // e.g. for protein ID = '203';
        const proxAndMins = ['208', '203', '204', '205',    // Proximates e.g. protein
        '301', '303', '304', '305', '306', '307', '309'];   // Minerals e.g. calcium

        this.components.forEach(el => {
                if (proxAndMins.includes(el.nutrient_id)) {
                    nutrients.push(el);
                }
        });

        this.proximates = nutrients.slice(0, 4);
        this.minerals = nutrients.slice(4);

        this.proximates.forEach(el => {
            this.proximatesValues.push(el.value);
        });
    }
};