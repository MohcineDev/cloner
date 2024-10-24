const MAX_ITEMS = 'https://hacker-news.firebaseio.com/v0/maxitem.json'
const NEWS_ITEM_URL = 'https://hacker-news.firebaseio.com/v0/item/'
const container = document.querySelector('.container')
const arrow = `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
  <path stroke-linecap="round" stroke-linejoin="round" d="m4.5 19.5 15-15m0 0H8.25m11.25 0v11.25" />
</svg>
`
const BTN = document.querySelector('button')
const INPUT_NUMBER = document.querySelector('input[type=number]')
const SUBMIT_BTN = document.querySelector('.tool input[type=button]')
INPUT_NUMBER.value = 5

let H2 = document.querySelectorAll('h2')

//get max item ID 

let MAX = 0
function getMaxItemID() {

    fetch(MAX_ITEMS)
        .then(res => res.json())
        .then(data => {
            MAX = data
            showData(MAX)
        })
}

getMaxItemID()



let count = 0
let fetchedItems = 0
let itemsMax = 1

INPUT_NUMBER.addEventListener('change', (e) => {
    let value = e.target.value
    if (value <= 100 && value >= 1) {
        itemsMax = value
    }
})

SUBMIT_BTN.addEventListener('click', () => {
    itemsMax = INPUT_NUMBER.value
    showData(MAX)

})

function showData(MAX) {


    fetch(`${NEWS_ITEM_URL}${MAX}.json`)
        .then(res => res.json())
        .then(data => {
            console.log(data);
            if (data.type == 'story' || data.type == 'job' || data.type == 'poll') {
                fetchedItems++

                createAndAppend(data)
            }
            if (fetchedItems < itemsMax) {
                showData(MAX)
            }
            if (fetchedItems == itemsMax) {
                count = 0
                fetchedItems = 0
            }
        })
        .catch(err => console.error(err))

    //count how many data fetched
    count++
    MAX -= count
}


///load more data
BTN.addEventListener('click', function () {
    showData(MAX)
})

//showData()
function createAndAppend(data) {
    const div = document.createElement('div')
    div.classList.add("wrapper")

    const h2 = document.createElement('h2')
    const p = document.createElement('p')
    const span = document.createElement('span')
    const url = document.createElement('a')


    h2.textContent = data.by || "- -"
    h2.id = data.id
    p.textContent = data.title || "- -"
    span.textContent = new Date(data.time * 1000).toLocaleString()
    url.href = data.url
    url.textContent = `${data.type} Link`
    url.setAttribute("target", '_blank')
    url.innerHTML += arrow
    div.appendChild(h2)
    div.appendChild(p)
    div.appendChild(span)
    div.appendChild(url)

    container.appendChild(div)
    getH2s()

}

////get h2s after they loaded
function getH2s() {
    H2 = document.querySelectorAll('h2')
    H2.forEach(function (elem) {
        elem.addEventListener('click', createPopup)
    })
}

function createPopup(e) {

    if (document.querySelector('.pop') != null) {
        alert('click the previous one to remove it')
        return
    }
    let pop = document.createElement('div')

    elemBg = window.getComputedStyle(e.target.parentElement).backgroundColor

    pop.style.background = elemBg
    const h2 = document.createElement('h2')
    h2.textContent = e.target.textContent || "- -"
    pop.appendChild(h2)
    pop.classList.add('pop')

    document.body.appendChild(pop)

    pop.addEventListener('click', () => {
        document.body.removeChild(pop)
    })
}

///footer date
document.querySelector('footer span').textContent = new Date().getFullYear()