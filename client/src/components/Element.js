import React from 'react';
import classNames from 'classnames';

/* eslint-disable */

const Element = ({ member, reversed, handleClick }) => {
  const { name, role } = member;
  const imageSrc = member.img;
  const handleEvent = event => handleClick(name, event);

  return (
    <div className="element mt2" onClick={() => {}} onKeyDown={handleEvent}>
      <div
        className={classNames(
          reversed ? 'pr4 flex-row-reverse reversed' : 'pl4',
          'flex flex-row pt2 pb2'
        )}
      >
        <img
          src={require(`../data/images/${imageSrc}`)}
          alt={name}
          className="rounded"
        />
        <div
          className={classNames(
            { 'items-end tr': reversed },
            'details flex flex-column w-100 self-end'
          )}
        >
          <span className="name tracked">{name}</span>
          <span className="tracked">{role}</span>
          <div className="line" />
        </div>
      </div>
    </div>
  );
};

export default Element;
