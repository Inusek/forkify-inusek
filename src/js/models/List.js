// UniqueID will always create unique id's based on the current time, process and machine name
import uniqid from 'uniqid';

export default class List {
    constructor() {
        // We dont need to pass anything to the class
        // All we need to say that we have empty item Array
        this.items = [];
    }

    addItem (count, unit, ingredient) {
        const item = {
            //using UniqueID
            id: uniqid(),
            count,
            unit,
            ingredient
        }
        //created item(object) we need to push it to the array
        this.items.push(item);
        return item;
    }

    //When we want to delete an item from our shopping list
    //we need to pass an ID
    deleteItem(id) {
        //we pass an id to the findIndex and try to find id in array which is the same as we want
        const index = this.items.findIndex(el => el.id === id);
        // [2, 4, 8] splice(1, 1) -> returns 4, and mutates orginal array which is now [2, 8]
        // first argument is whem it should start, the second is how many elemets is should delete
        this.items.splice(index, 1);
    }

    //update count of ingrediants in the shopping list
    updateCount(id, newCount) {
        //we want to find an item inself we use find()
        this.items.find(el => el.id === id).count = newCount
    }
}