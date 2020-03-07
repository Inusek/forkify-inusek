
//Import axiox package
import axios from 'axios';
//What we will export from here. And it is query
export default class Search {
    constructor(query){
        this.query = query;
    }
//Search method
    async getResult() {
        //axios returns .json
        try {
            const res = await axios(`https://forkify-api.herokuapp.com/api/search?&q=${this.query}`);
            //Our recipes will be saved in an object
            this.result = res.data.recipes;
            //console.log(this.result);
        } catch (error){
            alert(error);
        }
        
    }
}

