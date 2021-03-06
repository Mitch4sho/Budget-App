//BUDGET CONTROLLER
var budgetController = (function () {

    var Expense = function (id, description, value) {
        this.id = id;
        this.description = description;
        this.value = value;
        this.percentage = -1;
    };

    Expense.prototype.calPercentage = function (totalIncome) {
        if (totalIncome > 0) {
            this.percentage = Math.round((this.value / totalIncome) * 100);
        } else {
            this.percentage = -1;
        }
    };

    Expense.prototype.getPercentage = function () {
        return this.percentage;
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

        deleteItem: function (type, id) {
            var ids, index;

            ids = data.allItems[type].map(function (current) {
                return current.id;
            });

            index = ids.indexOf(id);

            if (index !== -1) {
                data.allItems[type].splice(index, 1);
            }
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

        calculatePercentages: function () {
            data.allItems.exp.forEach(function (cur) {
                return cur.calPercentage(data.totals.inc);
            });
        },

        getPercentages: function () {
            var allPercentages = data.allItems.exp.map(function (cur) {
                return cur.getPercentage();
            });
            return allPercentages
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
        expenseContainer: '.expensesList',
        budgetValue: '.budgetValue',
        incomeValue: '.budgetIncomeValue',
        expenseValue: '.budgetExpensesValue',
        expensePercentage: '.budgetExpensePercentage',
        itemPercentage: '.itemPercentage',
        container: '.container',
        expensePercLabel: '.itemPercentage',
        dateLabel: '.budgetTitleMonth'
    };
    var formatNumber = function (num, type) {
        var numSplit, int, dec;
        /*
        + or - before number 
        exactly 2 decimal points 
        comma separating the thousands 
        
        2310.8957 -> + 2,310.90
         */

        num = Math.abs(num);
        num = num.toFixed(2);

        numSplit = num.split('.');

        int = numSplit[0];
        if (int.length > 3) {
            int = int.substr(0, int.length - 3) + ',' + int.substr(int.length - 3, 3);
        };
        dec = numSplit[1];

        // ternary operator , shorthand way to write simple if else statement

        return (type === 'exp' ? '- ' : '+ ') + int + '.' + dec;
    };

    var nodeListForeach = function (list, callback) {
        for (var i = 0; i < list.length; i++) {
            callback(list[i], i);
        }
    };

    return {
        getInput: function () {
            return {
                // returning a object so you have access to the properties instead of variables
                type: document.querySelector(DOMstrings.inputType).value, // will be either inc or exp 
                description: document.querySelector(DOMstrings.inputDescriptions).value,
                value: parseFloat(document.querySelector(DOMstrings.inputValue).value),
            };
        },

        addListItem: function (obj, type) {
            var html, newHtml, element;

            // create html string with placeholder 
            if (type === 'inc') {
                element = DOMstrings.incomeContainer;
                html = '<div class="item" id="inc-%id%"><div class="itemDescription">%description%</div><div class="itemValue">%value%</div><div class="itemDelete"><button class="itemDeleteBtn"><i class="fas fa-trash-alt"></i></button></div></div>';
            } else if (type === 'exp') {
                element = DOMstrings.expenseContainer;
                html = '<div class="item" id="exp-%id%"><div class="itemDescription">%description%</div><div class="itemValue">%value%</div><div class="itemPercentage">21%</div><div class="itemDelete"><button class="itemDeleteBtn"><i class="fas fa-trash-alt"></i></button></div></div>';
            }
            //replace the placeholder text with acutal data
            newHtml = html.replace('%id%', obj.id);
            newHtml = newHtml.replace('%description%', obj.description);
            newHtml = newHtml.replace('%value%', formatNumber(obj.value, type));

            //insert the html into DOM
            document.querySelector(element).insertAdjacentHTML('beforeend', newHtml);


        },

        deleteListItem: function (selectorID) {
            var el = document.getElementById(selectorID);
            el.parentNode.removeChild(el);
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
        displayBudget: function (obj) {

            obj.budget > 0 ? type = 'inc' : type = 'exp';

            document.querySelector(DOMstrings.budgetValue).textContent = formatNumber(obj.budget, type);
            document.querySelector(DOMstrings.incomeValue).textContent = formatNumber(obj.totalInc, 'inc');
            document.querySelector(DOMstrings.expenseValue).textContent = formatNumber(obj.totalExp, 'exp');
            if (obj.percentage > 0) {
                document.querySelector(DOMstrings.expensePercentage).textContent = obj.percentage + '%';
            } else {
                document.querySelector(DOMstrings.expensePercentage).textContent = '---'
            }
        },

        displayPercentages: function (percentages) {

            var fields = document.querySelectorAll(DOMstrings.expensePercLabel);

            nodeListForeach(fields, function (current, index) {
                if (percentages[index] > 0) {
                    current.textContent = percentages[index] + '%';
                } else {
                    current.textContent = '---';
                }
            });
        },


        displayMonth: function () {
            var now, year, month, months;

            now = new Date();
            months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
            month = now.getMonth();

            year = now.getFullYear();
            document.querySelector(DOMstrings.dateLabel).textContent = months[month] + ' ' + year;

        },

        changeType: function () {

            var fields = document.querySelectorAll(
                DOMstrings.inputType + ',' +
                DOMstrings.inputDescriptions + ',' +
                DOMstrings.inputValue
            );

            nodeListForeach(fields, function (cur) {
                cur.classList.toggle('redFocus');
            });

            document.querySelector(DOMstrings.inputBtn).classList.toggle('red');

        },


        //this DOMstrings is now public 
        getDOMstrings: function () {
            return DOMstrings;
        },

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
        document.querySelector(DOM.container).addEventListener('click', ctrlDeleteItem);

        document.querySelector(DOM.inputType).addEventListener('change', UICtrl.changeType);
    };

    var updateBudget = function () {
        // 5. Calculate the budget 
        budgetCtrl.calculateBudget();

        // 2. return the budget
        var budget = budgetCtrl.getBudget();

        // 6. Display the budget on the UI
        UICtrl.displayBudget(budget);
    };

    var updatePercentages = function () {
        //Cal Percentages
        budgetCtrl.calculatePercentages();

        //read Percentages from the budget controller 
        var percentages = budgetCtrl.getPercentages();

        //update UI 
        UICtrl.displayPercentages(percentages);
    };



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

            //6. Cal update Percentages
            updatePercentages();
        }
    }

    var ctrlDeleteItem = function (event) {
        var itemID, type, splitID, ID;
        itemID = event.target.parentNode.parentNode.parentNode.id;

        if (itemID) {
            //inc-1 
            splitID = itemID.split('-');
            type = splitID[0];
            ID = parseInt(splitID[1]);

            // 1. delete the item from the data structure 
            budgetCtrl.deleteItem(type, ID);

            //2. Delete the item form the UI 
            UICtrl.deleteListItem(itemID);

            //3. update and show the new budget 
            updateBudget();

            //4.  Cal update Percentages
            updatePercentages();
        }
    };
    return {
        init: function () {
            console.log('Application has started')
            UICtrl.displayBudget({
                budget: 0,
                totalInc: 0,
                totalExp: 0,
                percentage: -1
            });
            setupEventListeners();
            UICtrl.displayMonth();
        }
    };
})(budgetController, UIController);

/////////////////////////////////////////////////////////////

controller.init();