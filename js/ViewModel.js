"use strict";
class ViewModel {
    
    domUtils;
    historyArray;
    calcObj = {};
    constructor() {
        this.historyArray = [];
        this.domUtils = new DOMUtil();
        this.calcObj = {
            operand1: undefined,
            operator: undefined,
            operand2: undefined,
        }
    }

        render () {
            document.getElementById("history").innerHTML = "";

            for (let history of this.historyArray) {
                this.addHistory(history);
            }
        };
        bind (btnSelector) {
            document.querySelector(btnSelector).onclick = () => {
                this.add();
                this.render();
            };
        };
        bindReset (btnSelector) {
            document.querySelector(btnSelector).onclick = () => {
                this.reset();
                this.render();
            };
        };
        checkValidInput () {
            
            this.setValid({
                operand1: this.calcObj.operand1,
                operand2: this.calcObj.operand2
            })
            if(!this.calcObj.operand1 || !this.calcObj.operand2) return false;
            return true;
        }
        setValid (obj) {
            for(let key in obj){
                if(!obj[key]){
                    document.getElementById(key).classList.add("is-invalid");
                }else {
                    document.getElementById(key).classList.remove("is-invalid");
                }
            }
        }
        add () {
            
            this.domUtils.getFormValue(this.calcObj);
            if(!this.checkValidInput()) return;
            this.sendRequest(
                "GET", 
                "http://localhost:8080",
                {
                    operand1: Number(this.calcObj.operand1),
                    operator: encodeURIComponent(this.calcObj.operator),
                    operand2: Number(this.calcObj.operand2)
                },
                {},
                (sum) => { this.domUtils.setValue('output', sum); this.addHistoryItem(`${Number(this.calcObj.operand1)} ${this.calcObj.operator} ${Number(this.calcObj.operand2)} = ${Number(sum).toFixed(2)}`); this.render()}
            );
        };
        reset () {
            this.calcObj.operand1 = "";
            this.calcObj.operand2 = "";
            this.calcObj.operator = "+";

            this.domUtils.setFormValue(this.calcObj);
            this.domUtils.setValue("output", 0);
            this.historyArray = [];
        };
        addHistoryItem (value) {
            this.historyArray.push(value);
        };
        addHistory (value) {
            let li = document.createElement("li");
            li.innerHTML = value;
            li.classList.add("historyItem");
            document.getElementById("history").prepend(li);
        };
        simulateRequest (factor, callback) {
            setTimeout(() => {
                callback(factor);
            }, 5000);
        };
        sendRequest (method, urlP, searchParams, body, callback) {
            
            let lookUpTable = ["GET", "PUT", "POST", "DELETE"];

            if(!lookUpTable.includes(method)){
                alert("The method: " + method + " is not valid!");
                return;
            }
            
            let request = new XMLHttpRequest();
            request.responseType = "json";
    
            let url = new URL(urlP);

            for (let key in searchParams) {
                url.searchParams.set(key, searchParams[key]);
            }

            request.open(method, url);

            if(method === "POST" || method === "PUT"){
                request.setRequestHeader("Content-Type", "application/json");
            }

            request.onload = function () {
                if(request.status === 200){
                    callback(request.response); 
                }else{
                    alert(`Error ${request.status}: ${request.statusText}`);
                }
            }
            if(body != String)
                body = JSON.stringify(body);

            if(method === "GET" || method === "DELETE"){
                request.send();
            }else{
                request.send(body);
            }
        }
}

let viewModel = new ViewModel();

viewModel.bind("#calculate");
viewModel.bindReset("#reset");

viewModel.render();