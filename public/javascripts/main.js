var addForm = document.querySelector('#addForm');
var fetchButton = document.querySelector('#fetchButton');
var ulFetchedItems = document.querySelector('#fetchedItems');

// Configure Add Shopping Item event listener
addForm.addEventListener('submit', (event) => {
    event.preventDefault();
    fetch('/shopping/shoppingitem', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
        },
        body: JSON.stringify(
            {
                name: document.querySelector('#name').value,
            }
        )
    })
        .then((response) => {
            return response.json();
        })
        .then((data) => {
            if (data.error) {
                alert('Error: ' + data.error);
            }
            else {
                updateItemsList(data);
            }
        });
});

fetchButton.addEventListener('click', fetchItems);

function fetchItems() {
    fetch('/shopping/fetchItems')
        .then(function (response) {
            return response.json()
        })
        .then(function (data) {
            updateItemsList(data);
        });
};

function updateItemsList(data) {
    // Remove old items from list
    var child = ulFetchedItems.lastElementChild;
    while (child) {
        ulFetchedItems.removeChild(child);
        child = ulFetchedItems.lastElementChild;
    }
    // Add new items to list
    var items = data;
    for (var i = 0; i < items.length; i++) {
        let item = items[i];

        // Add list item for the current item
        let li = document.createElement('li');
        ulFetchedItems.appendChild(li);

        // Add item text box
        let itemText = document.createElement('input');
        itemText.type = 'text';
        itemText.value = items[i].name;
        itemText.addEventListener('keyup', () => {
            itemText.nextSibling.disabled = itemText.value === item.name ? true : false;
        });
        li.appendChild(itemText);

        // Add item update button
        let updateButton = document.createElement('button');
        updateButton.textContent = 'Update';
        updateButton.disabled = true;
        updateButton.addEventListener('click', () => {
            item.name = itemText.value;
            updateItem(item);
        });
        li.appendChild(updateButton);

        // Add pick button
        let pickButton = document.createElement('button');
        pickButton.textContent = items[i].picked ? 'Unpick' : 'Pick';
        pickButton.addEventListener('click', () => {
            item.picked = !item.picked;
            updateItem(item);
        });
        li.appendChild(pickButton);

        function updateItem(item) {
            fetch('/shopping/shoppingitem/' + item._id + '/update',
                {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(item),
                }
            )
                .then((response) => {
                    return response.json();
                })
                .then((data) => {
                    console.log(JSON.stringify(data));
                    updateItemsList(data);
                });
        }

        // Add delete button
        let deleteButton = document.createElement('button');
        deleteButton.textContent = 'Delete';
        deleteButton.addEventListener('click', () => {
            fetch('/shopping/shoppingitem/' + item._id + '/delete',
                {
                    method: 'DELETE',
                }
            )
                .then((response) => {
                    return response.json();
                })
                .then((data) => {
                    updateItemsList(data);
                });
        });
        li.appendChild(deleteButton);
    };
};

fetchItems();