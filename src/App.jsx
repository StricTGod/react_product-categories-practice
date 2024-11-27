/* eslint-disable jsx-a11y/accessible-emoji */
import React, { useState } from 'react';
import classNames from 'classnames';

import './App.scss';

import usersFromServer from './api/users';
import categoriesFromServer from './api/categories';
import productsFromServer from './api/products';

// const products = productsFromServer.map((product) => {
//   const category = null; // find by product.categoryId
//   const user = null; // find by category.ownerId

//   return null;
// });

const categoriesWithUsersAndProducts = categoriesFromServer.map(category => {
  const userName = usersFromServer.find(user => user.id === category.ownerId);
  const products = productsFromServer.filter(
    product => product.categoryId === category.id,
  );

  return { ...category, owner: userName, products };
});

const filterAndSortPeople = (people, params) => {
  const copyPeople = [...people];
  const { query, sortBy, sortingOrder } = params;

  if (query) {
    copyPeople.filter(person =>
      person.name.toLowerCase().includes(query.toLowerCase()))
  }

  if (sortBy !== '') {
    copyPeople.sort((item1, item2) => {
      switch (sortBy) {
        case 'byProduct':
        case 'byCategory':
          return item1.localeCompare(item2);
        default:
          return 0;
      }
    });
  }

  if (sortingOrder) {
    //
  }

  return copyPeople;
};

export const App = () => {
  const [selectedPeople, setSelectedPeople] = useState([]);
  const [query, setQuery] = useState(null);
  const [sortBy, setSortBy] = useState(null);
  const [sortingOrder, setSortingOrder] = useState('asc');

  const onPersonClick = slug => () => {
    if (selectedPeople.includes(slug)) {
      setSelectedPeople(selectedPeople.filter(person => person !== slug));
    } else {
      setSelectedPeople([...selectedPeople, slug]);
    }
  };

  return (
    <div className="section">
      <div className="container">
        <h1 className="title">Product Categories</h1>

        <div className="block">
          <nav className="panel">
            <p className="panel-heading">Filters</p>

            <p className="panel-tabs has-text-weight-bold">
              <a data-cy="FilterAllUsers" href="#/">
                All
              </a>

              {usersFromServer
                .filter(
                  (user, index, array) =>
                    array.findIndex(userName => userName.name === user.name) ===
                    index,
                )
                .map(user => (
                  <a
                    key={user.id}
                    data-cy="FilterUser"
                    href="#/"
                    onClick={onPersonClick(user.slug)}
                    // className={classNames({
                    //   'is-active': selectedPeople.includes(
                    //     user.slug,
                    //   ),
                    // })}
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
                  value={query}
                  onChange={event => setQuery(event.target.value)}
                />

                <span className="icon is-left">
                  <i className="fas fa-search" aria-hidden="true" />
                </span>

                <span className="icon is-right">
                  {/* eslint-disable-next-line jsx-a11y/control-has-associated-label */}
                  <button
                    data-cy="ClearButton"
                    type="button"
                    className="delete"
                  />
                </span>
              </p>
            </div>

            <div className="panel-block is-flex-wrap-wrap">
              <a
                href="#/"
                data-cy="AllCategories"
                className="button is-success mr-6 is-outlined"
              >
                All
              </a>

              {categoriesFromServer.map(category => (
                <a
                  key={category.id}
                  data-cy="Category"
                  className="button mr-2 my-1 is-info"
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
                className="button is-link is-outlined is-fullwidth"
              >
                Reset all filters
              </a>
            </div>
          </nav>
        </div>

        <div className="box table-container">
          <p data-cy="NoMatchingMessage">
            No products matching selected criteria
          </p>

          <table
            data-cy="ProductTable"
            className="table is-striped is-narrow is-fullwidth"
          >
            <thead>
              <tr>
                <th>
                  <span className="is-flex is-flex-wrap-nowrap">
                    ID
                    <a href="#/">
                      <span className="icon">
                        <i data-cy="SortIcon" className="fas fa-sort" />
                      </span>
                    </a>
                  </span>
                </th>

                <th>
                  <span className="is-flex is-flex-wrap-nowrap">
                    Product
                    <a href="#/">
                      <span className="icon">
                        <i data-cy="SortIcon" className="fas fa-sort-down" />
                      </span>
                    </a>
                  </span>
                </th>

                <th>
                  <span className="is-flex is-flex-wrap-nowrap">
                    Category
                    <a href="#/">
                      <span className="icon">
                        <i data-cy="SortIcon" className="fas fa-sort-up" />
                      </span>
                    </a>
                  </span>
                </th>

                <th>
                  <span className="is-flex is-flex-wrap-nowrap">
                    User
                    <a href="#/">
                      <span className="icon">
                        <i data-cy="SortIcon" className="fas fa-sort" />
                      </span>
                    </a>
                  </span>
                </th>
              </tr>
            </thead>

            {categoriesWithUsersAndProducts.map(category => (
              <tbody key={category.id}>
                {category.products.map(product => (
                  <tr data-cy="Product" key={product.id}>
                    <td className="has-text-weight-bold" data-cy="ProductId">
                      {product.id}
                    </td>
                    <td data-cy="ProductName">{product.name}</td>
                    <td data-cy="ProductCategory">
                      {category.icon} - {category.title}
                    </td>
                    <td
                      data-cy="ProductUser"
                      className={classNames({
                        'has-text-link': category.owner.sex === 'm',
                        'has-text-danger': category.owner.sex === 'f',
                      })}
                    >
                      {category.owner.name}
                    </td>
                  </tr>
                ))}
              </tbody>
            ))}
          </table>
        </div>
      </div>
    </div>
  );
};
