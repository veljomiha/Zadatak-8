var addACard = document.querySelectorAll(".add-card");
var cardForm = document.getElementById("card-form");
var closeX = document.querySelectorAll(".close");
var btnAdd = document.querySelectorAll(".btn-add");
var inputAddCard = document.getElementById("input-add-card");
const allColumn = document.querySelectorAll(".column");
var createColumn = document.getElementById("create");
var columns = document.getElementById("columns");
const data = [];


addACard.forEach(button => {
    button.addEventListener("click", (event) => {
        const listContainer = event.target.parentElement;
        cardForm.style.display = "block";
        listContainer.appendChild(cardForm);
        inputAddCard.value = "";
    })
})

closeX.forEach(button => {
    button.addEventListener("click", (event) => {
        const listContainer = event.target.parentElement.parentElement.parentElement;
        listContainer.querySelector("#card-form").style.display = "none";
    })
})

btnAdd.forEach(button => {
    button.addEventListener("click", (event) => {
        const listContainer = event.target.parentElement.parentElement.parentElement;
        var e = document.createElement('div');
        e.className = "card";
        e.draggable = true;
        e.innerHTML = inputAddCard.value;
        if (e.innerHTML != "") {
            listContainer.appendChild(e);
            cardForm.style.display = "none";
            dataForLocalStorage();
        }
        else {
            cardForm.style.display = "block";
        }
        var x = document.createElement('div');
        x.className = "deleteCard";
        x.draggable = true;
        x.src = "icon-close-menu.svg";
        e.appendChild(x);

        forDeleteCard();
        dragNDrop();
    })
})

function forDeleteCard() {
    var deleteCard = document.querySelectorAll(".deleteCard");
    deleteCard.forEach(button => {
        button.addEventListener("click", (event) => {
            const listContainer = event.target.parentElement;
            listContainer.remove();
            dataForLocalStorage();
        })
    })
}

function dragNDrop() {
    const cards = document.querySelectorAll('.card')

    cards.forEach(card => {
        card.addEventListener('dragstart', () => {
            card.classList.add('dragging');
        })

        card.addEventListener('dragend', () => {
            card.classList.remove('dragging');
        })
    })

    allColumn.forEach(column => {
        column.addEventListener('dragover', e => {
            e.preventDefault();
            const afterElement = getDragAfterElement(column, e.clientY);
            const card = document.querySelector('.dragging');
            if (afterElement == null) {
                column.appendChild(card);

            } else {
                column.insertBefore(card, afterElement);
            }
            dataForLocalStorage();
        })
    })

    function getDragAfterElement(column, y) {
        const draggableElements = [...column.querySelectorAll('.card:not(.dragging)')]
        return draggableElements.reduce((closest, child) => {
            const box = child.getBoundingClientRect();
            const offset = y - box.top - box.height / 2
            if (offset < 0 && offset > closest.offset) {
                return { offset: offset, element: child }
            } else {
                return closest;
            }
        }, { offset: Number.NEGATIVE_INFINITY }).element;
    }
}

function dataForLocalStorage() {
    data.length = 0;
    const allColumn = document.querySelectorAll(".column");

    allColumn.forEach((column, index) => {
        const title = column.querySelector(".title").textContent;
        const cardItems = column.querySelectorAll(".card");
        const cardItemsContent = [];

        cardItems.forEach((item) => {
            return cardItemsContent.push(item.textContent);
        });
        data.push({ index: index, title: title, items: cardItemsContent });
    });
    localStorage.setItem("data", JSON.stringify(data));
}

window.addEventListener("load", function () {
    const dataFromStorage = localStorage.getItem("data");
    console.log(dataFromStorage);
    const parsedData = JSON.parse(dataFromStorage);
    const columns = document.querySelectorAll(".column");

    parsedData.forEach((column, index) => {
        const currAddACard = columns.item(index).querySelector(".add-card");
        column.items.forEach(item => {
            const itemDiv = document.createElement("div");
            itemDiv.innerHTML = `<div class="card" draggable="true">${item}<div class="deleteCard"></div></div>`;
            columns.item(index).insertBefore(itemDiv, currAddACard);
        })
        forDeleteCard();
        dragNDrop();
    })
})