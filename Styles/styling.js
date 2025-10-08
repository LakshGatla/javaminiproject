let resize = document.querySelector(".sizingchild")
let resizeparent = document.querySelector(".sizing")
const viewport = window.innerWidth;
const px = 0.34 * viewport;



var lefttop = document.querySelector(".left-top")
var leftmiddle = document.querySelector(".left-middle")
let isscroll;
// console.log(lefttop)

function onscrollshadow(name, name2){
    let scrolly = name2.scrollTop
    if (scrolly == 0) {

        name.style.boxShadow = "0px 0px 0px 0px "
    }
    else {
        name.style.boxShadow = "0px 10px 20px -8px rgb(0, 0, 0)"
        
    }
    
}
leftmiddle.addEventListener("scroll",()=> onscrollshadow(lefttop , leftmiddle))
let container = document.querySelector(".main-song-page")
let whole_search = document.querySelector(".search")

container.addEventListener("scroll",()=> {
    onscrollshadow(whole_search , container)
    
})


let search = document.querySelector(".inputdiv")

search.addEventListener("click" , (event)=>{
    event.stopPropagation()
    search.classList.toggle("white")
    // search.style.transition = "all 0.3s ease"

})

document.addEventListener("click" , ()=>{
    search.classList.remove("white")
})

let left_bottom = document.querySelector(".left-bottom")

left_bottom.addEventListener("scroll" ,()=> onscrollshadow(leftmiddle , left_bottom))


if(viewport > 540){
    // console.log("helloo")
    let searchbar = document.querySelector(".play-control-button")

    searchbar.classList.toggle("absolute")

    
    
}


    
let ham = document.querySelector(".hamburger")
let left = document.querySelector(".left")



    ham.addEventListener("click",()=>{
        
        if (left.style.left === '0px') {
            left.style.left = '-100%';
            ham.src = "img/ham.svg"
            
        } else {
            left.style.left = '0';

            ham.src = "img/close.svg"
        }

    })
















let img = document.getElementsByTagName("img")

for (const images of img) {
    images.setAttribute("draggable" , "false")
}
