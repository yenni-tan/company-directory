const searchContainer = $('.search-container');
const gallery = $('#gallery');
let people = new Array(); 

/**
 * Configure modal template and append to body.
 * Allow user to close modal by pressing close button. 
 */
function configureModal(person) {
    const modal = 
        `<div class="modal-container">
            <div class="modal">
                <button type="button" id="modal-close-btn" class="modal-close-btn"><strong>X</strong></button>
                <div class="modal-info-container">
                    <img class="modal-img" src="${person.picture.thumbnail}" alt="profile picture">
                    <h3 id="name" class="modal-name cap">${person.name.first} ${person.name.last}</h3>
                    <p class="modal-text">${person.email}</p>
                    <p class="modal-text cap">${person.location.city}</p>
                    <hr>
                    <p class="modal-text">${person.cell}</p>
                    <p class="modal-text">${person.location.street}, ${person.location.city}, ${person.location.state} ${person.location.postcode}</p>
                    <p class="modal-text">Birthday:  ${$.datepicker.formatDate('mm/dd/yy', new Date(person.birthday))}</p>
                </div>
            </div>

            <div class="modal-btn-container">
                <button type="button" id="modal-prev" class="modal-prev btn">Prev</button>
                <button type="button" id="modal-next" class="modal-next btn">Next</button>
            </div>
        </div>`;
    $('body').append(modal);
    $('.modal-close-btn').click(() => {
        $('.modal-container').remove();
    });
}

/**
 * Configure gallery item template with person data input and append to gallery.
 * Configure person data modal when gallery item is clicked.
 */
function configureGalleryItem(person) {
    const name = `${person.name.first}-${person.name.last}`;

    const id = `${name}-card`
    console.log(id);
    const item = `<div class="card" id="${id}">
        <div class="card-img-container">
            <img class="card-img" src="${person.picture.thumbnail}" alt="profile picture">
        </div>
        <div class="card-info-container">
            <h3 id="name" class="card-name cap">${name}</h3>
            <p class="card-text">${person.email}</p>
            <p class="card-text cap">${person.location.city}, ${person.location.state}</p>
        </div>
    </div>`;
    gallery.append(item);
    $(`#${id}`)
        .click(() => {
            configureModal(person);
        });
}

/**
 * Get 12 users from Random User API and orchestrate generating gallery.
 */
fetch('https://randomuser.me/api/?results=12&nat=us')
    .then(data => {
        return data.json();
    })
    .then((data) => {
        people = data.results;
        for (let index = 0; index < data.results.length; index++) {
            configureGalleryItem(data.results[index]);
        }
    });


