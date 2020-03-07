//Import names from base
import { elements } from './base';

//return search input value -->> which will whatever we will input
export const getInput = () => elements.searchInput.value;

//Crearing an input field
export const clearInput = () => {
    elements.searchInput.value = '';
};
//crating the result section
export const clearResults = () => {
    //how to clear html
    elements.searchResList.innerHTML = '';
    //cleaning buttons
    elements.searcgResPages.innerHTML = '';
};

export const highlightSelected = id => {
    //transform to the array
    const resultsArr = Array.from(document.querySelectorAll('.results__link'));
    resultsArr.forEach(el => {
        el.classList.remove('results__link--active');
    })
    document.querySelector(`.results__link[href="#${id}"]`).classList.add('results__link--active');
};
// 'Pasta with tomato and spinach' <= array with 5 elements
        /*
        acc: 0 / acc + cur.length = 5 / newTitle = ['Pasta']
        acc: 5 / acc + cur.length = 9 / newTitle = ['Pasta', 'with']
        acc: 9 / acc + cur.length = 15 / newTitle = ['Pasta', 'with', 'tomato']
        acc: 15 / acc + cur.length = 18 / newTitle = ['Pasta', 'with', 'tomato']
        acc: 18 / acc + cur.length = 24 / newTitle = ['Pasta', 'with', 'tomato']

        */
        
//Function for making a tilte only one line long
export const limitRecipeTilte = (title, limit = 17) => {
    const newTitle = [];
    if(title.length > limit) {
        //we take a tilte a split it by space        
        //when we have array we can use reduce method
        title.split(' ').reduce((acc, cur) => {
            if (acc + cur.length <= limit) {
                newTitle.push(cur);
            }
            return acc + cur.length;
        }, 0);
        //return the result
        //.join method will join elements of the array into the string saparated by spaces
        return `${newTitle.join(' ')} ...`;
    }
    return title;
}

//this function will recive only one recipie and it will be used later in a foreach loop
const renderRecipe = recipe => {
    //HTML code for a recipe 
    const markup = `
        <li>
            <a class="results__link" href="#${recipe.recipe_id}">
                <figure class="results__fig">
                    <img src="${recipe.image_url}" alt="${recipe.title}">
                </figure>
                <div class="results__data">
                    <h4 class="results__name">${limitRecipeTilte(recipe.title)}</h4>
                    <p class="results__author">${recipe.publisher}</p>
                </div>
            </a>
        </li>
    `;
    //Render our HTML (possition, html)
    elements.searchResList.insertAdjacentHTML('beforeend', markup);
};
//method to create buttons
//type: 'prev' or 'next'
const createButton = (page, type) => `
    <button class="btn-inline results__btn--${type}" data-goto=${type === 'prev' ? page - 1 : page + 1}>
    <span>Page ${type === 'prev' ? page - 1 : page + 1}</span>
        <svg class="search__icon">
            <use href="img/icons.svg#icon-triangle-${type === 'prev' ? 'left' : 'right'}"></use>
        </svg>        
    </button>
`;


//function to render buttons which will change the page of results
const renderButtons = (page, numResults, resPerPage) => {

    //we want to calculate how many pages will be needed
    //we give how many results we have and divine it by the number od results per page
    //to round it to te celing(ex. 4.6 => 5) we use Math.ceil()
    const pages = Math.ceil(numResults / resPerPage);
    let button;
    if (page === 1 && pages > 1) {
        //button to go to next page
        button = createButton(page, 'next');
    } else if (page < pages) { //Middel pages
        //Both buttons
        button = `
            ${button = createButton(page, 'prev')}
            ${button = createButton(page, 'next')}
        
        `
    } else if (page === pages && pages > 1){ //Last page
        //only button to go to prev page
        button = createButton(page, 'prev');
    }
    //Adding page buttons 
    elements.searcgResPages.insertAdjacentHTML('afterbegin', button);
};

//It will recive all recipies (array)
// now we will pass to the funtion  a page which we want to display and how many result pef page
export const renderResults = (recipes, page = 1, resPerPage = 10) => {
    //for example on page nr 1 we will start at 0 (1 - 1) * 10 = 0 on page nr 2 we will start at 10 = (2 - 1) * 10 = 10
    const start = (page - 1) * resPerPage;
    const end = page * resPerPage
    //We need to loop throught them in order to then print them to the UI
    //slice method will cut the array and i has to paramets from wher it shold start and wher it sould
    recipes.slice(start, end).forEach(renderRecipe);
    //caling render buttons method to insert html 
    renderButtons(page, recipes.length, resPerPage);

};