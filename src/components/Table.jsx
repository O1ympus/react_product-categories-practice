import React, { useEffect, useState } from 'react';
import cn from 'classnames';
import categories from '../api/categories';
import users from '../api/users';

function findCategoryByProductId(id) {
  return categories.find(category => category.id === id);
}

function findUserByCategoryId(id) {
  return users.find(user => user.id === id);
}

function getUserByOwnerId(ownerId) {
  return (
    users.find(currentUser => currentUser.id === ownerId).name.toLowerCase() ??
    ''
  );
}

function sortColumn(arr, column, state) {
  return [...arr].sort((a, b) => {
    if (column === 'id') {
      if (state % 3 === 1) {
        return a[column] - b[column];
      }

      if (state % 3 === 2) {
        return b[column] - a[column];
      }

      return 0;
    }

    if (column === 'categoryId') {
      const categoryTitleA = findCategoryByProductId(a.categoryId).title;
      const categoryTitleB = findCategoryByProductId(b.categoryId).title;

      if (state % 3 === 1) {
        return categoryTitleA.localeCompare(categoryTitleB);
      }

      if (state % 3 === 2) {
        return -categoryTitleA.localeCompare(categoryTitleB);
      }

      return 0;
    }

    if (column === 'ownerId') {
      const categoryA = findCategoryByProductId(a.categoryId);
      const categoryB = findCategoryByProductId(b.categoryId);

      const nameA = getUserByOwnerId(categoryA[column]);
      const nameB = getUserByOwnerId(categoryB[column]);

      if (state % 3 === 1) {
        return nameA.localeCompare(nameB);
      }

      if (state % 3 === 2) {
        return -nameA.localeCompare(nameB);
      }

      return 0;
    }

    if (state % 3 === 1) {
      return a[column].toLowerCase().localeCompare(b[column].toLowerCase());
    }

    if (state % 3 === 2) {
      return -a[column].toLowerCase().localeCompare(b[column].toLowerCase());
    }

    return 0;
  });
}

export const Table = ({ products, sortObj, sortObjHandler }) => {
  const [sortedProducts, setSortedProducts] = useState([...products]);

  useEffect(() => {
    const activeSortEntry = Object.entries(sortObj).find(
      // eslint-disable-next-line no-unused-vars
      ([_, val]) => val !== 0,
    );

    if (!activeSortEntry) {
      setSortedProducts([...products]);

      return;
    }

    const [columnKey, state] = activeSortEntry;
    const columnMap = {
      ID: 'id',
      Product: 'name',
      Category: 'categoryId',
      User: 'ownerId',
    };

    const column = columnMap[columnKey];

    setSortedProducts(sortColumn(products, column, state));
  }, [products, sortObj]);

  return (
    <table
      data-cy="ProductTable"
      className="table is-striped is-narrow is-fullwidth"
    >
      <thead>
        <tr>
          {}
          <th>
            <span className="is-flex is-flex-wrap-nowrap">
              ID
              <a
                href="#/"
                onClick={() => {
                  sortObjHandler(prevState => {
                    const newState = {
                      ID: prevState.ID + 1,
                      Product: 0,
                      Category: 0,
                      User: 0,
                    };

                    setSortedProducts(
                      sortColumn([...products], 'id', newState.ID),
                    );

                    return newState;
                  });
                }}
              >
                <span className="icon">
                  <i
                    data-cy="SortIcon"
                    className={cn(
                      {
                        'fa-sort': sortObj.ID % 3 === 0,
                        'fa-sort-up': sortObj.ID % 3 === 1,
                        'fa-sort-down': sortObj.ID % 3 === 2,
                      },
                      'fas',
                    )}
                  />
                </span>
              </a>
            </span>
          </th>

          <th>
            <span className="is-flex is-flex-wrap-nowrap">
              Product
              <a
                href="#/"
                onClick={() => {
                  sortObjHandler(prevState => {
                    const newState = {
                      ID: 0,
                      Product: prevState.Product + 1,
                      Category: 0,
                      User: 0,
                    };

                    setSortedProducts(
                      sortColumn([...products], 'name', newState.Product),
                    );

                    return newState;
                  });
                }}
              >
                <span className="icon">
                  <i
                    data-cy="SortIcon"
                    className={cn(
                      {
                        'fa-sort': sortObj.Product % 3 === 0,
                        'fa-sort-up': sortObj.Product % 3 === 1,
                        'fa-sort-down': sortObj.Product % 3 === 2,
                      },
                      'fas',
                    )}
                  />
                </span>
              </a>
            </span>
          </th>

          <th>
            <span className="is-flex is-flex-wrap-nowrap">
              Category
              <a
                href="#/"
                onClick={() => {
                  sortObjHandler(prevState => {
                    const newState = {
                      ID: 0,
                      Product: 0,
                      Category: prevState.Category + 1,
                      User: 0,
                    };

                    setSortedProducts(
                      sortColumn(
                        [...products],
                        'categoryId',
                        newState.Category,
                      ),
                    );

                    return newState;
                  });
                }}
              >
                <span className="icon">
                  <i
                    data-cy="SortIcon"
                    className={cn(
                      {
                        'fa-sort': sortObj.Category % 3 === 0,
                        'fa-sort-up': sortObj.Category % 3 === 1,
                        'fa-sort-down': sortObj.Category % 3 === 2,
                      },
                      'fas',
                    )}
                  />
                </span>
              </a>
            </span>
          </th>

          <th>
            <span className="is-flex is-flex-wrap-nowrap">
              User
              <a
                href="#/"
                onClick={() => {
                  sortObjHandler(prevState => {
                    const newState = {
                      ID: 0,
                      Product: 0,
                      Category: 0,
                      User: prevState.User + 1,
                    };

                    setSortedProducts(
                      sortColumn([...products], 'ownerId', newState.User),
                    );

                    return newState;
                  });
                }}
              >
                <span className="icon">
                  <i
                    data-cy="SortIcon"
                    className={cn(
                      {
                        'fa-sort': sortObj.User % 3 === 0,
                        'fa-sort-up': sortObj.User % 3 === 1,
                        'fa-sort-down': sortObj.User % 3 === 2,
                      },
                      'fas',
                    )}
                  />
                </span>
              </a>
            </span>
          </th>
        </tr>
      </thead>
      <tbody>
        {sortedProducts.map(product => {
          const category = findCategoryByProductId(product.categoryId);
          const user = findUserByCategoryId(category.ownerId);

          return (
            <tr key={product.id} data-cy="Product">
              <td className="has-text-weight-bold" data-cy="ProductId">
                {product.id}
              </td>

              <td data-cy="ProductName">{product.name}</td>
              <td data-cy="ProductCategory">
                {category.icon} - {category.title}
              </td>

              <td
                data-cy="ProductUser"
                className={cn({
                  'has-text-link': user.sex === 'm',
                  'has-text-danger': user.sex === 'f',
                })}
              >
                {user.name}
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
};
