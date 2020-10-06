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

    return {
        addItem: function (type, des, val) {
            var newItem, ID;

            // Create new ID 
            if (data.allItems[type].length > 0) {
                ID = data.allItems[type][data.allItems[type].length - 1].id + 1;
            } else {
                ID = 0;
            }



            // Creates new new item assign with new ID des a val 
            if (type === 'exp') {
                newItem = new Expense(ID, des, val);
            } else if (type === 'inc') {
                newItem = new Income(ID, des, val);
            }
            // the type is th same name as the array item 
            // it will know where to push the data to
            data.allItems[type].push(newItem);

            return newItem;
        },

        testing: function () {
            console.log(data);
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
        incomeContainer: '.incomeList',
        expenseContainer: '.expensesList'
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

        addListItem: function (obj, type) {
            var html, newHtml, element;

            // create html string with placeholder 
            if (type === 'inc') {
                element = DOMstrings.incomeContainer;
                html = '<div class="item" id="income-%id%"><div class="itemDescription">%description%</div><div class="itemValue">+ %value%</div><div class="itemDelete"><button class="itemDeleteBtn"><i class="fas fa-trash-alt"></i></button></div></div>';
            } else if (type === 'exp') {
                element = DOMstrings.expenseContainer;
                html = '<div class="item" id="expense-%id%"><div class="itemDescription">%description%</div><div class="itemValue">- %value%</div><div class="itemPercentage">21%</div><div class="itemDelete"><button class="itemDeleteBtn"><i class="fas fa-trash-alt"></i></button></div></div>';
            }
            //replace the placeholder text with acutal data
            newHtml = html.replace('%id%', obj.id);
            newHtml = newHtml.replace('%description%', obj.description);
            newHtml = newHtml.replace('%value%', obj.value);

            //insert the html into DOM
            document.querySelector(element).insertAdjacentHTML('beforeend', newHtml);
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
        var input, newItem;

        // 1. Get input Data
        input = UICtrl.getInput();

        // 2. add the item to the budget controller 
        newItem = budgetCtrl.addItem(input.type, input.description, input.value);

        // 3.add the item to the UI
        UICtrl.addListItem(newItem, input.type)


        // 4. Calculate the budget 

        // 5. Display the budget on the UI 
    }
    console.log('it works');

    return {
        init: function () {
            console.log('Application has started')
            setupEventListeners();
        }
    };
})(budgetController, UIController);

controller.init();