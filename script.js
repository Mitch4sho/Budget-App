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
    };

    var calculateTotal = function (type) {
        var sum = 0;
        data.allItems[type].forEach(function (cur) {
            sum += cur.value
        });
        data.totals[type] = sum;
    };

    var data = {
        allItems: {
            exp: [],
            inc: []
        },
        totals: {
            exp: 0,
            inc: 0
        },
        budget: 0,
        percentage: -1
    };
    // if you want anything outside of this private function you would return the function  it self
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

        calculateBudget: function () {
            // calculate total income and expense
            calculateTotal('exp');
            calculateTotal('inc');

            // calculate the budget: income - expenses
            data.budget = data.totals.inc - data.totals.exp;

            // calculate the percentage of income that we spent 
            if (data.totals.inc > 0) {
                data.percentage = Math.round((data.totals.exp / data.totals.inc) * 100);
            } else {
                data.percentage = -1;
            }
        },
        getBudget: function () {
            return {
                budget: data.budget,
                totalInc: data.totals.inc,
                totalExp: data.totals.exp,
                percentage: data.percentage
            };

        },

        testing: function () {
            console.log(data);
        }
    };
})();

/////////////////////////////////////////////////////////////

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
                value: parseFloat(document.querySelector(DOMstrings.inputValue).value)
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

        clearFields: function () {
            var fields, fieldsArr;

            fields = document.querySelectorAll(DOMstrings.inputDescriptions + ', ' + DOMstrings.inputValue);

            fieldsArr = Array.prototype.slice.call(fields);

            fieldsArr.forEach(function (current, index, array) {
                current.value = "";
            });

            fieldsArr[0].focus();
        },


        //this DOMstrings is now public 
        getDOMstrings: function () {
            return DOMstrings;
        }
    };
})();

/////////////////////////////////////////////////////////////

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

    var updateBudget = function () {
        // 5. Calculate the budget 
        budgetCtrl.calculateBudget();

        // 2. return the budget
        var budget = budgetCtrl.getBudget();

        // 6. Display the budget on the UI
        console.log(budget);
    }


    var ctrlAddItem = function () {
        var input, newItem;

        // 1. Get input Data
        input = UICtrl.getInput();

        if (input.description !== "" && !isNaN(input.value) && input.value > 0) {

            // 2. add the item to the budget controller 
            newItem = budgetCtrl.addItem(input.type, input.description, input.value);

            // 3.add the item to the UI
            UICtrl.addListItem(newItem, input.type)

            // 4.Clearing the fields
            UICtrl.clearFields();

            // 5. Calculate and update budget 
            updateBudget();
        }
    }
    console.log('it works');

    return {
        init: function () {
            console.log('Application has started')
            setupEventListeners();
        }
    };
})(budgetController, UIController);

/////////////////////////////////////////////////////////////

controller.init();