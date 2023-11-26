var btn = document.getElementById("btn");
var sub = document.getElementById("sub");
var ques = document.getElementById("ques");
var qholder = document.getElementById("qholder")
var qarea = document.getElementById("qarea");
var resarea = document.getElementById("resarea");
var sh = document.getElementById("sh");
var qh = document.getElementById("qh");
var sbtn = document.getElementById("sbtn");
var sname = document.getElementById("sname");
var scomment = document.getElementById("scomment");
var responseContainer = document.getElementById("responseContainer");
var rslbtn = document.getElementById("rslbtn");
var hide = document.getElementById("hide");
var store = false;
var Atfirst = true;
var mode = true;
var currentId;
var qid = 0;
var keysInLs = Object.keys(localStorage);
console.log(keysInLs);
function loadPreviousData(){
    keysInLs.forEach((keys)=>{
        var ob = localStorage.getItem(keys);
        var rob = JSON.parse(ob);
        var s = rob.subject;
        var q = rob.question;
        var ds = rob.CreatedAt;
        createQuestion(s,q,ds);
    })
    store = true;
}
loadPreviousData();
btn.addEventListener('click',()=>{
    var insert = true;
    var subject = sub.value;
    var question = ques.value;
    var date = new Date()
   if(subject.trim().length === 0 || question.trim().length === 0){
       alert("Subject And Question Should Not Be Empty");
       insert = false;
   }
    if(insert){
        store = true;
    createQuestion(subject,question,date);
    sub.value = "";
    ques.value = "";
    }
})
function righttime(olddate){
    var ndate = new Date();
    var old = new Date(olddate);
    var time = ndate.getTime() - old.getTime();
    var sec = time/1000;
    if(sec < 60){
        return "Created few Second ago";
    }
    if(sec > 60 &&  sec < 3600){
        return "created "+parseInt(sec/60)+" minutes ago";
    }
    if(sec > 3600 && sec < 3600*24){
        return "created "+parseInt(sec/3600)+" hours ago";
    }
}
function createQuestion(subject,question,caldate){
    
    var x = String(qid);
    var d = document.createElement("div");
    d.setAttribute('class','questions');
    d.setAttribute('id','q'+qid);
    d.setAttribute('onclick','handleResponse(sid'+qid+',qid'+qid+')');
    var h2 = document.createElement("h2");
    h2.textContent = subject;
    h2.setAttribute("id","sid"+qid);
    h2.setAttribute("class","onlyq")
    var p = document.createElement("p");
    p.setAttribute("id","qid"+qid)
    p.textContent = question;
    p.setAttribute("class","onlyqs")
    var dts = document.createElement("p");
    var xyz = righttime(caldate);
    dts.innerText = xyz;
    dts.setAttribute("id","time"+qid);
    d.appendChild(h2);
    d.appendChild(p);
    d.appendChild(dts);
    qholder.appendChild(d);
    if(store){
    storeTheData(subject,question);
    }
    qid++;
}
function storeTheData(subject,question){
    var dt = new Date().toISOString();
    s = dt;
    qinfo = {};
    qinfo.id = qid;
    qinfo.subject = subject;
    qinfo.question = question;
    qinfo.responses = [];
    qinfo.CreatedAt = s;
    var val = JSON.stringify(qinfo);
    localStorage.setItem("item"+qid,val);
}
function disappear(){
    qarea.setAttribute('style',"display:none;");
    resarea.setAttribute('style',"display:block");
}
function back(){
    sub.value = "";
    ques.value = "";
    qarea.setAttribute('style',"display:block;");
    resarea.setAttribute('style',"display:none");
}
function handleResponse(sid,qid){
    responseContainer.innerHTML = "";
    if(mode){
        disappear();
        var s = sid.textContent;
        var q = qid.textContent;
        sh.textContent = s;
        qh.textContent = q;
        console.log(s + " " + q);
        currentId = ReturnId(s);
        console.log(currentId);
    }
    var ob  = localStorage.getItem('item'+currentId);
    iWillCreate(ob);
}
function iWillCreate(ob){
    var sob = JSON.parse(ob);
    var arr = sob.responses;
    for(let i = arr.length -1 ; i >= 0 ; i--){
        createResponse(arr[i].name,arr[i].comment,arr[i].uvote,arr[i].dvote,i);
    }
}
sbtn.addEventListener('click',()=>{
    var insert = true;
    console.log("Working");
    var name = sname.value;
    var comment = scomment.value;
    if(name.trim().length === 0 || comment.trim().length === 0){
        alert("Name And Comment Should Not Be Empty");
        insert = false;
    }
    if(insert){
    saveResponse(name,comment,0,0);
    mode = false;
    handleResponse();
    mode = true;
    
    sname.value = "";
    scomment.value = "";
}})
function createResponse(name,comment,like,dislike,i){
    var di = document.createElement("div");
    di.setAttribute("class","rqcontainer");
    di.setAttribute("style","border-bottom :1px solid #ccd1cf")
    var h4 = document.createElement("h4");
    h4.textContent = name;
    var p = document.createElement("p");
    p.textContent = comment;
    var i1 = document.createElement("i");
    i1.setAttribute("class","fa-solid fa-thumbs-up");
    i1.setAttribute("style","font-size: 25px; margin-left: 5px;")
    i1.setAttribute("onclick","upvote("+i+",il"+currentId+""+i+")");
    s1 = document.createElement("span");
    s1.textContent = like;
    s1.setAttribute("id","il"+currentId+''+i);
    var i2 = document.createElement("i");
    i2.setAttribute("style","font-size: 25px; margin-left: 5px;")
    i2.setAttribute("class","fa-solid fa-thumbs-down");
    i2.setAttribute("onclick","downvote("+i+",id"+currentId+""+i+")");
    s2 = document.createElement("span");
    s2.textContent = dislike;
    s2.setAttribute("id","id"+currentId+''+i);
    di.appendChild(h4);
    di.appendChild(p);
    di.appendChild(i1);
    di.appendChild(s1);
    di.appendChild(i2);
    di.appendChild(s2);
    responseContainer.appendChild(di);
}

function ReturnId(s){
    var id;
    var keysInLsf = Object.keys(localStorage);
    keysInLsf.forEach((keys)=>{
        var ob = localStorage.getItem(keys);
        var rob = JSON.parse(ob);
        if(rob.subject === s){
            id = rob.id;
        }
    })
    return id;
}
function saveResponse(name,comment,l,d){
    var res = {}
    res.name = name;
    res.comment = comment;
    res.uvote = l;
    res.dvote = d;
    var ob  = localStorage.getItem('item'+currentId);
    var sob = JSON.parse(ob);
    sob.responses.push(res);
    var jsob = JSON.stringify(sob);
    localStorage.setItem('item'+currentId,jsob);
    console.log("Saved")
}
rslbtn.addEventListener('click',()=>{
    localStorage.removeItem('item'+currentId);
    location.reload();
})
function SearchQuestions(){
    var counter = 0;
    hide.style.display = "none";
    var qusArray = document.getElementsByClassName("questions");
    var onlyq = document.getElementsByClassName("onlyq");
    var onlyqs = document.getElementsByClassName("onlyqs");
    var sbox = document.getElementById("searchinp");
    var text = sbox.value;
    var stext = text.toUpperCase();
    for(let i = 0 ; i < onlyq.length ; i++){
        var temp = onlyq[i].textContent;
        temp = temp.toUpperCase();
     
        var tempx = onlyqs[i].textContent;
        tempx = tempx.toUpperCase();
      
        if(temp.indexOf(stext) > -1 || tempx.indexOf(stext) > -1){
            qusArray[i].style.display="";
        }else{
            qusArray[i].style.display="none";
            counter++;
        }
    }
    if(counter === qusArray.length){
        hide.style.display = "";
    }

}
function upvote(i,id){
    var ob  = localStorage.getItem('item'+currentId);
    var sob = JSON.parse(ob);
    var arr = sob.responses;
    var x = arr[i].uvote;
    arr[i].uvote = x+1;
    sob.responses.sort((a,b)=>{
        return a.uvote - b.uvote;
    })
    var nob = JSON.stringify(sob);
    localStorage.setItem('item'+currentId,nob);
    console.log(nob);
    responseContainer.innerHTML = "";
    iWillCreate(nob);
}
function downvote(i,id){
    var ob  = localStorage.getItem('item'+currentId);
    var sob = JSON.parse(ob);
    var arr = sob.responses;
    console.log(arr[i]);
    var x = arr[i].dvote;
    arr[i].dvote = x++;
    id.innerHTML = x++;
    var nob = JSON.stringify(sob);
    localStorage.setItem('item'+currentId,nob);
}
setInterval(()=>{
    store = false;
    qholder.innerHTML="";
    var keyInLs = Object.keys(localStorage);
    keyInLs.forEach((keys)=>{
        var ob = localStorage.getItem(keys);
        var rob = JSON.parse(ob);
        var s = rob.subject;
        var q = rob.question;
        var ds = rob.CreatedAt;
        createQuestion(s,q,ds);
    })
},30000);