import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface LoaderContextType {
  loading: boolean;
}

const LoaderContext = createContext<LoaderContextType>({ loading: false });

export const useLoader = () => useContext(LoaderContext);

let setter: ((val: boolean) => void) | null = null;
let counter = 0;

export const showLoader = () => {
  counter++;
  if (counter === 1 && setter) {
    setter(true);
  }
};

export const hideLoader = () => {
  counter--;
  if (counter <= 0) {
    counter = 0;
    if (setter) setter(false);
  }
};

export const LoaderProvider = ({ children }: { children: ReactNode }) => {
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setter = setLoading;
    return () => { setter = null; };
  }, []);

  return (
    <LoaderContext.Provider value={{ loading }}>
      {children}
    </LoaderContext.Provider>
  );
};
