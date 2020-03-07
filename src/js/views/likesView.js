//Import names from base
import { elements } from './base';//
//Import method to short title
import { limitRecipeTilte } from './searchView';

//we pass true or false from isLiked method
export const toggleLikeBtn = isLiked => {
    // img/icons.svg#icon-heart-outlined
    //outline is not liked, without it is liked
    const iconString = isLiked ? 'icon-heart' : 'icon-heart-outlined';
    //We select the element where the icon is located
    //We set href atribute to iconString
    document.querySelector('.recipe__love use').setAttribute('href', `img/icons.svg#${iconString}`);
};

export const toggleLikeMenu = numLikes => {
    //we use css style method to change if the button is visable or not
    elements.likesMenu.style.visibility = numLikes > 0 ? 'visible' : 'hidden';
};

export const renderLike = like => {
        const markup = `
    <li>
        <a class="likes__link" href="#${like.id}">
            <figure class="likes__fig">
                <img src="${like.image}" alt="${like.title}">
            </figure>
            <div class="likes__data">
                <h4 class="likes__name">${limitRecipeTilte(like.title)}</h4>
                <p class="likes__author">${like.author}</p>
            </div>
        </a>
    </li>    
    `;
    elements.likesList.insertAdjacentHTML('beforeend', markup)
};

export const deleteLike = id => {
    const el = document.querySelector(`.likes__link[href="#${id}"]`).parentElement;
    if (el) el.parentElement.removeChild(el); 
}


















