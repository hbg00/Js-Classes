let checkValue = false;

const button = document.getElementById("buttonResult");
button.addEventListener("click", fillArray);

const buttonAdd = document.getElementById("addButton");
buttonAdd.addEventListener("click", addButton);

const buttonsContainer = document.getElementById("buttons");
buttonsContainer.addEventListener("click", function (event) 
{
    if (event.target.classList.contains("delete")) 
    { 
        remove(event);
        onChange()
    }
});

buttonsContainer.addEventListener("change", onChange);

const addInfo = document.createElement("p");
const avgInfo = document.createElement("p");
const minInfo = document.createElement("p");
const maxInfo = document.createElement("p");

function addButton() 
{
    let div = document.createElement("div");
    let input = document.createElement("input");
    input.classList.add("e");
    let button = document.createElement("button");
    button.classList.add("delete");
    button.textContent = "Delete";
    buttonsContainer.append(div);
    div.append(input, button);
}

function remove(event)
{
    const button = event.target;
    const div = button.parentNode;
    div.remove();
}

function add(parameter)
{
    resultSum = 0;
    for(let i = 0; i < parameter.length; i++)
    {
        resultSum += parseInt(parameter[i]);
    }
    return resultSum;
}

function avg(parameter)
{
   let sum = add(parameter);
   return sum / parameter.length;
}

function min(parameter)
{
    let min = parameter[0];
    for(let i = 0; i < parameter.length; i++)
    {
        if(min > parameter[i])
        {
            min = parameter[i];
        }
    }

    return min;
}

function max(parameter)
{
    let max = 0;
    for(let i = 0; i < parameter.length; i++)
    {
        if(max < parameter[i])
        {
            max = parameter[i];
        }
    }

    return max;
}

function onChange()
{
    if(checkValue)
    {
        let array = []
        let querySel = document.querySelectorAll(".e");
        for(let i = 0; i < querySel.length; i++)
        {
            array.push(querySel[i].value);
        }
           
        addInfo.textContent = "Sum "+ add(array);
        avgInfo.textContent = "Avg "+ avg(array);
        minInfo.textContent = "Min "+ min(array);
        maxInfo.textContent = "Max "+ max(array);
            
        document.getElementById("result").textContent = "";
        document.getElementById("result").append(addInfo,avgInfo,minInfo,maxInfo);
    }   
}

function fillArray()
{
    let array = []
    let querySel = document.querySelectorAll(".e");

    for(let i = 0; i < querySel.length; i++)
    {
        array.push(querySel[i].value);
    }

    addInfo.textContent = "Sum "+ add(array);
    avgInfo.textContent = "Avg "+ avg(array);
    minInfo.textContent = "Min "+ min(array);
    maxInfo.textContent = "Max "+ max(array);
    
    document.getElementById("result").textContent = "";
    document.getElementById("result").append(addInfo,avgInfo,minInfo,maxInfo);
    checkValue = true;
}