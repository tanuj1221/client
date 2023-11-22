import React, { useState } from 'react';
import Cookies from 'js-cookie';

const CookieConsent = () => {

  const [show, setShow] = useState(() => {
    // Check if the cookie consent has already been accepted
    const consent = Cookies.get('cookieConsent');
    // If the cookie does not exist, show the consent request
    return consent ? false : true;
  });

  const acceptCookies = () => {
    // Set a cookie to remember that the consent was accepted
    Cookies.set('cookieConsent', 'accepted', { expires: 365, path: '/' });
    // Hide the cookie consent request
    setShow(false);
  };

  // If the consent was already accepted, don't show anything
  if (!show) return null;

  return (
    <div>
      This website uses cookies to ensure you get the best experience on our website.
      <button onClick={acceptCookies}>Accept</button>
    </div>
  );
};

export default CookieConsent;