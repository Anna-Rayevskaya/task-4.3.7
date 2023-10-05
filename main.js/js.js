const debounce = (fn, debounceTime) => {
  let timer;
  return function (...arg) {
    clearTimeout(timer);
    timer = setTimeout(() => {
      fn.apply(this, arg);
    }, debounceTime);
  };
};

function removeChildElements(el) {
  while (el.firstChild) {
    el.removeChild(el.firstChild);
  }
}

function removeElement(el) {
    el.lastElementChild.classList. add('img-del-onclick')
    setTimeout(function (){
        el.remove()
    }, 1000);
}

let inputSearch = document.querySelector(".search");
let autocomplete = document.querySelector(".autocomplete");
let addedRepositories = document.querySelector(".added-repositories");

inputSearch.addEventListener("keyup", debounce(searchUsers.bind(this), 600));
let arrRepositories = [];

async function searchUsers() {
  removeChildElements(autocomplete);
  return await fetch(
    `https://api.github.com/search/repositories?q=${inputSearch.value}&per_page=5`
  ).then(async (res) => {
    if (res.ok) {
      const repositories = res.json();
      const repositories_1 = await repositories;
      repositories_1.items.forEach((repository) => {
        arrRepositories.push(repository);
        autocomplete.insertAdjacentHTML(
          "beforeend",
          `<li class="repository">${repository.name}</li>`
        );
      });
    } else {
      throw new Error();
    }
  });
}

function addOnclick(elementParent, elementChild, fn) {
  elementParent.onclick = function findRepository(event) {
    let el = event.target.closest(`${elementChild}`);
    if (!el) return;
    if (!elementParent.contains(el)) return;
    if( el.lastElementChild && el.lastElementChild.tagName === 'IMG' && event.target === el.lastElementChild){ 
        fn(el);    
    } 
    if(!el.lastElementChild){
        fn(el);
    }
  };
}

addOnclick(autocomplete, "li", addRepository);

function addRepository(el) {
  let repository = arrRepositories.filter((repository) => {
    return repository.name === el.textContent;
  });
  repository = repository[0];
  addedRepositories.insertAdjacentHTML(
    "beforeend",
    `<li class="added-repository" >
                    Name: ${repository.name}<br> 
                    Owner: ${repository.owner.login}<br>
                    Stars: ${repository.stargazers_count}  
                    <img src="img/del.png" alt="Удалить" width="50" height="50" class="img-del">
        </li>`
  );
  inputSearch.value = '';
  removeChildElements(autocomplete)

  addOnclick(addedRepositories, "li", removeElement);
}