import axios from 'axios';
import { key, proxy } from '../config';

export default class Search {
    constructor(query) {
        this.query = query;
    }

    async getResults() {
        try {
            const res = await axios(`${proxy}https://api.nal.usda.gov/ndb/search/?format=json&q=${this.query}&ds=Standard%20Reference&sort=r&max=50&offset=0&api_key=${key}`);
            this.result = res.data.list.item;
        } catch(error) {
            alert(error);
        }
    }
};