const searchContainer = $('.search-container');
const gallery = $('#gallery');
let people = new Array(); 
let modals = [];

/**
 * Show/hide gallery item based on search input. If first and last name contain search input, display gallery item.
 */
function handleSearch() {
    const searchInput = $('#search-input')[0].value;
    people.forEach(person => {
        const name = `#${person.name.first}-${person.name.last}-card`;
        $(name).css('display', '');
        if (!(person.name.first + ' ' + person.name.last).includes(searchInput)) {
            $(name).css('display', 'none');
        }
    });
}

/**
 * Set up search filter.
 */
const search = `<form action="#" method="get">
<input type="search" id="search-input" class="search-input" placeholder="Search...">
</form>`;
$('.search-container').append(search);

$('.search-input').keyup(() => {
    handleSearch();
})

/**
 * Configure modal template and append to body.
 * Allow user to close modal by pressing close button. 
 */
function configureModal(person, index) {
    const modalContainerId = `#modal-container-${person.name.first}-${person.name.last}`;
    if ($(modalContainerId).length) {
        $(modalContainerId).show();
    } else {
        // Cache modals ids that are created
        modals.push({index, id: modalContainerId});
        const modal = 
            `<div class="modal-container" id="modal-container-${person.name.first}-${person.name.last}">
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
                        <p class="modal-text">Birthday:  ${$.datepicker.formatDate('mm/dd/yy', new Date(person.dob.date))}</p>
                    </div>
                </div>

                <div class="modal-btn-container">
                    <button type="button" id="modal-prev-${person.name.first}-${person.name.last}" class="modal-prev btn">Prev</button>
                    <button type="button" id="modal-next-${person.name.first}-${person.name.last}" class="modal-next btn">Next</button>
                </div>
            </div>`;
        $('body').append(modal);
        $('.modal-close-btn').click(() => {
            $(modalContainerId).hide();
        });

        /**
         * Hide current gallery item. 
         * If modal isn't configured for previous gallery item, configure it. 
         * Show modal for previous gallery item.
         */
        $(`#modal-prev-${person.name.first}-${person.name.last}`).click(() => {
            $(modalContainerId).hide();
            let prevIndex;
            if (index === 0) {
                prevIndex = people.length - 1;
                if (!modals.filter(item => item.index === prevIndex).length) {
                    configureModal(people[prevIndex], prevIndex);
                }
                $(modals.filter(item => item.index === prevIndex)[0].id).show();
            } else {
                prevIndex = index - 1 ;
                if (!modals.filter(item => item.index === prevIndex).length) {
                    configureModal(people[prevIndex], prevIndex);
                } 
                $(modals.filter(item => item.index === prevIndex)[0].id).show();
            }
        });

        /**
         * Hide current gallery item. 
         * If modal isn't configured for next gallery item, configure it. 
         * Show modal for next gallery item.
         */
        $(`#modal-next-${person.name.first}-${person.name.last}`).click(() => {
            $(modalContainerId).hide();
            let nextIndex;
            if (index === people.length - 1) {
                nextIndex = 0;
                if (!modals.filter(item => item.index === nextIndex).length) {
                    configureModal(people[nextIndex], nextIndex);
                }
                $(modals.filter(item => item.index === nextIndex)[0].id).show();
            } else {
                nextIndex = index + 1;
                if (!modals.filter(item => item.index === nextIndex).length) {
                    configureModal(people[nextIndex], nextIndex);
                } 
                $(modals.filter(item => item.index === nextIndex)[0].id).show();
            }
        });
    }
}

/**
 * Configure gallery item template with person data input and append to gallery.
 * Configure person data modal when gallery item is clicked.
 */
function configureGalleryItem(person, index) {
    const name = `${person.name.first}-${person.name.last}`;

    const id = `${name}-card`
    const item = 
        `<div class="card" id="${id}">
            <div class="card-info-container">
                <h3 id="name" class="card-name cap">${name}</h3>
                <p class="card-text">${person.email}</p>
                <p class="card-text cap">${person.location.city}, ${person.location.state}</p>
            </div>
            <div class="card-img-container">
                <img class="card-img" src="${person.picture.thumbnail}" alt="profile picture">
            </div>
        </div>`;
    gallery.append(item);
    $(`#${id}`)
        .click(() => {
            configureModal(person, index);
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
            configureGalleryItem(data.results[index], index);
        }
    });


