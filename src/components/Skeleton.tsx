import ContentLoader from 'react-content-loader';

const MyLoader = () => (
   <ContentLoader
      speed={2}
      width={305}
      height={355}
      viewBox="0 0 305 355"
      backgroundColor="#cfcfcf"
      foregroundColor="#ecebeb">
      <rect x="17" y="0" rx="10" ry="10" width="272" height="217" />
      <rect x="18" y="234" rx="5" ry="5" width="180" height="25" />
      <rect x="21" y="280" rx="8" ry="8" width="72" height="26" />
      <rect x="190" y="268" rx="21" ry="21" width="110" height="46" />
   </ContentLoader>
);

export default MyLoader;
