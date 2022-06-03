const todoList = document.querySelector(".todo-list")
const newTodo = document.getElementById("newTodo") //INPUT
const addTodo = document.getElementById("addTodo") //INPUT BUTTON
const selectBox = document.getElementById("selectFilter")
const doneTodos = document.getElementsByClassName("done")
const unDoneTodos = document.getElementsByClassName("unDone")
const todos = document.getElementsByClassName("todo-item-container")
const changeSelect = document.getElementById("changeSelect")


//ADD NEW TODO TO THE LIST
addTodo.addEventListener("click", e => {
    e.preventDefault()

    //CREATE NEW DIV
    let todoItemContainer = document.createElement("div")
    todoItemContainer.classList.add("todo-item-container")
    todoItemContainer.classList.add("unDone")

    //CREATE NEW CHECK BUTTON
    let checkButton = document.createElement("button")
    checkButton.classList.add("check")
    checkButton.innerHTML = '<i class="fa fa-check"></i>'
    todoItemContainer.appendChild(checkButton) //APPEND TO PARENT DIV

    //CREATE NEW TODO-ITEM
    let todoItem = document.createElement("li")
    todoItem.classList.add("todo-item")
    todoItem.innerText = newTodo.value
    todoItemContainer.appendChild(todoItem) //APPEND TO PARENT DIV

    //CREATE NEW DELETE BUTTON
    let deleteButton = document.createElement("button")
    deleteButton.classList.add("delete")
    deleteButton.innerHTML = '<i class="fa fa-close"></i>'
    todoItemContainer.appendChild(deleteButton); //APPEND TO PARENT DIV

    //APPEND NEW TODO TO TODO LIST
    todoList.appendChild(todoItemContainer);

    checkIfDone(); //CHECK IF TODO NEEDS TO BE HIDE
    saveToLocalStorage(todos);
    newTodo.value=""; //SET THE INPUT VALUE BACK TO EMPTY
})

//TODO DELETE & TODO CHECK 
todoList.addEventListener("click", e => {
    let target = e.target.parentNode;
    switch(target.classList[0]){
        case "delete": {
            target.parentNode.classList.add("deleteAnimation")
            target.parentNode.addEventListener("transitionend", function(){
                target.parentNode.remove();
            })
            //GET TODOS
            let myTodos;
            if(localStorage.getItem("myTodos") === null) myTodos = [];
            else myTodos = JSON.parse(localStorage.getItem("myTodos"));

            //REMOVE THE TODO FROM STORAGE WHEN REMOVING FROM UI
            for(todo of myTodos){
                if(target.parentNode.children[1].innerText == todo[0]){
                    todo.splice(0, 2)
                }
            }

            //REMOVE THE LEFTED EMPTY ARRAY FROM MYTODOS
            const fixedMyTodos = myTodos.filter(todo => {
                if(todo.length === 0) return false;
                else return true;
            })

            //SAVE BACK TO LOCAL STORAGE
            localStorage.setItem("myTodos", JSON.stringify(fixedMyTodos))
            break;
        }
        case "check": {
            //GET TODOS
            let myTodos;
            if(localStorage.getItem("myTodos") === null) myTodos = [];
            else myTodos = JSON.parse(localStorage.getItem("myTodos"));

            target.parentNode.children[1].classList.toggle("checkedItem");
            if(target.parentNode.classList.contains("unDone")) {
                target.parentNode.classList.replace("unDone", "done");
                for(todo of myTodos){
                    if(target.parentNode.children[1].innerText == todo[0]){
                        todo[1].checked = true;
                        localStorage.setItem("myTodos", JSON.stringify(myTodos));
                    }
                }
            }
            else {
                target.parentNode.classList.replace("done", "unDone");
                for(todo of myTodos){
                    if(target.parentNode.children[1].innerText == todo[0]){
                        todo[1].checked = false;
                        localStorage.setItem("myTodos", JSON.stringify(myTodos));
                    }
                }
            }
            checkIfDone()


            break;
        }
    }
})

//SET THE APPROPIATE FILTER
selectBox.addEventListener("change", checkIfDone)
function checkIfDone() {
    switch(selectBox.value){
        case "all":{
            for(i of doneTodos) i.style.display="flex";
            for(i of unDoneTodos) i.style.display="flex";
            break;
        }
        case "unDone":{
            for(i of doneTodos) i.style.display="none";
            for(i of unDoneTodos) i.style.display="flex";
            break;
        }
        case "done":{
            for(i of unDoneTodos) i.style.display="none";
            for(i of doneTodos) i.style.display="flex";
            break;
        }
    }
}

//SAVE TODOS TO LOCAL STORAGE
function saveToLocalStorage(allTodos) {
    let myTodos;
    
    //DO I HAVE TODOS IN STORAGE ALREADY ?
    if(localStorage.getItem("myTodos") === null) myTodos = [];
    else myTodos = JSON.parse(localStorage.getItem("myTodos"))
    
    //ITERATE OVER EACH TODO AND SAVE THE DATA TO STORAGE
    for(todo of allTodos){
        const data = []
        const todoText = todo.children[1].innerText;

    //--------------------------------------
        //CHECK IF TODO IS REPETITIVE
        let isTodoDuplicated;
        for(t of myTodos){
            if(todoText == t[0]){
                isTodoDuplicated = true;
                break;
            }
        // else isTodoDuplicated = false;
        }
        //IF TODO IS DUPLICATE BREAK THIS CYCLE
        if(isTodoDuplicated === true) continue;
//---------------------------------------

        let isChecked={checked:null}
        if(todo.classList.contains("done")) isChecked.checked = true;
        else isChecked.checked = false;
        data.push(todoText, isChecked)
        myTodos.push(data)
    }
    localStorage.setItem("myTodos", JSON.stringify(myTodos))
}

//LOAD SAVED TODOS WHEN DOCUMENT IS LOADED
document.addEventListener("DOMContentLoaded", function(e){
    e.preventDefault()
    let myTodos;
    
    //GET SAVED TODOS
    if(localStorage.getItem("myTodos") === null) myTodos = [];
    else myTodos = JSON.parse(localStorage.getItem("myTodos"));

    myTodos.forEach(todo => {

    //CREATE NEW DIV
    let todoItemContainer = document.createElement("div")
    todoItemContainer.classList.add("todo-item-container")
    if(todo[1].checked) todoItemContainer.classList.add("done");
    else todoItemContainer.classList.add("unDone");
    

    //CREATE NEW CHECK BUTTON
    let checkButton = document.createElement("button")
    checkButton.classList.add("check")
    checkButton.innerHTML = '<i class="fa fa-check"></i>'
    todoItemContainer.appendChild(checkButton)

    //CREATE NEW TODO-ITEM
    let todoItem = document.createElement("li")
    if(todo[1].checked) todoItem.classList.add("checkedItem");
    todoItem.classList.add("todo-item")
    todoItem.innerText = todo[0]
    todoItemContainer.appendChild(todoItem)

    //CREATE NEW DELETE BUTTON
    let deleteButton = document.createElement("button")
    deleteButton.classList.add("delete")
    deleteButton.innerHTML = '<i class="fa fa-close"></i>'
    todoItemContainer.appendChild(deleteButton)

    //APPEND NEW TODO TO TODO LIST
    todoList.appendChild(todoItemContainer)
    });

    //SET FILTER MODE BACK
    preferredFilter = localStorage.getItem("preferredFilter")
    switch(preferredFilter){
        case "all": {
            selectBox.children[0].setAttribute("selected", "selected")
            preferredFilter = "all"
            break;
        }

        case "done": {
            selectBox.children[1].setAttribute("selected", "selected")
            preferredFilter = "done"
            break;
        }
        
        case "unDone": {
            selectBox.children[2].setAttribute("selected", "selected")
            preferredFilter = "unDone"
            break;
        }
    }
    checkIfDone() //CHECK IF ANY TODO NEEDS TO BE HIDE
})
// localStorage.clear()

changeSelect.addEventListener("click", e => {
    changeSelect.children[0].innerText = "Done"
    setTimeout(() => {
        changeSelect.children[0].innerText = "Set Defalut"
    }, 1700);
    let preferredFilter;
    for(opt of selectBox.children) {
        if(opt.hasAttribute("selected")) opt.removeAttribute("selected");
    }
    switch(selectBox.value){
        case "all": {
            selectBox.children[0].setAttribute("selected", "selected")
            preferredFilter = "all"
            break;
        }

        case "done": {
            selectBox.children[1].setAttribute("selected", "selected")
            preferredFilter = "done"
            break;
        }

        case "unDone": {
            selectBox.children[2].setAttribute("selected", "selected")
            preferredFilter = "unDone"
            break;
        }
    }
    localStorage.setItem("preferredFilter", preferredFilter)

})