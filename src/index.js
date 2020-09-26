import $ from 'jquery';

import './index.css';


import store from './store'
import bookmarks from './bookmarks';
import api from './api';

function main() {
    api.getBookmarks()
        .then(data => {
            data.forEach(bm => store.addBookmark(bm));
            bookmarks.render();
        });

    bookmarks.bindEventListeners();    
}

$(main);