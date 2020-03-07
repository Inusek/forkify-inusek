export default class Likes {
    constructor() {
        this.likes = [];
    }

    addLike(id, title, author, image) {
        const like = { id, title, author, image};
        this.likes.push(like);
        
        // Perist Data in localStorage
        this.persistData();
        return like;
    }

    deleteLike(id) {
        const index = this.likes.findIndex(el => el.id === id);
        this.likes.splice(index, 1);
        // Perist Data in localStorage
        this.persistData();

    }
    
    isLiked(id) {
        //returns true if it is already liked false if not
        return this.likes.findIndex(el => el.id === id) !== -1
    }

    getNumLikes() {
        return this.likes.length;
    }

    persistData() {
        //To save a data we use it
        //first paramets is like an id
        //second is data which we want to store
        //both of them need to be strings
        //thats why we change a object to string by JSON
        //later if we would like to use it we will need to change it back
        localStorage.setItem('likes', JSON.stringify(this.likes));
    }

    readStorage() {
        //now we convert our likes string in to array from localStorage
        const storage = JSON.parse(localStorage.getItem('likes'));
        // Restore likes from localStorage
        if (storage) this.likes = storage
    }
}