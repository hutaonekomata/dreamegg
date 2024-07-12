const open_add_URLButton = document.getElementById("open_add_URL");
//const open_change_URLButton = document.getElementById("open_change_URL");
const close_add_URLButton = document.getElementById("close_add_URL");
//const close_change_URLButton = document.getElementById("close_change_URL");
//const closePopupButton = document.getElementsByClassName("closePopup");
const overlay = document.getElementById("overlay");
const add_URL_popup = document.getElementById("add_URL_popup");
const change_URL_popup = document.getElementById("change_URL_popup");
const submit_add_URLButton = document.getElementById("add_URL_submit");
//const submit_change_URLButton = document.getElementById("change_URL_submit");
const add_URL_input = document.getElementById("add_URL_input");
const add_category_input = document.getElementById("add_category_input");
const add_tag_input = document.getElementById("add_tag_input");
const change_URL_input = document.getElementById("change_URL_input");
const URL_name_input = document.getElementById("URL_name_input");

open_add_URLButton.addEventListener("click", (event) => {
    event.preventDefault();
    overlay.style.display = "block";
    add_URL_popup.style.display = "block";
});
/*
open_change_URLButton.addEventListener("click", (event) => {
    event.preventDefault();
    overlay.style.display = "block";
    change_URL_popup.style.display = "block";
});*/

close_add_URLButton.addEventListener("click", (event) => {
    event.preventDefault();
    overlay.style.display = "none";
    add_URL_popup.style.display = "none";
    //change_URL_popup.style.display = "none";
});
/*
close_change_URLButton.addEventListener("click", (event) => {
    event.preventDefault();
    overlay.style.display = "none";
    //add_URL_popup.style.display = "none";
    change_URL_popup.style.display = "none";
});*/

overlay.addEventListener("click", (event) => {
    event.preventDefault();
    overlay.style.display = "none";
    add_URL_popup.style.display = "none";
    //change_URL_popup.style.display = "none";
});

submit_add_URLButton.addEventListener("click", (event) => {
    event.preventDefault();
    console.log("URLname:"+URL_name_input.value);
    console.log("URL:"+add_URL_input.value);
    //let URL_list={name:URL_name_input.value,data:add_URL_input.value,tag:add_tag_input.value};
    let URL_list=[add_URL_input.value,URL_name_input.value,add_tag_input.value];
    /*
    if(localStorage.hasOwnProperty("kategori")){
        URL_list=JSON.parse(localStorage.getItem("kategori"));
    }
    URL_list.push([URL_name_input.value,add_URL_input.value]);
    localStorage.setItem("kategori", JSON.stringify(URL_list));
    */
    localStorage.setItem(add_category_input.value+"_"+URL_name_input.value,JSON.stringify(URL_list))
    overlay.style.display = "none";
    add_URL_popup.style.display = "none";
    URL_name_input.value ="";
    add_URL_input.value ="";
});

/*
submit_change_URLButton.addEventListener("click", (event) => {
    event.preventDefault();
    console.log("URL:"+change_URL_input.value);
    overlay.style.display = "none";
    change_URL_popup.style.display = "none";
    change_URL_input.value ="";
});*/
