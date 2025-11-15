import React from 'react';

// Le composant Modal est une fenêtre pop-up réutilisable.
// Il prend les props suivantes :
// - isOpen: un booléen qui contrôle la visibilité de la modale.
// - onClose: une fonction à appeler lorsque la modale doit être fermée.
// - title: le titre affiché en haut de la modale.
// - children: le contenu à afficher à l'intérieur du corps de la modale.
const Modal = ({ isOpen, onClose, title, children }) => {
    // Si la modale n'est pas ouverte, ne rien rendre.
    if (!isOpen) return null;

    return (
        // Conteneur principal de la modale.
        // 'fixed inset-0' le positionne sur tout l'écran.
        // 'z-50' assure qu'il est au-dessus des autres éléments.
        // 'flex items-center justify-center' centre la modale.
        // 'bg-black bg-opacity-50' crée un arrière-plan semi-transparent.
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            {/* Conteneur interne pour limiter la largeur de la modale. */}
            <div className="relative w-full max-w-md p-4">
                {/* Le contenu réel de la modale. */}
                <div className="relative rounded-lg bg-white p-6 shadow-lg">
                    {/* En-tête de la modale avec titre et bouton de fermeture. */}
                    <div className="flex items-center justify-between pb-4 border-b">
                        <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
                        {/* Bouton de fermeture de la modale. */}
                        <button
                            type="button"
                            className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center"
                            onClick={onClose} // Appelle la fonction onClose passée en prop.
                        >
                            {/* Icône de fermeture (Material Symbols). */}
                            <span className="material-symbols-outlined">close</span>
                        </button>
                    </div>
                    {/* Corps de la modale où le contenu enfant est rendu. */}
                    <div className="pt-4">
                        {children}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Modal;
