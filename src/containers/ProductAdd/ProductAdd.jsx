import React, { useState, useRef, useEffect } from "react";
import { useFormik } from "formik";
import "./ProductAdd.scss";
import { useNavigate } from "react-router-dom";
import axios from "axios";
const ProductAdd = () => {
  const bookBx = useRef();
  const [selected, setSelected] = useState(null);
  const [selectClass, setSelectClass] = useState(null);
  const navigate = useNavigate();
  useEffect(() => {
    setSelectClass(() => bookBx.current);
  }, []);

  if (selected) {
    const children = selectClass.querySelectorAll(".Book, .DVD, .Furniture");
    children.forEach((child) => {
      if (child.classList.contains(selected)) {
        child.style.display = "block";
      } else {
        child.style.display = "none";
      }
    });
  }
  const url ='https://scandback.herokuapp.com/index.php/createProduct';
  const formik = useFormik({
    initialValues: {
      sku: "",
      name: "",
      price: "",
      productType: "",
      weight: "",
      size: "",
      length: "",
      width: "",
      height: "",
    },
    onSubmit: (values) => {
      axios.post(url, values)
        .then((data) => {
          if (data.data.success === true) {
            navigate("/");
          }
        })
        .catch((err) => {
          console.log(err);
        });
      
    },
    validate: (values) => {
      let errors = {};

      if (!values.sku) {
        errors.sku = "Please, submit required data";
      }
      if (!values.name) {
        errors.name = "Please, submit required data";
      }
      if (!values.price) {
        errors.price = "Please, submit required data";
      } else if (isNaN(values.price)) {
        errors.price = "Please provide a value of number type";
      }
      if (!values.productType) {
        errors.productType = "Please, submit required data";
      }

      if (selected === "Furniture") {
        if (!values.height || !values.width || !values.length) {
          errors.productType = "Please provide dimensions";
        }
        let required = {
          length: "",
          width: "",
          height: "",
        };
        for (let key in required) {
          if (!values[key]) {
            errors[key] = "Please, submit required data";
          } else if (isNaN(values[key])) {
            errors[key] = "Please provide a value of number type";
          }
        }
      }

      if (selected === "Book") {
        if (!values.weight) {
          errors.productType = "Please provide weight";
        }
        if (!values.weight) {
          errors.weight = "Please, submit required data";
        } else if (isNaN(values.weight)) {
          errors.weight = "Please provide a value of number type";
        }
      }

      if (selected === "DVD") {
        if (!values.size) {
          errors.productType = "Please provide size";
        }
        if (!values.size) {
          errors.size = "Please, submit required data";
        } else if (isNaN(values.size)) {
          errors.size = "Please provide a value of number type";
        }
      }

      return errors;
    },
  });
  return (
    <div className="container">
      <form onSubmit={formik.handleSubmit} id="product_form">
        <nav className="app__navbar">
          <div className="app__navbar-logo">
            <p>Product Add</p>
          </div>
          <ul className="pro__navbar-links">
            <li className="app__flex p-text">
              <button type="submit">Save</button>
            </li>
            <li className="app__flex p-text">
              <button onClick={() => navigate("/")} type="button">
                Cancel
              </button>
            </li>
          </ul>
        </nav>

        <div className="pro__form-container app__flex">
          <div className="pro__form">
            {["sku", "name"].map((fieldName) => (
              <div className="pro__form-group" key={fieldName}>
                <label htmlFor={fieldName}>{fieldName.toUpperCase()}</label>
                <input
                  type="text"
                  name={fieldName}
                  id={fieldName}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className={
                    formik.errors[fieldName] && formik.touched[fieldName]
                      ? "is-invalid"
                      : ""
                  }
                  value={formik.values[fieldName]}
                />
                {formik.touched[fieldName] && formik.errors[fieldName] && (
                  <span className="text-danger">
                    {formik.errors[fieldName]}
                  </span>
                )}
              </div>
            ))}
            <div className="pro__form-group">
              <label htmlFor="size">Price [$]</label>
              <input
                name="price"
                type="number"
                id="price"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className={
                  formik.errors.price && formik.touched.price
                    ? "is-invalid"
                    : ""
                }
                value={formik.values.price}
              />
              {formik.touched.price && (
                <span className="text-danger">{formik.errors.price}</span>
              )}
            </div>
            <div className="pro__form-group">
              <label htmlFor="productType">Type Switcher</label>
              <select
                name="productType"
                id="productType"
                onBlur={formik.handleBlur}
                onChange={(e) => {
                  setSelected(e.target.value);
                  formik.handleChange(e);
                }}
                className={
                  formik.errors.productType && formik.touched.productType
                    ? "is-invalid"
                    : ""
                }
                value={formik.values.productType}
              >
                <option value="" selected disabled>
                  Type Switcher
                </option>
                <option value="Book">Book</option>
                <option value="DVD">DVD</option>
                <option value="Furniture">Furniture</option>
              </select>
              {formik.touched.productType && (
                <span className="text-danger">{formik.errors.productType}</span>
              )}
            </div>
            <div className="bx" ref={bookBx}>
              <div className="Book" style={{ display: "none" }}>
                <div className="pro__form-group">
                  <label htmlFor="weight">Weight [KG]</label>
                  <input
                    type="number"
                    id="weight"
                    name="weight"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    className={
                      formik.errors.weight && formik.touched.weight
                        ? "is-invalid"
                        : ""
                    }
                    value={formik.values.weight}
                  />
                  {formik.touched.weight && (
                    <span className="text-danger">{formik.errors.weight}</span>
                  )}
                </div>
              </div>
              <div className="DVD" style={{ display: "none" }}>
                <div className="pro__form-group">
                  <label htmlFor="size">Size [MB]</label>
                  <input
                    name="size"
                    type="number"
                    id="size"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    className={
                      formik.errors.size && formik.touched.size
                        ? "is-invalid"
                        : ""
                    }
                    value={formik.values.size}
                  />
                  {formik.touched.size && (
                    <span className="text-danger">{formik.errors.size}</span>
                  )}
                </div>
              </div>
              <div className="Furniture" style={{ display: "none" }}>
                {["height", "width", "length"].map((fieldName) => (
                  <div className="pro__form-group" key={fieldName}>
                    <label htmlFor={fieldName}>
                      {fieldName.toUpperCase()} [CM]
                    </label>
                    <input
                      type="text"
                      name={fieldName}
                      id={fieldName}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      className={
                        formik.errors[fieldName] && formik.touched[fieldName]
                          ? "is-invalid"
                          : ""
                      }
                      value={formik.values[fieldName]}
                    />
                    {formik.touched[fieldName] && formik.errors[fieldName] && (
                      <span className="text-danger">
                        {formik.errors[fieldName]}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default ProductAdd;
