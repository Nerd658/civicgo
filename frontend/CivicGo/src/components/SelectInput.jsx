import React from 'react';

// Le composant SelectInput est un champ de sélection (dropdown) réutilisable.
// Il prend les props suivantes :
// - label: le texte du libellé affiché au-dessus du champ.
// - options: un tableau d'objets { value, label } pour les options du sélecteur.
// - value: la valeur actuellement sélectionnée du champ.
// - onChange: une fonction à appeler lorsque la valeur du champ change.
const SelectInput = ({ label, options, value, onChange }) => {
    // Définition des couleurs utilisées pour le style du champ.
    const borderColorLight = '#D4BFA5';
    const textColorLight = '#4A3B29';
    const primaryColor = '#D17F23';

    return (
        // Conteneur principal du champ de sélection, incluant le libellé.
        <label className="flex flex-col min-w-40 flex-1">
            {/* Libellé du champ de sélection. */}
            <span className="text-sm font-medium leading-normal pb-2">{label}</span>
            {/* Conteneur stylisé pour le champ de sélection, avec une ombre. */}
            <div className="flex w-full flex-1 items-stretch rounded-xl shadow-lg" style={{ boxShadow: `0 10px 15px -3px rgba(209, 127, 35, 0.1), 0 4px 6px -2px rgba(209, 127, 35, 0.05)` }}>
                {/* L'élément <select> HTML. */}
                <select
                    className="form-select flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-xl focus:outline-0 focus:ring-2 h-14 p-[15px] text-base font-normal leading-normal"
                    style={{
                        color: textColorLight,
                        borderColor: borderColorLight,
                        backgroundColor: 'rgba(255, 255, 255, 0.8)',
                        '--tw-focus-ring-color': `rgba(${parseInt(primaryColor.slice(1, 3), 16)}, ${parseInt(primaryColor.slice(3, 5), 16)}, ${parseInt(primaryColor.slice(5, 7), 16)}, 0.5)`,
                    }}
                    value={value}    // La valeur sélectionnée.
                    onChange={onChange} // Le gestionnaire d'événements pour le changement de valeur.
                >
                    {/* Parcours des options passées en prop pour créer les éléments <option>. */}
                    {options.map((option, index) => (
                        <option key={index} value={option.value}>{option.label}</option>
                    ))}
                </select>
            </div>
        </label>
    );
};

export default SelectInput;