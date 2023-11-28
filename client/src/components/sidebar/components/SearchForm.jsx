import React, { useState } from 'react';
import Input from '../../input/Input.jsx';

export const SearchForm = ({
  onSearch,
  searchByKm,
  setSearchByKm,
  setCircle,
}) => {
  const onChange = ({ target: { value } }) => {
    setSearchByKm(value);
    setCircle((prev) => ({ ...prev, radius: value * 1000 }));
  };
  return (
    <div style={{ border: 1, borderRadius: '0.5rem' }}>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          onSearch();
        }}
        className="sidebar__search-bar"
      >
        <Input
          id="search"
          name="searchByKm"
          type="number"
          placeholder={'Search By Km'}
          autofocus
          clearable={false}
          className="sidebar__search-input"
          value={searchByKm}
          onChange={onChange}
        />
        <button
          className="sidebar__open-close-button"
          style={{ borderRadius: '1rem', maxWidth: 66 }}
          type="submit"
        >
          Search
        </button>
      </form>
    </div>
  );
};
