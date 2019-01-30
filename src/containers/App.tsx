import React, { useEffect } from 'react';
import Home from 'containers/Home';
import ReviewDialog from 'containers/ReviewDialog';
import Review from 'containers/Review';
import ReviewReport from 'containers/ReviewReport';
import AddCardsModal from 'containers/AddCardsModal';
import { listenToCardsChange } from 'state/cards';
import CardsList from 'containers/CardsList';
import Login from 'containers/Login';
import LoadingCards from 'containers/LoadingCards';

const App = () => (
  <>
    <Home />
    <ReviewDialog />
    <Review />
    <ReviewReport />
    <AddCardsModal />
    <CardsList />
    <LoadingCards />
    <Login />
  </>
);

export default App;
