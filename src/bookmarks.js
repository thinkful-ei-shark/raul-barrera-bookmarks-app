import $ from 'jquery';
import api from './api';
import store from './store';

const generateError = function (message) {
    return `
        <div class="error-display${!store.status.error ? ' hidden':''}">
            <p>${message}</p>  
            <button id="close-error">Okay</button> 
        </div>
        ${generateAddView()}
    `;
  };
  
  const renderError = function () {
    if(store.status.error){
      const el = generateError(store.status.error);
      $('main').html(el);
    }else{
      $('main').html(generateAddView());
    }
  };
  
  const handleCloseError = function(){
    $('main').on('click', '#close-error', () => {
      store.setError(null);
      renderError();
    });
  };

const generateBookmarkElement = function(bm){
    let rating = ''
    for(let i = 0; i<5; i++){
        if(bm.rating !== undefined && i<parseInt(bm.rating)){
            rating += `<label class="fill">&#9733;</label>`;
        } else {
            rating += `<label class="no-fill">&#9733;</label>`;
        }
    } 

    let el;
    if(bm.expanded){
        el = `
        <div class="bookmark"><span>${bm.title}</span><button id="delete">&#128465; Delete</button></div>
        <div class="sub-header"><button href="${bm.url}" id="visit">Visit Site</button><span>Rating: ${bm.rating}</span></div>
        <p class="desc">${bm.desc? bm.desc: 'No description available.'}</p>
        `;
    } else {
        el = `<div class="bookmark"><span class="title">${bm.title}</span><span class="rating">${rating}</span></div>`;
    }


    return `
    <div class="js-bookmark" id="${bm.id}">
        ${el}
    </div>`
};

const generateBookmarksString = function(bmList){
    const bookmarks = bmList.map(bm => generateBookmarkElement(bm));
    return `
        <div>
            <h2>My Bookmarks</h2>
            <div id="btns-container">
                <button id="new">&#10010; New</button>
                <select name="rating" id="rating">
                    <option value="">Filter By</options>
                    <option value="1">(1 Star) &#9733;</option>
                    <option value="2">(2 Stars) &#9733; &#9733;</option>
                    <option value="3">(3 Stars) &#9733; &#9733; &#9733;</option>
                    <option value="4">(4 Stars) &#9733; &#9733; &#9733; &#9733;</option>
                    <option value="5">(5 Stars) &#9733; &#9733; &#9733; &#9733; &#9733;</option> 
                </select>
            </div>
            ${bookmarks.join('')}
        </div>
    `;
}

const handleFilter = function(){
    $('main').on('click', 'select', function(){
        let rating = $('select').val();
        if(rating){
            store.status.filter = rating;
            render();
        }
    })
}

const generateAddView = function(){
    return `
    <form>
        <h2>My Bookmarks</h2>
        <label for="url">Add New Bookmark:</label>
        <input type="text" id="url" placeholder="https://www.example.com" required>
        <label for="title">Enter name of Bookmark:</label>
        <input type="text" id="title" placeholder="Name" required>

        <div id="rating">
            <input type="radio" id="1-star" class="fill" name="rating" value="1" checked="checked" required>
            <label for="1-star" class="fill">&#9733;</label>
            <input type="radio" id="2-star" class="no-fill" name="rating" value="2">
            <label for="2-star" class="no-fill">&#9733;</label>
            <input type="radio" id="3-star" class="no-fill" name="rating" value="3">
            <label for="3-star" class="no-fill">&#9733;</label>
            <input type="radio" id="4-star" class="no-fill" name="rating" value="4">
            <label for="4-star" class="no-fill">&#9733;</label>
            <input type="radio" id="5-star" class="no-fill" name="rating" value="5">
            <label for="5-star" class="no-fill">&#9733;</label>
        </div>
        
        <textarea id="desc" placeholder="Add a description (optional)" rows="10"></textarea>                
        

        <div class="new-form-btns">
            <button type="reset">Cancel</button>
            <button type="submit">Create</button>
        </div>

    </form>
    `
}

const handleVisitClick = function() {
    $('main').on('click', '#visit', function(e){
        window.open($(e.currentTarget).attr('href'));
    });
}

const render = function() {    
    let bookmarks = store.filteredBookmarks();

    const bookmarksString = generateBookmarksString(bookmarks);

    $('main').html(bookmarksString);
}

const handleRatingSelected = function(){
    $('main').on('click', 'input[name="rating"]', function(){
        $(this).prevAll('label').addClass("fill").removeClass("no-fill");
        $(this).nextAll('label').addClass("no-fill").removeClass("fill");
        $(this).next('label').addClass('fill').removeClass('no-fill');
    })
}

const handleBookmarkClick = function() {
    $('main').on('click', '.js-bookmark', function(e) {
        let id = $(e.currentTarget).attr('id');
        let bm = store.findById(id);
        bm.expanded = !bm.expanded;
        render();
    })
};

function handleCreate(){
    $('main').on('submit', function(e){
        e.preventDefault();
        const title =  $('#title').val();
        const url = $('#url').val();
        const rating = $('input[name="rating"]:checked').val();
        const desc = $('#desc').val();
        const bm = {'title':title, 'url':url, 'rating':rating, 'desc':desc};
        api.createBookmark(bm)
            .then(data=> {
                store.addBookmark(data);
                render();
            })
            .catch((error) => {
                console.log(error);
                store.setError(error.message);
                renderError();
            });
    });
};

function handleNew(){
    $('main').on('click', '#new', function(){
        renderError();
    });
};

function handleCancel(){
    $('main').on('reset', function(e){
        e.preventDefault();
        render();
    })
}

function handleDelete(){
    $('main').on('click', '#delete', function(e){
        const el = $(e.currentTarget).closest('.js-bookmark');
        const id = $(el).attr('id');
        api.deleteBookmark(id)
        .then(() => {
            store.findAndDelete(id);
            render();
        })
        .catch((error) => {
            console.log(error);
            store.setError(error.message);
            renderError();
        });
    })
}

const handleEditBm = function(){

}

const bindEventListeners = function(){
    handleBookmarkClick();
    handleCreate();
    handleDelete();
    handleEditBm();
    handleCancel();
    handleNew();
    handleRatingSelected();
    handleFilter();
    handleCloseError();
    handleVisitClick();
}

export default {
    render,
    bindEventListeners
};