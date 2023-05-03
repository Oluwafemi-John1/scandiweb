import React, { useState, useEffect } from "react";
import "./ProductList.scss";
import "./Navbar.scss";
import { HiMenuAlt4, HiX } from "react-icons/hi";
import { useNavigate } from "react-router-dom";
import axios from 'axios'
const ProductList = () => {
  const [toggle, setToggle] = useState(false);
  const [check, setCheck] = useState(false);
  const [selectedProductIndexes, setSelectedProductIndexes] = useState([]);
  const [products, setProducts] = useState([]);
  const navigate = useNavigate();
  const url = "https://scandback.herokuapp.com/index.php"; 
  useEffect(() => {
    axios.get(`${url}/getProduct`)
      .then((data) => setProducts(data.data.result))
      .catch((err) => console.log(err));
  }, []);

  const acceptIndex = (sku) => {
    if (check) {
      setSelectedProductIndexes((prevState) => [...prevState, sku]);
    } else {
      setSelectedProductIndexes((prevState) =>
        prevState.filter((selectedSku) => selectedSku !== sku)
      );
    }
  };
  const deleteSelectedProducts = () => {
    if (selectedProductIndexes.length > 0) {
      axios.post(`${url}/deleteProduct`, { sku: selectedProductIndexes }
    )
        .then((response) => {
          if (response.data) {
            setSelectedProductIndexes([]);
            setProducts((prevState) =>
              prevState.filter(
                (product) => !selectedProductIndexes.includes(product.sku)
              )
            );
          }
        else {
            throw new Error("Network response was not ok");
          }
        })
        .catch((err) => console.log(err));
    }
  };

  return (
    <>
      <div className="container">
        <nav className="app__navbar">
          <div className="app__navbar-logo">
            <p>Product List</p>
          </div>
          <ul className="app__navbar-links">
            <li className="app__flex p-text">
              <div />
              <button
                onClick={() => {
                  navigate("/addproduct");
                }}
              >
                ADD
              </button>
            </li>
            <li className="app__flex p-text">
              <div />
              <button
                onClick={deleteSelectedProducts}
                disabled={!selectedProductIndexes.length}
              >
                MASS DELETE
              </button>
            </li>
          </ul>
          <div className="app__navbar-menu">
            <HiMenuAlt4 onClick={() => setToggle(true)} />

            {toggle && (
              <div>
                <HiX onClick={() => setToggle(false)} />

                <ul className="app__navbar-links">
                  <li className="app__flex p-text">
                    <div />
                    <a href={`/addproduct`} onClick={() => setToggle(false)}>
                      Add
                    </a>
                  </li>
                  <li className="app__flex p-text">
                    <div />
                    <button
                      onClick={() => {
                        deleteSelectedProducts();
                        setToggle(false);
                      }}
                      disabled={!selectedProductIndexes.length}
                    >
                      Mass Delete
                    </button>
                  </li>
                </ul>
              </div>
            )}
          </div>
        </nav>
        <div className="list__container">
          <div className="list__box">
            {products?.length > 0
              ? products?.map((val) => (
                  <div className="card" key={val.sku}>
                    <input
                      type="checkbox"
                      className="delete-checkbox"
                      onChange={(e) => {
                        setCheck(e.target.checked);
                        acceptIndex(val.sku);
                      }}
                      checked={selectedProductIndexes.includes(val.sku)}
                    />
                    <ul>
                      <li>{val.sku}</li>
                      <li>{val.name}</li>
                      <li>{val.price}.00 $</li>
                      {(() => {
                        if (val.productType === "Furniture") {
                          return (
                            <li>
                              Dimension: {val.height}x{val.width}x{val.length}
                            </li>
                          );
                        } else if (val.productType === "DVD") {
                          return <li>Size: {val.size} MB</li>;
                        } else {
                          return <li>Weight: {val.weight} KG</li>;
                        }
                      })()}
                    </ul>
                  </div>
                ))
              : null}
          </div>
        </div>
      </div>
    </>
  );
};

export default ProductList;
