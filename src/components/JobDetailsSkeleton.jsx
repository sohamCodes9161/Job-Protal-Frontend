const JobDetailsSkeleton = () => {
  return (
    <div className="job-details-container">
      <div className="job-details-card skeleton">

        <div className="skeleton-title"></div>
        <div className="skeleton-text short"></div>

        <div className="job-section">
          <div className="skeleton-title small"></div>
          <div className="skeleton-text"></div>
          <div className="skeleton-text"></div>
        </div>

        <div className="job-section">
          <div className="skeleton-title small"></div>
          <div className="skeleton-text"></div>
        </div>

        <div className="skeleton-button"></div>

      </div>
    </div>
  );
};

export default JobDetailsSkeleton;