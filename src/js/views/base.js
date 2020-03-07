export const elements = {
    //Search button/form
    searchForm: document.querySelector('.search'),
    //Input field
    searchInput: document.querySelector('.search__field'),
    //Result list on the leftside side
    searchResList: document.querySelector('.results__list'),
    //space for an arrow
    searchRes: document.querySelector('.results'),
    //button html space
    searcgResPages: document.querySelector('.results__pages'),
    //Recipe html in the middel
    recipe: document.querySelector('.recipe'),
    //Shopping list html on the right side of page
    shopping: document.querySelector('.shopping__list'),
    //Likes button on the right corner
    likesMenu: document.querySelector('.likes__field'),
    //Likes list on the right corner
    likesList: document.querySelector('.likes__list'),

};

export const elementStrings = {
    loader: 'loader'
}

// function which we will reuse in diffrent mmodules
// It will render a circual arrow when we will wait for data from API
// parent will be something like document.queryselector
export const renderLoader = (parent) => {
    const loader = `
        <div class="${elementStrings.loader}">
            <svg>
                <use href="img/icons.svg#icon-cw"></use>
            </svg>
        </div>
    `;
    parent.insertAdjacentHTML('afterbegin', loader);
};

// method to clear an arrow when the data is already send
export const clearLoader = () => {
    const loader = document.querySelector(`.${elementStrings.loader}`);
    //if we want to delete from the DOM we need to move to the parent element and the delete the child
    if (loader) loader.parentElement.removeChild(loader);
};