import { Card, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { FaShoppingCart } from 'react-icons/fa';
import Rating from './Rating';
import { addItem, updateCartItems } from '../redux/slices/cartSlice';

const ProductCard = ({ product }) => {
  const dispatch = useDispatch();

  const addToCartHandler = () => {
    const item = {
      product: product._id,
      name: product.name,
      image: product.image,
      price: product.price,
      quantity: 1,
    };
    
    dispatch(addItem(item));
    dispatch(updateCartItems([item]));
  };

  return (
    <Card className="product-card my-3">
      <Link to={`/product/${product._id}`}>
        <Card.Img src={product.image} variant="top" />
      </Link>

      <Card.Body>
        <Link to={`/product/${product._id}`} className="text-decoration-none">
          <Card.Title as="h5" className="product-title">
            {product.name}
          </Card.Title>
        </Link>
        

        <Card.Text as="div">
          <Rating
            value={product.rating}
            text={`${product.numReviews} reseñas`}
          />
        </Card.Text>

        <Card.Text as="h4" className="price mt-2">
          ${product.price.toFixed(2)}
        </Card.Text>

        <Button 
          variant="primary" 
          className="btn-add-cart"
          onClick={addToCartHandler}
          disabled={product.countInStock === 0}
        >
          <FaShoppingCart className="me-2" />
          {product.countInStock > 0 ? 'Añadir al carrito' : 'Sin stock'}
        </Button>
      </Card.Body>
    </Card>
  );
};

export default ProductCard;
