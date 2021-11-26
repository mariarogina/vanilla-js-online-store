const cart = function () {
  const cartBtn = document.querySelector(".button-cart");
  const cart = document.getElementById("modal-cart");
  const closeBtn = cart.querySelector(".modal-close");
  const goodsContainer = document.querySelector(".long-goods-list");
  const cartTable = document.querySelector(".cart-table__goods");

  const deleteItem = (id) => {
    const cart = JSON.parse(localStorage.getItem("cart"));
    const newCart = cart.filter((item) => item.id !== id);
    localStorage.setItem("cart", JSON.stringify(newCart));
    renderCartGoods(JSON.parse(localStorage.getItem("cart")));
  };

  const addToCart = (id) => {
    const goods = JSON.parse(localStorage.getItem("goods"));
    const clickedGood = goods.find((good) => good.id === id);
    console.log(clickedGood.id);
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
    cartTable.innerHTML = "";

    goods.forEach((good) => {
      const cartTr = document.createElement("tr");
      cartTr.innerHTML = `
      <td>${good.name}</td>
						<td>${good.price}$</td>
						<td><button class="cart-btn-minus"">-</button></td>
						<td>${good.count}</td>
						<td><button class=" cart-btn-plus"">+</button></td>
						<td>${+good.price * +good.count}$</td>
						<td><button class="cart-btn-delete"">x</button></td>
      `;
      cartTable.append(cartTr);
      cartTr.addEventListener("click", (e) => {
        console.log(e.target);
        if (e.target.classList.contains("cart-btn-minus")) {
          console.log("minus");
        } else if (e.target.classList.contains("cart-btn-plus")) {
          console.log("plus");
        } else if (e.target.classList.contains("cart-btn-delete")) {
          deleteItem(good.id);
        }
      });
    });
  };

  cartBtn.addEventListener("click", () => {
    const cartArray = localStorage.getItem("cart")
      ? JSON.parse(localStorage.getItem("cart"))
      : [];
    renderCartGoods(cartArray);
    cart.style.display = "flex";
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

  closeBtn.addEventListener("click", () => {
    cart.style.display = "";
  });

  if (goodsContainer) {
    goodsContainer.addEventListener("click", (event) => {
      if (event.target.closest(".add-to-cart")) {
        const buttonToCart = event.target.closest(".add-to-cart");
        const goodId = buttonToCart.dataset.id;
        console.log(goodId);
        addToCart(goodId);
      }
    });
  }
};
cart();
