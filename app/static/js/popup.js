function showPopup(button_id) {

    if (button_id == "add") {
        items = document.getElementById("popup-add");
        items.style.display = "flex";

        items = document.getElementById("popup-edit-link");
        items.style.display = "none";
    }
    else if (button_id == "edit-link") {
        items = document.getElementById("popup-edit-link");
        items.style.display = "flex";

        items = document.getElementById("popup-add");
        items.style.display = "none";
    }

}

function clearPopup(button_id) {
    items = document.getElementById("popup-add");
    items.style.display = "none";
    items = document.getElementById("popup-edit-link");
    items.style.display = "none";
}