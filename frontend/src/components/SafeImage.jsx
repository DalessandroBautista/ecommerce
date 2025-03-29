import React, { useState } from 'react';
import { Image } from 'react-bootstrap';
import placeholderImg from '../assets/images/placeholder.png';

const SafeImage = ({ src, alt, className, style }) => {
  const [imgSrc, setImgSrc] = useState(src);
  const [hasError, setHasError] = useState(false);

  const handleError = () => {
    if (!hasError) {
      setImgSrc(placeholderImg);
      setHasError(true);
    }
  };

  return (
    <Image
      src={imgSrc}
      alt={alt}
      className={className}
      style={style}
      onError={handleError}
      fluid
    />
  );
};

export default SafeImage; 