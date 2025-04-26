import React from 'react';
import IMG from "../images/ab.jpg";
import IMG2 from "../images/AB3.webp";
import IMG3 from "../images/Ab5.webp";
import IMG4 from "../images/AB@.webp";

const HIW = () => {
  const cards = [
    { id: 1, title: ' ', description: ' ', image: IMG },
    { id: 2, title: ' ', description: ' ', image: IMG2 },
    { id: 3, title: ' ', description: ' ', image: IMG3 },
    { id: 4, title: ' ', description: ' ', image: IMG4 },
  ];

  return (
    <div className="min-h-screen flex flex-wrap justify-center items-center gap-1 p-8 bg-gradient-to-br from-gray-900 to-gray-800">
      {cards.map((card) => (
        <div
          key={card.id}
          className="w-72 p-6 rounded-xl bg-white/10 border border-white/20 text-white backdrop-blur-md shadow-lg hover:scale-105 transition-transform duration-300"
        >
          <img
            src={card.image}
            alt={card.title}
            className="w-full h-40 object-fit rounded-lg mb-4"
          />
          <h3 className="text-xl font-semibold mb-2">{card.title}</h3>
          <p className="text-sm">{card.description}</p>
        </div>
      ))}
    </div>
  );
};

export default HIW;
