/* eslint-disable jsx-a11y/accessible-emoji */
import React, { useState } from 'react';
import './App.scss';
import cn from 'classnames';
import productsFromServer from './api/products';
import users from './api/users';
import { Table } from './components/Table';
import categories from './api/categories';

function findCategoryByProductId(id) {
  return categories.find(category => category.id === id);
}

function findUserByCategoryId(id) {
  return users.find(user => user.id === id);
}

function filterByUser(arr, selectedUserId) {
  return arr.filter(product => {
    const category = findCategoryByProductId(product.categoryId);
    const user = findUserByCategoryId(category.ownerId);

    return user.id === selectedUserId;
  });
}

function filterByProductName(arr, input) {
  return arr.filter(product => {
    return product.name.toLowerCase().includes(input.toLowerCase());
  });
}

function filterByCategory(arr, categoryName) {
  return arr.filter(product => {
    const category = findCategoryByProductId(product.categoryId);

    return category.title === categoryName;
  });
}

export const App = () => {
  let products = productsFromServer;

  const [selectedUserId, setSelectedUserId] = useState(0);
  const [inputText, setInputText] = useState('');
  const [categoryName, setCategoryName] = useState('All');
  const [sortObj, setSortObj] = useState({
    ID: 0,
    Product: 0,
    Category: 0,
    User: 0,
  });
  let isFilterClear = false;

  if (selectedUserId !== 0) {
    products = filterByUser(products, selectedUserId);
  }

  if (categoryName !== 'All') {
    products = filterByCategory(products, categoryName);
  }

  products = filterByProductName(products, inputText);

  if (products.length === 0) {
    isFilterClear = true;
  } else {
    isFilterClear = false;
  }

  return (
    <div className="section">
      <div className="container">
        <h1 className="title">Product Categories</h1>

        <div className="block">
          <nav className="panel">
            <p className="panel-heading">Filters</p>

            <p className="panel-tabs has-text-weight-bold">
              <a
                onClick={e => {
                  e.preventDefault();
                  setSelectedUserId(0);
                }}
                data-cy="FilterAllUsers"
                href="#/"
                className={cn({
                  'is-active': users.every(user => user.id !== selectedUserId),
                })}
              >
                All
              </a>

              {users.map(user => (
                <a
                  key={user.id}
                  data-cy="FilterUser"
                  href="#/"
                  className={cn({ 'is-active': user.id === selectedUserId })}
                  onClick={e => {
                    e.preventDefault();
                    setSelectedUserId(user.id);
                  }}
                >
                  {user.name}
                </a>
              ))}
            </p>

            <div className="panel-block">
              <p className="control has-icons-left has-icons-right">
                <input
                  data-cy="SearchField"
                  type="text"
                  className="input"
                  placeholder="Search"
                  value={inputText}
                  onChange={e => setInputText(e.target.value)}
                />

                <span className="icon is-left">
                  <i className="fas fa-search" aria-hidden="true" />
                </span>

                <span className="icon is-right">
                  {inputText !== '' && (
                    <button
                      onClick={() => setInputText('')}
                      data-cy="ClearButton"
                      type="button"
                      className="delete"
                    />
                  )}
                </span>
              </p>
            </div>

            <div className="panel-block is-flex-wrap-wrap">
              <a
                href="#/"
                onClick={e => {
                  e.preventDefault();
                  setCategoryName('All');
                }}
                data-cy="AllCategories"
                className={cn(
                  {
                    'is-outlined': categoryName !== 'All',
                  },
                  'button is-success mr-6',
                )}
              >
                All
              </a>

              {categories.map(category => (
                <a
                  key={category.id}
                  onClick={e => {
                    e.preventDefault();
                    setCategoryName(category.title);
                  }}
                  data-cy="Category"
                  className={cn(
                    {
                      'is-info': categoryName === category.title,
                    },
                    'button mr-2 my-1',
                  )}
                  href="#/"
                >
                  {category.title}
                </a>
              ))}
            </div>

            <div className="panel-block">
              <a
                data-cy="ResetAllButton"
                href="#/"
                onClick={e => {
                  e.preventDefault();
                  setCategoryName('All');
                  setSelectedUserId(0);
                  setInputText('');
                  isFilterClear = false;
                  setSortObj({
                    ID: 0,
                    Product: 0,
                    Category: 0,
                    User: 0,
                  });
                }}
                className="button is-link is-outlined is-fullwidth"
              >
                Reset all filters
              </a>
            </div>
          </nav>
        </div>

        <div className="box table-container">
          {isFilterClear ? (
            <p data-cy="NoMatchingMessage">
              No products matching selected criteria
            </p>
          ) : (
            <Table
              products={products}
              sortObj={sortObj}
              sortObjHandler={setSortObj}
            />
          )}
        </div>
      </div>
    </div>
  );
};
