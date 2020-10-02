//BUDGET CONTROLLER
var budgetController = (function () {

    var Expense = function (id, description, value) {
        this.id = id;
        this.description = description;
        this.value = value;
    };

    var Income = function (id, description, value) {
        this.id = id;
        this.description = description;
        this.value = value;
    }

    var data = {
        allItems: {
            exp: [],
            inc: []
        },
        totals: {
            exp: 0,
            inc: 0
        }
    };
})();

//UI CONTROLLER
var UIController = (function () {
    // This is where you will search for the data 
    var DOMstrings = {
        inputType: '.addType',
        inputDescriptions: '.description',
        inputValue: '.value',
        inputBtn: '.addBtn',
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
    // setting up event listeners
    // making the code more organized 

    var setupEventListeners = function () {
        var DOM = UICtrl.getDOMstrings(); // DON'T FORGET TO CALL THE FUNCTION 

        document.querySelector(DOM.inputBtn).addEventListener('click', ctrlAddItem);

        document.addEventListener('keypress', function (event) {
            if (event.keycode === 13 || event.which === 13) {
                ctrlAddItem()
            }
        });
    };

    var ctrlAddItem = function () {

        // 1. Get input Data
        var input = UICtrl.getInput();
        // 2. add the item to the budget controller 

        // 3.add the item to the UI

        // 4. Calculate the budget 

        // 5. Display the budget on the UI 
    }

    return {
        init: function () {
            console.log('Application has started')
            setupEventListeners();
        }
    };
})(budgetController, UIController);

controller.init();