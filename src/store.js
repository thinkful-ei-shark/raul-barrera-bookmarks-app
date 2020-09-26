import $ from 'jquery';

const bookmarks = [];
const status = {
    error: null,
    filter: 1
}

const filteredBookmarks = function(){
    return this.bookmarks.filter(bm => bm.rating >= status.filter);
}

const findById = function(id){
    return this.bookmarks.find(bm => bm.id === id);
}

const addBookmark = function(bm){
    bm.expanded = false;
    this.bookmarks.push(bm);
}

const findAndDelete = function(id){
   this.bookmarks = this.bookmarks.filter(bm => bm.id !== id);
}

const findAndUpdate = function(id, newData){
    let bm = this.items.find(bm => bm.id === id);
    Object.assign(bm, newData);
}

const setError = function(error){
    this.status.error = error;
}

export default {
    bookmarks,
    status,
    findById,
    addBookmark,
    findAndUpdate,
    setError,
    findAndDelete,
    filteredBookmarks
}