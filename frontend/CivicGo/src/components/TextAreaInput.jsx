import React from 'react';

// Le composant TextAreaInput est un champ de texte multiligne réutilisable.
// Il prend les props suivantes :
// - label: le texte du libellé affiché au-dessus du champ.
// - placeholder: le texte d'espace réservé affiché dans le champ.
// - value: la valeur actuelle du champ.
// - onChange: une fonction à appeler lorsque la valeur du champ change.
// - rows: le nombre initial de lignes visibles dans le champ (par défaut 3).
const TextAreaInput = ({ label, placeholder, value, onChange, rows = 3 }) => {
    // Définition des couleurs utilisées pour le style du champ.
    const borderColorLight = '#D4BFA5';
    const textColorLight = '#4A3B29';
    const primaryColor = '#D17F23';
    const placeholderLight = '#8C7B68';

    return (
        // Conteneur principal du champ de texte, incluant le libellé.
        <label className="flex flex-col min-w-40 flex-1">
            {/* Libellé du champ de texte. */}
            <span className="text-sm font-medium leading-normal pb-2">{label}</span>
            {/* Conteneur stylisé pour le champ de texte, avec une ombre. */}
            <div className="flex w-full flex-1 items-stretch rounded-xl shadow-lg" style={{ boxShadow: `0 10px 15px -3px rgba(209, 127, 35, 0.1), 0 4px 6px -2px rgba(209, 127, 35, 0.05)` }}>
                {/* L'élément <textarea> HTML. */}
                <textarea
                    className="form-textarea flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-xl focus:outline-0 focus:ring-2 p-[15px] text-base font-normal leading-normal"
                    style={{
                        color: textColorLight,
                        borderColor: borderColorLight,
                        backgroundColor: 'rgba(255, 255, 255, 0.8)',
                        '--tw-focus-ring-color': `rgba(${parseInt(primaryColor.slice(1, 3), 16)}, ${parseInt(primaryColor.slice(3, 5), 16)}, ${parseInt(primaryColor.slice(5, 7), 16)}, 0.5)`,
                        '::placeholder': { color: placeholderLight }
                    }}
                    placeholder={placeholder} // Texte d'espace réservé.
                    rows={rows}             // Nombre de lignes visibles.
                    value={value}           // La valeur actuelle du champ.
                    onChange={onChange}     // Le gestionnaire d'événements pour le changement de valeur.
                ></textarea>
            </div>
        </label>
    );
};

export default TextAreaInput;