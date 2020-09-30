//BUDGET CONTROLLER
var budgetController = (function () {

})();

//UI CONTROLLER
var UIController = (function () {



})();

//GLOBAL CONTROLLER
var controller = (function (budgetCtrl, UICtrl) {


    var ctrlAddItem = function () {
        // 1. Get input Data  

        // 2. add the item to the budget controller 

        // 3.add the item to the UI

        // 4. Calculate the budget 

        // 5. Display the budget on the UI 
        console.log('it works');

    }

    document.querySelector('.addBtn').addEventListener('click', ctrlAddItem);

    document.addEventListener('keypress', function (event) {
        if (event.keycode === 13 || event.which === 13) {
            ctrlAddItem()
        }
    });

})(budgetController, UIController);