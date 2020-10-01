//BUDGET CONTROLLER
var budgetController = (function () {

})();

//UI CONTROLLER
var UIController = (function () {
    // This is where you will search for the data 
    var DOMstrings = {
        inputType: '.addType',
        inputDescriptions: '.description',
        inputValue: '.value',
        inputBtn: '.addBtn'
    }

    return {
        getInput: function () {
            return {
                // returning a object so you have access to the properties instead of variables
                type: document.querySelector(DOMstrings.inputType).value, // will be either inc or exp 
                description: document.querySelector(DOMstrings.inputDescriptions).value,
                value: document.querySelector(DOMstrings.inputValue).value
            };
        },
        //this DOMstrings is now public 
        getDOMstrings: function () {
            return DOMstrings;
        }

    };


})();

//GLOBAL CONTROLLER
var controller = (function (budgetCtrl, UICtrl) {

    var DOM = UICtrl.getDOMstrings(); // DON'T FORGET TO CALL THE FUNCTION 

    var ctrlAddItem = function () {
        // 1. Get input Data
        var input = UICtrl.getInput();
        console.log(input);

        // 2. add the item to the budget controller 

        // 3.add the item to the UI

        // 4. Calculate the budget 

        // 5. Display the budget on the UI 
        console.log('it works');

    }

    document.querySelector(DOM.inputBtn).addEventListener('click', ctrlAddItem);

    document.addEventListener('keypress', function (event) {
        if (event.keycode === 13 || event.which === 13) {
            ctrlAddItem()
        }
    });

})(budgetController, UIController);