import $ from 'jquery';

const URL='https://thinkful-list-api.herokuapp.com/raul/bookmarks';

const apiFetch = function(...args ){
    let error;
    return fetch(...args)
        .then(res => {
            if(!res.ok){
                error = {code:res.status};
            
                if(!res.headers.get('content-type').includes('json')){
                    error.message = res.statusText;
                    return Promise.reject(error);
                }
            }

            return res.json();
        })
        .then(data => {
            if(error){
                error.message = data.message;
                return Promise.reject(error);
            }
            return data;
        });
}

const getBookmarks = function(){
    return apiFetch(URL);
}

const createBookmark = function(bm){
    return apiFetch(URL, { 
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(bm)
    });
}

const deleteBookmark = function(id){
    return apiFetch(`${URL}/${id}`, {
        method: "DELETE",
    });
}

const updateBookmark = function(id, newData){
    return apiFetch(URL, { 
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(newData)
    });
}

export default {
    getBookmarks,
    createBookmark,
    deleteBookmark,
    updateBookmark
};