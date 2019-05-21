const modal = document.querySelector('.simple-modal');
const go = document.querySelector("#btn-go");
const close = document.querySelector("#close-btn");
const player1 = document.querySelector(".player-input1");

go.addEventListener("click", closeModal);

function closeModal(){
    if(player1.value === ""){
        alert("Error: empty Field");
    }
    else{
        modal.style.display = "none";
    }
}