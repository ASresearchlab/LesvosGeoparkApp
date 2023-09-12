import React from 'react';
import Standard from './standard';
import RealEstate from './real_estate';
import Food from './food';
import {useSelector} from 'react-redux';
import {listingStyleSelect} from '@selectors';

export default function Index(props) {
  const listingStyleStorage = useSelector(listingStyleSelect);

  const factoryDetail = () => {
    switch (listingStyleStorage) {
      case 'real_estate':
        return <RealEstate {...props} />;
      case 'food':
        return <Food {...props} />;
      default:
        return <Standard {...props} />;
    }
  };

  return factoryDetail();
}
