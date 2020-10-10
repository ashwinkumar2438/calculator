//eval() not used to avoid security leaks by malicious parties.

let getEl=(selector,parent=document)=>{
    return parent.querySelector(selector);
}

//variable declarations. result is the final output. operations holds all history to calculate the result.
let result=0;
let operations=[];

//clear all process...
let cleardisplay=(full)=>{
    if(full){
       operations=[];
       showresult("");
    }
    else operations.pop();
    display();
}
//............


//update display with current operations......
let display=()=>{
    getEl(".current").classList.add("highlight");
    getEl(".result").classList.remove("highlight");
    getEl(".current").innerText=operations.map(x=>x.val).join("");
}
//...............

//update display with result................
let showresult=(value)=>{
    getEl(".result").classList.add("highlight");
    getEl(".current").classList.remove("highlight");
    getEl(".result").innerText=value;
}

//.....................

//add digit to the operations list.........
let number=(value)=>{
    if(operations.length && operations[operations.length-1].type==="number")operations[operations.length-1].val+=value;
    else if(operations.length && operations[operations.length-1].val===")")return;
    else operations.push({type:"number",val:value});
    display();
}
//.....................................

//add dot to the last digit in operations list......
let numberdot=()=>{
    if(operations.length && operations[operations.length-1].type==="number")operations[operations.length-1].val+=".";
    display();
}
//.........................


//add operator to the operations list.
let operate=(operator)=>{
    if(operations.length && operations[operations.length-1].type!=="operator" && operations[operations.length-1].val!=="(") operations.push({type:"operator",val:operator});
    display();
}
//............................

//add brackets to the operations list...............
let bracket=()=>{
        let brackets=operations.filter(x=>x.type==="bracket");
        if(brackets.length && brackets[brackets.length-1].val==="(" && operations[operations.length-1].type==="number")operations.push({type:"bracket",val:")"});
        else if(operations.length && operations[operations.length-1].type==="operator" && (!brackets.length || brackets[brackets.length-1].val!=="("))operations.push({type:"bracket",val:"("});
        display();

}

//............................

//process result to be shown using operation list. 
let getresult=()=>{
    try{
    while(operations.some(x=>x.type==="bracket")){
        let values=operations.map(x=>x.val);
        let start=values.lastIndexOf("(");
        let end=values.indexOf(")");
        let inner_exec=operations.splice(start,end+1-start);
        inner_exec.pop();
        inner_exec.shift();
        operations.splice(start,0,reducer(inner_exec));
    }
    let result=reducer(operations);
    console.log(result);
    if(isNaN(result.val) || !result.val)throw result;
    showresult(result.val);
    operations=[];
    }
    catch(err){
        console.log("SYNTAX ERROR",err);
        showresult("SYNTAX ERROR");
        operations=[];
    }
}


//take the current context and evaluate final number using present operators. 
let reducer=(opers)=>{
    let ops=[...opers];
    while(ops.length>1){
        let x=ops.findIndex(op=>op.type==="operator" && (op.val==="*"||op.val==="/"));
        if(x===-1) x=ops.findIndex(op=>op.type==="operator");
        if(x!==-1){
            let calcparams=ops.splice(x-1,3);
            let result=calculate(...calcparams.map(a=>a.val));
            ops.splice(x-1,0,{type:"number",val:result});
        }
    }

    console.log(ops[0].val);

    return ops[0];
}

//................................

//take two numbers and calculate final value using the given operator. 
let calculate=(num1,oper,num2)=>{
    switch(oper){
        case "+":
        return Number(num1)+Number(num2);
        case "-":
        return Number(num1)-Number(num2);
        case "*":
        return Number(num1)*Number(num2);
        case "/":
        return Number(num1)/Number(num2);
    }
}

//.............................

//END 