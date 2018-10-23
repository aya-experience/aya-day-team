import React from "react";
import classNames from 'classnames'

export const Element = ({ member, reversed, handleClick }) => {
    const name = member.name;
    const imageSrc = member.img;
    const role = member.role;
    const handleEvent = (event) => handleClick(name, event);

  return (
      <div className="element mt2" onClick={handleEvent}>
        <div className={
            classNames(reversed? "pr4 flex-row-reverse reversed" : "pl4", "flex flex-row pt2 pb2")
        }>
            <img
            src={require(`../data/images/${imageSrc}`)}
            alt={name}
            className="rounded"
            />
            <div className={
                classNames(
                    {"items-end tr": reversed},
                    "details flex flex-column w-100 self-end"
                )}>
                <span className="name tracked">{name}</span>
                <span className="tracked">{role}</span>
                <div className="line"/>
            </div>
        </div>
      </div>
  );
};
