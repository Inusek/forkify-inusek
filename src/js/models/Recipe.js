//Import axiox package
import axios from 'axios';
//What we will export from here. And it is ID
export default class Recipe {
    constructor(id){
        this.id = id;
    }

    async getRecipe() {
        try{
            const res = await axios(`https://forkify-api.herokuapp.com/api/get?rId=${this.id}`);
            //data which we need to make a recpie
            this.title = res.data.recipe.title;
            this.author = res.data.recipe.publisher;
            this.image = res.data.recipe.image_url;
            this.url = res.data.recipe.source_url;
            this.ingredients = res.data.recipe.ingredients;
        } catch (error) {
            alert(`something went wrong: :( ${error}`);
        }
    }

    //method to calculate time expected to cook dish
    calcTime() {
        //we will estimate that for exery 3 ingredients we need aprox 15 min
        //ingredients is an array
        const numIng = this.ingredients.length;
        //every periode is 15 minutes
        const periods = Math.ceil(numIng / 3, 10);
        this.time = periods * 15;
    }

    //servings for how many people

    calcServings() {
        this.servings = 4;
    }

    //we create new array based on the old ones but just like we need
    parseIngredients() {
        //we create 2 arrays containing units
        //we want long version transform to short
        const unitsLong = ['tablespoons', 'tablespoon', 'ounces', 'ounce', 'teaspoons', 'teaspoon', 'cups', 'pounds'];
        const unitsShort = ['tbsp', 'tbsp', 'oz', 'oz', 'tsp', 'tsp', 'cup', 'pound'];
        const units = [...unitsShort, 'kg', 'g'];
        // for each part of array we will retun a new to the new array
        const newIngredients = this.ingredients.map(el => {
            // 1) Uniform units
            //convert units names .toLowerCase 
            let ingredient = el.toLowerCase();
            unitsLong.forEach((unit, i) => {
                // loop over the long array and raplace it with short at the same index [i];
                ingredient = ingredient.replace(unit, unitsShort[i]);
            });
            // 2) Remove parentheses "()"
            ingredient = ingredient.replace(/ *\([^)]*\) */g, ' ');
            // 3) Parse ingredients into count, units and ingredients
            //converting ingredient in to the array
            const arrIng = ingredient.split(' ');
            //finding index of the unit in the array
            //.includes(el) => returns true of false if elemnet is in the array
            //.findIndex will return then index nummber in which el is
            const unitIndex = arrIng.findIndex(el2 => units.includes(el2));
            //final object which we will return
            let objIng;
            if (unitIndex > -1){
                //There is a unit
                // Ex. 4 1/2 cups, arrCount is [4, 1/2] ---> eval("4+1/2") --> 4.5
                // Ex. 4 cups, arrCount is [4];
                const arrCount = arrIng.slice(0, unitIndex); 
                let count;
                if (arrCount.length === 1) {
                    count = eval(arrIng[0].replace('-', '+'));
                } else {
                    count = eval(arrIng.slice(0, unitIndex).join('+'));
                }                
                objIng = {
                    count,
                    unit: arrIng[unitIndex],
                    ingredient: arrIng.slice(unitIndex + 1).join(' '),
                }
            } else if (parseInt(arrIng[0], 10)){
                //There is NO unit, but 1st element is number
                objIng = {
                    count: parseInt(arrIng[0], 10),
                    unit: '',
                    //whole array without first position and then w join them into a string
                    ingredient:arrIng.slice(1).join(' ')
                }
            } else if (unitIndex === -1){
                //There is NO unit and NO number in 1st position
                objIng = {
                    count: 1,
                    unit: '',
                    ingredient,
                }
            }
            return objIng;
        });
        this.ingredients = newIngredients;
    }

    //type => if decrease or increase
    //if we hit the minus button or so
    updateServings (type) {
        //Servings
        //upadate the serving 
        const newServings = type === 'dec' ? this.servings - 1 : this.servings + 1;

        //Ingredients
        this.ingredients.forEach(ing => {
            ing.count *= (newServings / this.servings);
        });

        this.servings = newServings;
    };
}
