const cart = function () {
  const cartBtn = document.querySelector(".button-cart");
  const cart = document.getElementById("modal-cart");
  const closeBtn = cart.querySelector(".modal-close");
  const goodsContainer = document.querySelector(".long-goods-list");
  const cartTable = document.querySelector(".cart-table__goods");
  const modalForm = document.querySelector(".modal-form");

  //TO DO : 1) get name and phone from form event target and add them to POST request 2)validate form

  const getTotalQuantity = (goods) => {
    return goods.reduce((total, good) => +good.price * +good.count + total, 0);
  };

  const plusItemCount = (id) => {
    const cart = JSON.parse(localStorage.getItem("cart"));
    const newCart = cart.map((good) => {
      if (good.id === id) {
        good.count++;
      }
      return good;
    });

    localStorage.setItem("cart", JSON.stringify(newCart));
    renderCartGoods(JSON.parse(localStorage.getItem("cart")));
  };

  const deleteItem = (id) => {
    const cart = JSON.parse(localStorage.getItem("cart"));
    const newCart = cart.filter((item) => item.id !== id);
    localStorage.setItem("cart", JSON.stringify(newCart));
    renderCartGoods(JSON.parse(localStorage.getItem("cart")));
  };

  const minusItemCount = (id) => {
    const cart = JSON.parse(localStorage.getItem("cart"));

    const newCart = cart.map((good) => {
      if (good.id === id) {
        if (good.count > 0) {
          good.count--;
        } else if (good.count === 1) {
          console.log("item 0");
          good = {};
        }
      }
      return good;
    });

    localStorage.setItem("cart", JSON.stringify(newCart));

    renderCartGoods(JSON.parse(localStorage.getItem("cart")));
  };

  const addToCart = (id) => {
    const goods = JSON.parse(localStorage.getItem("goods"));
    const clickedGood = goods.find((good) => good.id === id);
    const cart = localStorage.getItem("cart")
      ? JSON.parse(localStorage.getItem("cart"))
      : [];

    if (cart.some((good) => good.id === clickedGood.id)) {
      console.log("Increase count");
      cart.map((good) => {
        if (good.id === clickedGood.id) {
          good.count++;
        }
        return good;
      });
    } else {
      console.log("Add");
      clickedGood.count = 1;
      cart.push(clickedGood);
    }

    localStorage.setItem("cart", JSON.stringify(cart));
  };

  const renderCartGoods = (goods) => {
    const cartTotal = document.querySelector(".card-table__total");
    cartTotal.innerHTML = "";
    cartTable.innerHTML = "";

    goods.forEach((good) => {
      const cartTr = document.createElement("tr");
      cartTr.innerHTML = `
      <td>${good?.name}</td>
						<td>${good?.price}$</td>
						<td><button class="cart-btn-minus"">-</button></td>
						<td>${good?.count}</td>
						<td><button class=" cart-btn-plus"">+</button></td>
						<td>${+good?.price * +good?.count}$</td>
						<td><button class="cart-btn-delete"">x</button></td>
      `;
      cartTable.append(cartTr);

      cartTr.addEventListener("click", (e) => {
        console.log(e.target);
        if (e.target.classList.contains("cart-btn-minus")) {
          if (good.count > 1) {
            minusItemCount(good.id);
          } else {
            deleteItem(good.id);
          }
        } else if (e.target.classList.contains("cart-btn-plus")) {
          plusItemCount(good.id);
        } else if (e.target.classList.contains("cart-btn-delete")) {
          deleteItem(good.id);
        }
      });
    });
    const cartTotalValue = getTotalQuantity(goods);

    const totalSpan = document.createElement("span");
    totalSpan.innerHTML = `${+cartTotalValue}`;
    cartTotal.append(totalSpan);
  };

  const setForm = () => {
    const cartArray = localStorage.getItem("cart")
      ? JSON.parse(localStorage.getItem("cart"))
      : [];
    fetch("https://jsonplaceholder.typicode.com/posts", {
      method: "POST",
      body: JSON.stringify({
        cart: cartArray,
        name: "",
        phone: "",
      }),
    }).then(() => {
      cart.style.display = "";
    });
  };

  modalForm.addEventListener("submit", (e) => {
    e.preventDefault();
    setForm();
    localStorage.setItem("cart", JSON.stringify([]));
  });
  cartBtn.addEventListener("click", () => {
    const cartArray = localStorage.getItem("cart")
      ? JSON.parse(localStorage.getItem("cart"))
      : [];
    renderCartGoods(cartArray);
    cart.style.display = "flex";
  });

  closeBtn.addEventListener("click", () => {
    cart.style.display = "";
  });

  cart.addEventListener("click", (e) => {
    if (!e.target.closest(".modal") && e.target.classList.contains("overlay")) {
      cart.style.display = "";
    }
  });

  window.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      cart.style.display = "";
    }
  });

  if (goodsContainer) {
    goodsContainer.addEventListener("click", (event) => {
      if (event.target.closest(".add-to-cart")) {
        const buttonToCart = event.target.closest(".add-to-cart");
        const goodId = buttonToCart.dataset.id;
        addToCart(goodId);
      }
    });
  }
};
cart();
