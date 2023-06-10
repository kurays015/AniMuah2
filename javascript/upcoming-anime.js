const base_url = 'https://api.jikan.moe/v4';
const modal = document.querySelector('.modal');
const form = document.querySelector('form');
const URL = `${base_url}/top/anime?filter=upcoming&page=1&limit=25`
const animeContainer = document.querySelector('.container')


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

    const response = await fetch(`https://api.jikan.moe/v4/anime?q=${anime}`)
    const data = await response.json();
    
    renderUpcomingAnime(data)
    
  } catch(error) {
    alert('NOT FOUND')
  }
}


let currentPage = 1;
const getUpcomingAnime = async (page) => {

  try {
    const response = await fetch(`${URL}&page=${page}`)
    const data = await response.json()
    renderUpcomingAnime(data)

  } catch(error) {
    alert(error)
  }
}
getUpcomingAnime(currentPage)

//next-prev button
const next = document.querySelector('.next');
const prev = document.querySelector('.prev');

next.addEventListener('click', () => {
  currentPage++;
  document.querySelector('.page').innerHTML = currentPage;
  getUpcomingAnime(currentPage)
})
prev.addEventListener('click', () => {
  currentPage--;
  document.querySelector('.page').innerHTML = currentPage;
  getUpcomingAnime(currentPage)
});


//upcoming animes
function renderUpcomingAnime(data) {
  
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
      document.querySelector('.studio').innerHTML = `Studio: ${clickedAnime.studios[0].name}`
      document.querySelector('.rating').innerHTML = `Rating: ${clickedAnime.rating}`
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

