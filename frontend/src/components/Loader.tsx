import { useLoader } from '../context/LoaderContext';
import './Loader.css';

const Loader = () => {
  const { loading } = useLoader();

  if (!loading) return null;

  return (
    <div className="global-loader-overlay">
      <div className="global-loader">
        <div className="global-spinner" />
        <p>Loading...</p>
      </div>
    </div>
  );
};

export default Loader;
