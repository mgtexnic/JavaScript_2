
const API_URL = "https://raw.githubusercontent.com/GeekBrainsTutorial/online-store-api/master/responses";

Vue.component('searchform', {
    template: ` <form class="goods-search">
                    <input type="text" class="goods-search-value" v-model="searchLine">
                    <button class="goods-search-button" @click = "FilterGoods">Искать</button>
                </form>`
});

Vue.component('cart-container', {
    props:['isVisibleCart', 'cartGoods', 'fullCost', 'countGoodsCart'],
    template: ` <div class="cart-container">
                    <ul class="cart-goods">
                        <li>Товары:{{cartGoods}}</li>
                        <li>Количество товаров:{{countGoodsCart}}</li>
                        <li>Общая стоимость:{{fullCost}}</li>
                        <button>Заказать</button>
                    </ul>
                </div>`
});

Vue.component('goods-item', {
    props:['good'],
    template: `<div class="goods-item">
                 <img src="images/default_image.jpg" alt="alt" />
                 <h3>{{ good.product_name }}</h3>
                 <p>{{ good.price }}</p>
                 <button>Добавить</button>
               </div>`
});

Vue.component('errormessage', {
    template: `<h3>«Ошибка связи с севвером, попробуйте повторить запрос позже»</h3>`
});

Vue.component('goods-list', {
    props:['goods'],
    template: `<div class="goods-list">
                 <errormessage v-if = "goods == 0"></errormessage>
                   <goods-item v-for="good in goods"
                        :key="good.id_product" :good="good"></goods-item>
                   </div>
               </div>`
});


const app = new Vue({
    el: '#app',
    data: {
        goods: [],
        filteredGoods: [],
        searchLine: '',
        isVisibleCart: false,
        cartGoods: [],
        fullCost: '0',
        countGoodsCart: '0',
    },
    methods: {
        makeGetRequest(url) {
            return new Promise((resolve, reject) => {
                let xhr;
                if (window.XMLHttpRequest) {
                    xhr = new window.XMLHttpRequest();
                } else {
                    xhr = new window.ActiveXObject("Microsoft.XMLHTTP")
                }

                xhr.onreadystatechange = function () { // xhr changed
                    if (xhr.readyState === 4) {
                        if (xhr.status !== 200) {
                            reject(xhr.responseText);
                            return
                        }
                        const body = JSON.parse(xhr.responseText);
                        resolve(body)
                    }
                };

                xhr.onerror = function (err) {
                    reject(err)
                };

                xhr.open('GET', url);
                xhr.send(); // readyState 2
            });
        },
        async fetchGoods() {
            try {
                this.goods = await this.makeGetRequest(`${API_URL}/catalogData.json`);
                this.filteredGoods = [...this.goods];
            } catch (e) {
                console.error(e);
            }
        },
        isVisibleCartBlock() {
            if(this.isVisibleCart === false){
                return this.isVisibleCart = true;
            }else{
                return this.isVisibleCart = false;
            }
        },
        FilterGoods() {
            const regexp = new RegExp(this.searchLine, 'i');
            this.filteredGoods = this.goods.filter((good) => {
                return regexp.test(good.product_name);
            });
        }
    },
    mounted() {
        this.fetchGoods();
    }
});


















































