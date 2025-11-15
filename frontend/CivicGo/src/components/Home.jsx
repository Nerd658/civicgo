import React from 'react';

const Home = () => {
  return (
    // Conteneur principal de la page d'accueil.
    // Centre le contenu verticalement et horizontalement, et définit les couleurs de fond et de texte.
    <div className="flex items-center justify-center min-h-screen bg-background-light dark:bg-background-dark text-text-light dark:text-text-dark">
      {/* Titre de bienvenue de l'application. */}
      <h1 className="text-4xl font-bold">Welcome to CivicGo!</h1>
    </div>
  );
};

export default Home;