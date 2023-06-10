const form = document.querySelector('form');
const modal = document.querySelector('.modal');
const animeContainer = document.querySelector('.container')
const base_url = 'https://api.jikan.moe/v4'
const URL  = `${base_url}/top/anime?filter=bypopularity&page=1&limit=25`;
//https://api.jikan.moe/v4/anime?q=${anime}


  form.addEventListener('submit', e => {
    e.preventDefault();

    //form input value = anime
    const anime = form.anime.value;
    //reset form after searching anime
    form.reset();
    
    //get anime as argument(form value) and pass it to searchAnime function parameter
    searchAnime(anime)
  });

//search anime
const searchAnime = async (anime) => {
  try {

    const response = await fetch(`${base_url}/anime?q=${anime}`)
    const data = await response.json();
    
    renderAnime(data)
    
  } catch(error) {
    alert('Anime Not Found')
  }
}

//get data here
let currentPage = 1; // Track the current page - starts at 1

const getAnimes = async (page) => {

  try {
    const response = await fetch(`${URL}&page=${page}`)
    const data = await response.json()
    // console.log(data)
    renderAnime(data)

  } catch(error) {
    alert('Error')
  }
}
//get currentPage as page 1 and pass it to page in getAnimes
getAnimes(currentPage)


//display/render anime's
function renderAnime(data) {

  animeContainer.innerHTML = '';
  scrollTo();

  const animeList = data.data;
  
  animeList.map(anime => {
    const title = anime.title;
    const animeImage = anime.images.jpg.image_url;
    const episodes = anime.episodes;
    const year = anime.year;
    const status = anime.status;

    const myAnime = `
    <div class="card">
      <img src=${animeImage}>
      <div class="card-info">
      <h3 class="title">${title}</h3>
      <span>Episodes: ${episodes} &#8226 ${year} &#8226 ${status}</span>
      </div>   
    </div>
    `
    animeContainer.innerHTML += myAnime;
  })


  //SHOW MODAL IF EACH CARD IS CLICKED
  const clickCard = document.querySelectorAll('.card')

  clickCard.forEach((cards, index) => {
    cards.addEventListener('click', () => {
      
      const clickedAnime = animeList[index];

       // Genres
      const listofGenres = clickedAnime.genres.map(genre => genre.name).join(', ');

      //append all into modal starts
      const trailer = document.querySelector('.trailer');

      trailer.innerHTML = `<iframe class="trailer-video" width="650" height="400" frameborder="0" src="${clickedAnime.trailer.embed_url}" allowfullscreen> </iframe>`
      document.querySelector('.modal-image').src = `${clickedAnime.images.jpg.image_url}`
      document.querySelector('.modal-title').innerHTML = `${clickedAnime.title}`
      document.querySelector('.rank').innerHTML = `Rank: ${clickedAnime.rank}`
      document.querySelector('.episodes').innerHTML = `Episodes: ${clickedAnime.episodes}`
      document.querySelector('.studio').innerHTML = `Studio: ${clickedAnime.studios[0].name}`
      document.querySelector('.rating').innerHTML = `Rating: ${clickedAnime.rating}`
      document.querySelector('.score').innerHTML = `Score: ${clickedAnime.score}`
      document.querySelector('.season').innerHTML = `Season: ${clickedAnime.season}`
      document.querySelector('.year').innerHTML = `Year: ${clickedAnime.year} - ${clickedAnime.status}`
      document.querySelector('.genre').innerHTML = `Genres: ${listofGenres}`
      document.querySelector('.text').innerHTML = `${clickedAnime.synopsis}.`
       //append all into modal ends

      //show modal dialog
      modal.showModal();
      modal.style.display = 'block';

      //close modal
      const closeBtn = document.querySelector('.close');
      closeBtn.addEventListener('click', () => {
        modal.close();
        modal.style.display = 'none';
      });
    })   
  })
}



//next-prev button
const next = document.querySelector('.next');
const prev = document.querySelector('.prev');

next.addEventListener('click', () => {
  currentPage++;
  document.querySelector('.page').innerHTML = currentPage;
  getAnimes(currentPage)
})
prev.addEventListener('click', () => {
  currentPage--;
  document.querySelector('.page').innerHTML = currentPage;
  getAnimes(currentPage)
});