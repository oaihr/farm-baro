import React, { useState, useEffect } from 'react';

const ImageSlider = ({ images, interval = 3000 }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // 자동 슬라이드
  useEffect(() => {
    if (images.length === 0) return;

    const timer = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, interval);

    return () => clearInterval(timer);
  }, [images, interval]);

 
  const nextImage = () => {
    setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prevIndex) => (prevIndex - 1 + images.length) % images.length);
  };

  if (!images || images.length === 0) {
    return <div>이미지가 없습니다.</div>;
  }

  const currentImage = images[currentImageIndex];

  return (
    <div style={{ position: 'relative', width: '100%', maxWidth: '900px'}}>
      <img
        src={currentImage.imageUrl}
        alt={`Slide ${currentImageIndex}`}
        style={{ width: '100%', display: 'block' }}
      />
      <button
        onClick={prevImage}
        style={{
          position: 'absolute',
          top: '50%',
          left: '10px',
          transform: 'translateY(-50%)',
          fontSize: '2rem',
          backgroundColor: 'transparent',
          color: 'white',
          border: 'none',
          cursor: 'pointer',
        }}
      >
        &#10094;
      </button>
      <button
        onClick={nextImage}
        style={{
          position: 'absolute',
          top: '50%',
          right: '10px',
          transform: 'translateY(-50%)',
          fontSize: '2rem',
          backgroundColor: 'transparent',
          color: 'white',
          border: 'none',
          cursor: 'pointer',
        }}
      >
        &#10095;
      </button>
    </div>
  );
};

export default ImageSlider;