
//search.js --> const res = await axios(`https://forkify-api.herokuapp.com/api/search?&q=${this.query}`);
//recipe.js --> const res = await axios(`https://forkify-api.herokuapp.com/api/get?rId=${this.id}`);
//Import our query from Search.js
import Search from './models/Search';
//Import our whole recipe from Recipe.js
import Recipe from './models/Recipe';
//Import our whole list from List.js
import List from './models/List';
//Import
import Likes from './models/Likes';
//Import names from base
import { elements, renderLoader, clearLoader } from './views/base';
//Import all things from searchView
import * as searchView from './views/searchView';
//Import all things from recipeView
import * as recipeView from './views/recipeView';
//Import all things from listView
import * as listView from './views/listView';
//Import all things from likesView
import * as likesView from './views/likesView';


/* Global state of the app
* - Search object
* - Current recipe object
* - Shoping list object
* - Liked recpies
*/


///////////////////////
// Search controller
//////////////////////
const  state = {};

//function when the call is submited
const controlSearch = async () => {
    // 1) Get query from view
    const query = searchView.getInput(); //TODO

    if (query) {
        // 2) New search object and add to state
        state.search = new Search(query);

        // 3) prepare UI for results
        //clear input field
        searchView.clearInput();
        //clear results list
        searchView.clearResults();
        //Render the loader arrow
        renderLoader(elements.searchRes);
        try{
            // 4) Search for recipes
            // getResult returns a promise then we have to await for results
            //recive an array of recipes
            await state.search.getResult();

            // 5) Render results on UI
            //clearing the loader arrow
            clearLoader();
            searchView.renderResults(state.search.result); 
        } catch (error) {
            alert('Error!!! Error!!!');
            clearLoader();
        }
    }
}

//Event listener for the search button
elements.searchForm.addEventListener('submit', e => {
    //prevents the page to reload
    e.preventDefault();
    //calling a controlSearch function
    controlSearch();

})

//our event listeneres
//we dont have a button before its appear
//we use a class name where the buttons will appear
elements.searcgResPages.addEventListener('click', e => {
    //We use Element.closest() method which returns the closest ancestor of current element
    const btn = e.target.closest('.btn-inline');
    if  (btn) {
        //read out the data that is stored in atribute "GOTO"
        const goToPage = parseInt(btn.dataset.goto, 10);
        //Cleaning the results
        searchView.clearResults();
        //Render page from the buttton
        searchView.renderResults(state.search.result, goToPage);
    }
});


///////////////////////
// Recipe controller
//////////////////////
const controlRecipe = async () => {
    //we will get hash property from the url
    //window.location --> whole url
    //window.location.hash --> only hash property
    //on string we can use replace('what will be changed', 'for what');
    const id = window.location.hash.replace('#', '');
    //we want to do all this logic only when we actualy have a recipe
    if (id) {

        //Prepare UI for changes
        recipeView.clearRecipe();
        renderLoader(elements.recipe);
        //Highlight selected search item
        if(state.search) searchView.highlightSelected(id);
        //Create new recipe object
        state.recipe = new Recipe(id);
        try{
            //Get recipe data and parse ingredients
            await state.recipe.getRecipe();
            state.recipe.parseIngredients();

            //Calculate serving and time
            state.recipe.calcTime();
            state.recipe.calcServings();
            //Render recipe
            clearLoader();
            recipeView.renderRecipe(
                state.recipe,
                state.likes.isLiked(id)
            );
        } catch (errpr) {
            alert('Error processing recipe!');
        }
    }
}
//Event listener which will catch if something changed in url #92302 and then will call controlRecipe
//window.addEventListener('hashchange', controlRecipe);
//When the page is reload, or load from exteral source we use this evenet listener
//window.addEventListener('load', controlRecipe);
//When we want to add the same callback function we can just
['hashchange', 'load'].forEach(event => window.addEventListener(event, controlRecipe));

///////////////////
//// List controler
///////////////////

const controlList = () => {
    // Create a new list If there is none yet
    if(!state.list) state.list = new List();

    // Add each ingredient to the list and user UI
    state.recipe.ingredients.forEach(el => {
        const item = state.list.addItem(el.count, el.unit, el.ingredient)
        listView.renderItem(item);
    })
}



// Handle delete and update list item events
elements.shopping.addEventListener('click', e => {
    //we want to find a id of the item
    const id = e.target.closest('.shopping__item').dataset.itemid;

    // Handle the delete button
    if (e.target.matches('.shopping__delete, .shopping__delete *')) {
        // Delete from the state
        state.list.deleteItem(id);
        // Delete from UI
        listView.deleItem(id); 
    // Hanle the count update
    } else if (e.target.matches('.shopping__count-value')) {
        //we read from dom what value is set
        const val = parseFloat(e.target.value);
        //now we set a new value to the state
        state.list.updateCount(id, val);
    }
});

///////////////////
//// Likes controler
///////////////////

// Testing


const controlLike = () => {
    if (!state.likes) state.likes = new Likes();
    const currentID = state.recipe.id;

    //User has not yet liked current recipe
    if (!state.likes.isLiked(currentID)){
        //Add like to the state
        const newLike = state.likes.addLike(
            currentID,
            state.recipe.title,
            state.recipe.author,
            state.recipe.image
        );
        //Toggle the like button
        likesView.toggleLikeBtn(true);
        //Add like to UI list
        likesView.renderLike(newLike);
        
    //User has yet liked current recipe
    } else {
        //Remove like to the state
        state.likes.deleteLike(currentID);
        //Toggle the like button
        likesView.toggleLikeBtn(false);
        //Remove like from UI list
        likesView.deleteLike(currentID);
    }
    //toogle the like menu
    likesView.toggleLikeMenu(state.likes.getNumLikes());
};

// restore liked recipes on page load
window.addEventListener('load', () => {
    state.likes = new Likes();
    //restore likes
    state.likes.readStorage();
    //toggle like menu
    likesView.toggleLikeMenu(state.likes.getNumLikes());
    //Render the existing likes
    state.likes.likes.forEach( like => likesView.renderLike(like));
})



//Handlig recipe button click
elements.recipe.addEventListener('click', e => {
    //we select the button and any of its childs
    //if the target maches this class
    if (e.target.matches('.btn-decrease, .btn-decrease *')){
        //decrease button is clicked
        //We want to do it only when servingsis more than one
        if (state.recipe.servings > 1) {
            state.recipe.updateServings('dec');
            recipeView.updateServingsIngredients(state.recipe);
        }        
    } else if (e.target.matches('.btn-increase, .btn-increase *')){
        //increase button is clicked
        state.recipe.updateServings('inc');
        recipeView.updateServingsIngredients(state.recipe);
    } else if (e.target.matches('.recipe__btn--add, .recipe__btn--add *')) {
        //Add ingredients to shopping list
        controlList();
    } else if (e.target.matches ('.recipe__love, .recipe__love *')) {
        // Like controler
        controlLike();
    }
});


























