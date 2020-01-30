
const API_URL = "https://raw.githubusercontent.com/GeekBrainsTutorial/online-store-api/master/responses";

const goodsInCart = [];

function makeGetRequest(url) {
    return new Promise((resolve, reject) => {
        let xhr;
        if (window.XMLHttpRequest) {
            xhr = new window.XMLHttpRequest();
        } else  {
            xhr = new window.ActiveXObject("Microsoft.XMLHTTP");
        }

        xhr.onreadystatechange = function () {
            if (xhr.readyState === 4) {
                if(xhr.status !== 200) {
                    reject(xhr.responseText)
                }
                const body = JSON.parse(xhr.responseText);
                resolve(body)
            }
        };

        xhr.open('GET', url);
        xhr.send();
    });
}

class GoodsItem {
    constructor(id, title = 'На данный момент товар отсутствует', price = '-', img = 'images/default_image.jpg') {
        this.id = id;
        this.title = title;
        this.price = price;
        this.img = img;
    }
    render() {
        return `
            <div class="goods-item" data-id="${this.id}">
                <img src="${this.img}" alt="alt">
                <h3>${this.title}</h3>
                <p>${this.price}</p>
                <button class="js-add-to-cart">Добавить</button>
            </div>
        `;
    }
}

class GoodsList {
    constructor(container) {
        this.container = document.querySelector(container);
        this.goods = [];
        this.filteredGoods = [];
    }
    initListeners() {}
    findGood(id) {
        return this.goods[id];
    }
    fetchGoods() {}
    totalSum() {
        let sum = 0;
        for (const good of this.goods) {
            if (good.price) {
                sum += good.price;
            }
        }
        return sum;
    }
    render() {
        let listHtml = '';
        this.filteredGoods.forEach((good, index) => {
            const goodItem = new GoodsItem(index, good.product_name, good.price, good.img);
            listHtml += goodItem.render();
        });
        this.container.innerHTML = listHtml;
        this.initListeners();
    }
}

class GoodsPage extends GoodsList {
    initListeners() {
        const buttons = [...this.container.querySelectorAll('.js-add-to-cart')];
        buttons.forEach(button => {
            button.addEventListener('click', (event) => {
                const goodId = event.target.parentElement.getAttribute('data-id');
                this.addToCart(parseInt(goodId, 10));
            })
        });
        const searchForm = document.querySelector('.goods-search');
        const searchValue = document.querySelector('.goods-search-value');
        searchForm.addEventListener('submit', (e) => {
            e.preventDefault();
            let value = searchValue.value;
            value = value.trim();
            this.filterGoods(value);

        });
    }
    async fetchGoods() {
        try{
            this.goods = await makeGetRequest(`${API_URL}/catalogData.json`)
            this.filteredGoods = [...this.goods];
        }catch(err){
            console.error(`Ошибка: ${err}`)
        }
    }
    filterGoods(value) {
        const regexp = new RegExp(value, 'i');
        this.filteredGoods = this.goods.filter((good) => {
            return regexp.test(good.product_name);
        });
        this.render();
    }
    async addToCart(goodId) {
        try{
            const good = this.findGood(goodId);
            await makeGetRequest(`${API_URL}/addToBasket.json`);
            goodsInCart.push(good);
        }catch (e) {
            console.error(`Ошибка: ${err}`)
        }
    }
    async removeFromCart() {
        try{
            await makeGetRequest(`${API_URL}/deleteFromBasket.jso`);
            if(goodsInCart.length > 0) {
                goodsInCart.pop();
            }
        }catch (e) {
            console.error(`Ошибка: ${err}`)
        }
    }
    async listDataCart() {
        try{
            await makeGetRequest(`${API_URL}/getBasket.json`);
        }catch (e) {
            console.error(`Ошибка: ${err}`)
        }
    }
}

class Cart extends GoodsList {
    addToCart(good) {
        this.goods.push(good);
    }
    removeFromCart() {
        this.goods.pop();
    }
    cleanCart() {

    }
    updateCartItem(goodId, goods) {

    }
}

class CartItem extends GoodsItem {
    constructor(...attrs) {
        super(attrs);
        this.count = 0;
    }
    incCount() {

    }
    decCount() {

    }
}

const list = new GoodsPage('.goods-list');
list.fetchGoods().then(() => {
    list.render();
});


