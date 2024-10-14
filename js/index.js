const allAnchors = document.querySelectorAll('.navbar-nav .nav-link');

for (let i = 0; i < allAnchors.length; i++) {
    allAnchors[i].addEventListener('click', function () {
        getGame(allAnchors[i].textContent);
        for (let j = 0; j < allAnchors.length; j++) {
            allAnchors[j].classList.remove('active');
        }
        this.classList.add('active');
    });
}

async function getGame(category = "mmorpg") {
    document.getElementById('overlay').style.display = 'flex';
    const options = {
        method: 'GET',
        headers: {
            'x-rapidapi-key': '531c56ac60mshb09f2f076240b51p1602b0jsn0cecb2bc5970',
            'x-rapidapi-host': 'free-to-play-games-database.p.rapidapi.com'
        }
    };

    const api = await fetch(`https://free-to-play-games-database.p.rapidapi.com/api/games?category=${category}`, options);
    const response = await api.json();

    document.getElementById('overlay').style.display = 'none';
    let newclass = new ui(response);
    newclass.displayData();
}

async function getApiDetails(id) {
    document.getElementById('overlay').style.display = 'flex';
    const options = {
        method: 'GET',
        headers: {
            'x-rapidapi-key': '531c56ac60mshb09f2f076240b51p1602b0jsn0cecb2bc5970',
            'x-rapidapi-host': 'free-to-play-games-database.p.rapidapi.com'
        }
    };
    const api = await fetch(`https://free-to-play-games-database.p.rapidapi.com/api/game?id=${id}`, options);
    const response = await api.json();

    document.getElementById('overlay').style.display = 'none';

    let newclass = new ui(response);
    newclass.displayDetails();
}

class ui {
    constructor(apiData) {
        this.apiData = apiData;
    }

    cartona = ``;

    displayData() {
        this.cartona = '';  
        for (let i = 0; i < this.apiData.length; i++) {
            let description = this.apiData[i].short_description.split(' ').slice(0, 10).join(' ');
            this.cartona += `
            <div class="col-lg-3 col-md-4 col-sm-6 col-12">
                <div class="card h-100">
                    <img src="${this.apiData[i].thumbnail}" class="card-img-top game-image" alt="..." data-id="${this.apiData[i].id}">
                    <div class="card-body d-flex justify-content-between p-0 mt-3">
                        <p class="mb-0 text-white">${this.apiData[i].title}</p>
                        <span>Free</span>
                    </div>
                    <div class="text-card text-center">
                        <p>${description}</p>
                    </div>
                    <div class="card-footer d-flex justify-content-between pe-0 ps-0 pb-0">
                        <span class="badge">${this.apiData[i].genre}</span>
                        <span class="badge">${this.apiData[i].platform}</span>
                    </div>
                </div>
            </div>`;
        }
        document.getElementById('rowData').innerHTML = this.cartona;

        this.getGameId();
    }

    getGameId() {
        let cards = document.querySelectorAll('.card');
        cards.forEach((card) => {
            card.addEventListener('click', (e) => {
                let gameId = card.querySelector('.game-image').getAttribute('data-id');
                getApiDetails(gameId);
            });
        });
    }

    displayDetails() {
        let gameData = this.apiData;
        let gameDetails = `
            <div class="col-lg-4">
                <img src="${gameData.thumbnail}" class="w-100" alt="">
            </div>
            <div class="col-lg-8">
                <h3>Title: ${gameData.title}</h3>
                <p>Category: <span class="badge text-bg-info">${gameData.genre}</span></p>
                <p>Platform: <span class="badge text-bg-info">${gameData.platform}</span></p>
                <p>Status: <span class="badge text-bg-info">${gameData.status}</span></p>
                <div class="description small mb-3">${gameData.description}</div>
                <button class="btn btn-outline-warning text-white" id="showGameBtn">Show Game</button>
            </div>`;
        document.getElementById('Details').innerHTML = gameDetails;

        // زر الإغلاق
        document.getElementById('closeBtn').addEventListener('click', () => {
            document.querySelector('.details').classList.add('d-none');
            document.querySelector('.home').classList.remove('d-none');
        });

        document.getElementById('showGameBtn').addEventListener('click', () => {
            window.open(gameData.game_url);
        });

        document.querySelector('.details').classList.remove('d-none');
        document.querySelector('.home').classList.add('d-none');
    }
}

getGame();
