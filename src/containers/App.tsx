import React, { useEffect } from 'react';
import Home from 'containers/Home';
import ReviewDialog from 'containers/ReviewDialog';
import Review from 'containers/Review';
import ReviewReport from 'containers/ReviewReport';
import AddCardsModal from 'containers/AddCardsModal';
import { listenToCardsChange } from 'state/cards';
import CardsList from 'containers/CardsList';

const App = () => {
  useEffect(() => {
    listenToCardsChange();
  }, []);

  return (
    <>
      <Home />
      <ReviewDialog />
      <Review />
      <ReviewReport />
      <AddCardsModal />
      <CardsList />
    </>
  );
};

export default App;
