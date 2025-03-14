import React from 'react';
import { Pagination } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const Paginate = ({ pages = 1, page = 1, keyword = '', category = '' }) => {
  if (pages <= 1) return null;

  return (
    <Pagination className="justify-content-center my-4">
      {[...Array(pages).keys()].map((x) => (
        <Pagination.Item key={x + 1} active={x + 1 === page}>
          <Link 
            to={
              keyword
                ? `/search/${keyword}/page/${x + 1}`
                : category
                ? `/category/${category}/page/${x + 1}`
                : `/page/${x + 1}`
            }
            style={{ 
              color: x + 1 === page ? '#fff' : '#007bff',
              textDecoration: 'none'
            }}
          >
            {x + 1}
          </Link>
        </Pagination.Item>
      ))}
    </Pagination>
  );
};

export default Paginate; 