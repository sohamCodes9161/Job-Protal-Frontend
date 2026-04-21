import { useState } from "react";

const FilterMenu = ({ filters, setFilters, setPage }) => {
  const [open, setOpen] = useState(false);
  const [view, setView] = useState("main");

  const [tempFilters, setTempFilters] = useState(filters);

  const handleOpen = () => {
    setTempFilters(filters);
    setOpen(!open);
    setView("main");
  };

  const handleSort = (value) => {
    setFilters((prev) => ({ ...prev, sort: value }));
    setPage(1);
    setOpen(false);
  };

  const handleJobType = (value) => {
    setTempFilters((prev) => {
      const exists = prev.jobType.includes(value);

      return {
        ...prev,
        jobType: exists
          ? prev.jobType.filter((t) => t !== value)
          : [...prev.jobType, value],
      };
    });
  };

  const handleApply = () => {
    setFilters((prev) => ({
      ...prev,
      ...tempFilters,
    }));
    setPage(1);
    setOpen(false);
  };

  const handleClear = () => {
    const cleared = {
      sort: "-createdAt",
      jobType: [],
    };

    setTempFilters(cleared);
    setFilters((prev) => ({
      ...prev,
      ...cleared,
    }));
    setPage(1);
  };

  return (
    <div className="filter-container">
      <button className="filter-btn" onClick={handleOpen}>
        ⚙️ Filter
      </button>

      {open && (
        <div className="filter-dropdown">

          {view === "main" && (
            <>
              <p onClick={() => setView("sort")}>Sort</p>
              <p onClick={() => setView("filter")}>Filter</p>
            </>
          )}

          {view === "sort" && (
            <>
              <button onClick={() => setView("main")}>⬅ Back</button>

              <p onClick={() => handleSort("-createdAt")}>Newest</p>
              <p onClick={() => handleSort("createdAt")}>Oldest</p>
              <p onClick={() => handleSort("-salary")}>High Paying</p>
              <p onClick={() => handleSort("salary")}>Low Paying</p>
            </>
          )}

          {view === "filter" && (
            <>
              <button onClick={() => setView("main")}>⬅ Back</button>
              <p onClick={() => setView("jobType")}>Job Type</p>
            </>
          )}

          {view === "jobType" && (
            <>
              <button onClick={() => setView("filter")}>⬅ Back</button>

              {["full-time", "part-time", "internship", "contract"].map((type) => (
                <p
                  key={type}
                  onClick={() => handleJobType(type)}
                  className={
                    tempFilters.jobType.includes(type) ? "active" : ""
                  }
                >
                  {type}
                </p>
              ))}

              <div className="filter-actions">
                <button onClick={handleApply}>Apply</button>
                <button onClick={handleClear}>Clear</button>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default FilterMenu;